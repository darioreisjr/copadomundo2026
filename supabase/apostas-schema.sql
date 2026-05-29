-- ============================================================
-- Apostas P2P — sistema de apostas de selos entre usuários
-- Idempotente: pode ser rodado múltiplas vezes sem erros.
-- Run this in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. Coluna metadata em notifications (para armazenar wager_id)
-- ============================================================
alter table public.notifications add column if not exists metadata jsonb;

-- ============================================================
-- 2. Tabela wagers — uma linha por aposta criada
-- ============================================================
create table if not exists public.wagers (
  id               uuid        primary key default gen_random_uuid(),
  game_id          uuid        not null references public.games(id) on delete cascade,
  creator_id       uuid        not null references public.profiles(id) on delete cascade,
  wager_type       text        not null check (wager_type in ('direct','open','group')),
  amount           int         not null check (amount >= 1),
  max_participants int         not null default 1,
  status           text        not null default 'pending'
                               check (status in ('pending','active','cancelled','settled_win','settled_tie')),
  winner_id        uuid        references public.profiles(id),
  target_user_id   uuid        references public.profiles(id),
  message          text,
  created_at       timestamptz not null default now(),
  settled_at       timestamptz
);

create index if not exists wagers_game_id    on public.wagers(game_id);
create index if not exists wagers_creator_id on public.wagers(creator_id);
create index if not exists wagers_status     on public.wagers(status);
create index if not exists wagers_target     on public.wagers(target_user_id) where target_user_id is not null;

alter table public.wagers enable row level security;

drop policy if exists "wagers: read all for authenticated" on public.wagers;
drop policy if exists "wagers: creator updates own"        on public.wagers;
drop policy if exists "wagers: authenticated inserts"      on public.wagers;

create policy "wagers: read all for authenticated" on public.wagers
  for select using (auth.uid() is not null);

create policy "wagers: creator updates own" on public.wagers
  for update using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

create policy "wagers: authenticated inserts" on public.wagers
  for insert with check (auth.uid() = creator_id);

-- ============================================================
-- 3. Tabela wager_participants — aceitantes (não inclui criador)
-- ============================================================
create table if not exists public.wager_participants (
  id        uuid        primary key default gen_random_uuid(),
  wager_id  uuid        not null references public.wagers(id) on delete cascade,
  user_id   uuid        not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (wager_id, user_id)
);

create index if not exists wp_wager_id on public.wager_participants(wager_id);
create index if not exists wp_user_id  on public.wager_participants(user_id);

alter table public.wager_participants enable row level security;

drop policy if exists "wp: read own"        on public.wager_participants;
drop policy if exists "wp: creator reads"   on public.wager_participants;
drop policy if exists "wp: public read"     on public.wager_participants;
drop policy if exists "wp: authenticated inserts" on public.wager_participants;

create policy "wp: read own" on public.wager_participants
  for select using (auth.uid() = user_id);

create policy "wp: creator reads" on public.wager_participants
  for select using (
    exists (select 1 from public.wagers where id = wager_id and creator_id = auth.uid())
  );

create policy "wp: public read" on public.wager_participants
  for select using (
    exists (select 1 from public.wagers where id = wager_id and status in ('pending','active','settled_win','settled_tie','cancelled'))
  );

create policy "wp: authenticated inserts" on public.wager_participants
  for insert with check (auth.uid() = user_id);

-- ============================================================
-- 4. Entradas em seal_rewards para tipos de aposta
-- ============================================================
insert into public.seal_rewards (event_key, label, seals, icon, active)
values
  ('wager_won',       'Aposta vencida',   0, 'mdi-handshake',         true),
  ('wager_tied',      'Aposta empatada',  0, 'mdi-handshake-outline', true),
  ('wager_lost',      'Aposta perdida',   0, 'mdi-sword-cross',       true),
  ('wager_cancelled', 'Aposta cancelada', 0, 'mdi-cancel',            true)
on conflict (event_key) do nothing;

-- ============================================================
-- 5. RPC create_wager — cria aposta e debita selos do criador
-- ============================================================
create or replace function public.create_wager(
  p_game_id          uuid,
  p_wager_type       text,
  p_amount           int,
  p_max_participants int  default 1,
  p_target_username  text default null,
  p_message          text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_game          public.games%rowtype;
  v_creator_seals int;
  v_target_id     uuid;
  v_wager_id      uuid;
  v_creator_name  text;
begin
  -- Validar tipo
  if p_wager_type not in ('direct','open','group') then
    raise exception 'invalid_wager_type';
  end if;

  -- Validar valor mínimo
  if p_amount < 1 then
    raise exception 'amount_too_low';
  end if;

  -- Carregar jogo
  select * into v_game from games where id = p_game_id;
  if not found then raise exception 'game_not_found'; end if;
  if v_game.status <> 'open' then raise exception 'game_not_open'; end if;
  if v_game.bet_closes_at <= now() then raise exception 'bet_window_closed'; end if;

  -- Criador deve ter palpite para o jogo
  if not exists (select 1 from bets where user_id = auth.uid() and game_id = p_game_id) then
    raise exception 'no_palpite';
  end if;

  -- Verificar saldo de selos
  select total_seals into v_creator_seals from profiles where id = auth.uid();
  if v_creator_seals < p_amount then raise exception 'insufficient_seals'; end if;

  -- Resolver alvo para aposta direta
  if p_wager_type = 'direct' then
    if p_target_username is null then raise exception 'target_required_for_direct'; end if;
    select id into v_target_id from profiles where username = lower(trim(p_target_username));
    if not found then raise exception 'target_user_not_found'; end if;
    if v_target_id = auth.uid() then raise exception 'cannot_challenge_self'; end if;
  end if;

  -- Validar max_participants para grupo
  if p_wager_type = 'group' then
    if p_max_participants < 2 or p_max_participants > 9 then
      raise exception 'invalid_max_participants';
    end if;
  else
    p_max_participants := 1;
  end if;

  -- Inserir aposta
  insert into wagers (game_id, creator_id, wager_type, amount, max_participants, target_user_id, message)
  values (p_game_id, auth.uid(), p_wager_type, p_amount, p_max_participants, v_target_id, p_message)
  returning id into v_wager_id;

  -- Debitar selos do criador
  update profiles set total_seals = total_seals - p_amount where id = auth.uid();

  -- Notificar alvo em aposta direta
  if p_wager_type = 'direct' and v_target_id is not null then
    select coalesce(nome_fantasia, name, username) into v_creator_name
    from profiles where id = auth.uid();

    insert into notifications (user_id, type, title, description, metadata)
    values (
      v_target_id,
      'wager_challenge',
      'Você foi desafiado!',
      v_creator_name || ' te desafiou em uma aposta de ' || p_amount || ' selos no jogo '
        || v_game.team_a || ' vs ' || v_game.team_b || '.',
      jsonb_build_object('wager_id', v_wager_id)
    );
  end if;

  return (select row_to_json(w)::jsonb from wagers w where id = v_wager_id);
end;
$$;

-- ============================================================
-- 6. RPC accept_wager — aceita aposta e debita selos do aceitante
-- ============================================================
create or replace function public.accept_wager(p_wager_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_wager      public.wagers%rowtype;
  v_count      int;
  v_seals      int;
  v_game       public.games%rowtype;
  v_user_name  text;
begin
  select * into v_wager from wagers where id = p_wager_id for update;
  if not found then raise exception 'wager_not_found'; end if;
  if v_wager.status <> 'pending' then raise exception 'wager_not_pending'; end if;
  if v_wager.creator_id = auth.uid() then raise exception 'cannot_accept_own_wager'; end if;

  -- Aposta direta: apenas o alvo pode aceitar
  if v_wager.wager_type = 'direct' and v_wager.target_user_id <> auth.uid() then
    raise exception 'not_the_target';
  end if;

  -- Verificar se o jogo ainda está aberto
  select * into v_game from games where id = v_wager.game_id;
  if v_game.status <> 'open' or v_game.bet_closes_at <= now() then
    raise exception 'game_closed';
  end if;

  -- Aceitante deve ter palpite para o jogo
  if not exists (select 1 from bets where user_id = auth.uid() and game_id = v_wager.game_id) then
    raise exception 'no_palpite';
  end if;

  -- Sem participação duplicada
  if exists (select 1 from wager_participants where wager_id = p_wager_id and user_id = auth.uid()) then
    raise exception 'already_participating';
  end if;

  -- Verificar saldo
  select total_seals into v_seals from profiles where id = auth.uid();
  if v_seals < v_wager.amount then raise exception 'insufficient_seals'; end if;

  -- Inserir participante
  insert into wager_participants (wager_id, user_id) values (p_wager_id, auth.uid());

  -- Debitar selos
  update profiles set total_seals = total_seals - v_wager.amount where id = auth.uid();

  -- Contar participantes atuais
  select count(*) into v_count from wager_participants where wager_id = p_wager_id;

  -- Ativar aposta se lotada
  if v_count >= v_wager.max_participants then
    update wagers set status = 'active' where id = p_wager_id;
  end if;

  -- Notificar criador
  select coalesce(nome_fantasia, name, username) into v_user_name
  from profiles where id = auth.uid();

  insert into notifications (user_id, type, title, description, metadata)
  values (
    v_wager.creator_id,
    'wager_accepted',
    'Aposta aceita!',
    v_user_name || ' aceitou sua aposta de ' || v_wager.amount || ' selos.',
    jsonb_build_object('wager_id', p_wager_id)
  );

  return jsonb_build_object('success', true, 'wager_id', p_wager_id);
end;
$$;

-- ============================================================
-- 7. RPC cancel_wager — cancela aposta e reembolsa participantes
-- ============================================================
create or replace function public.cancel_wager(p_wager_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_wager public.wagers%rowtype;
  v_part  record;
begin
  select * into v_wager from wagers where id = p_wager_id for update;
  if not found then raise exception 'wager_not_found'; end if;
  if v_wager.creator_id <> auth.uid() then raise exception 'not_the_creator'; end if;
  if v_wager.status <> 'pending' then raise exception 'cannot_cancel_active_wager'; end if;

  -- Reembolsar criador
  update profiles set total_seals = total_seals + v_wager.amount where id = v_wager.creator_id;

  -- Reembolsar participantes (grupo parcialmente preenchido)
  for v_part in select user_id from wager_participants where wager_id = p_wager_id loop
    update profiles set total_seals = total_seals + v_wager.amount where id = v_part.user_id;
    insert into notifications (user_id, type, title, description, metadata)
    values (
      v_part.user_id,
      'wager_cancelled',
      'Aposta cancelada',
      'Uma aposta de ' || v_wager.amount || ' selos foi cancelada. Seus selos foram devolvidos.',
      jsonb_build_object('wager_id', p_wager_id)
    );
  end loop;

  update wagers set status = 'cancelled', settled_at = now() where id = p_wager_id;
end;
$$;

-- ============================================================
-- 8. RPC resolve_game_wagers — resolve apostas após resultado do jogo
-- ============================================================
create or replace function public.resolve_game_wagers(p_game_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_wager      public.wagers%rowtype;
  v_best_rank  int;
  v_winners    uuid[];
  v_pool       int;
  v_p_count    int;
  v_game_info  text;
  v_all        record;
  v_part       record;
begin
  select team_a || ' vs ' || team_b into v_game_info from games where id = p_game_id;

  for v_wager in
    select * from wagers
    where game_id = p_game_id
      and status in ('pending','active')
  loop
    -- Contar todos os participantes (criador + aceitantes)
    select count(*) into v_p_count from (
      select creator_id as user_id from wagers where id = v_wager.id
      union all
      select user_id from wager_participants where wager_id = v_wager.id
    ) all_parts;

    -- Aposta sem aceitante: reembolsar e cancelar
    if v_p_count <= 1 then
      update profiles set total_seals = total_seals + v_wager.amount
      where id = v_wager.creator_id;
      update wagers set status = 'cancelled', settled_at = now() where id = v_wager.id;
      continue;
    end if;

    -- Determinar melhor rank e vencedores
    v_best_rank := 0;
    v_winners   := array[]::uuid[];

    for v_all in (
      with all_parts(uid) as (
        select creator_id from wagers where id = v_wager.id
        union all
        select user_id from wager_participants where wager_id = v_wager.id
      )
      select
        ap.uid,
        coalesce(
          case b.hit_type
            when 'exact'  then 3
            when 'winner' then 2
            when 'draw'   then 2
            else 1
          end,
          0
        ) as rank
      from all_parts ap
      left join bets b on b.user_id = ap.uid and b.game_id = p_game_id
    ) loop
      if v_all.rank > v_best_rank then
        v_best_rank := v_all.rank;
        v_winners   := array[v_all.uid];
      elsif v_all.rank = v_best_rank then
        v_winners := v_winners || v_all.uid;
      end if;
    end loop;

    -- Pool total = valor × número de participantes
    v_pool := v_wager.amount * v_p_count;

    if array_length(v_winners, 1) = 1 then
      -- Vencedor único recebe o pool inteiro
      update profiles set total_seals = total_seals + v_pool where id = v_winners[1];

      -- Registrar no histórico de selos
      insert into user_seals (user_id, event_key, seals, game_id)
      values (v_winners[1], 'wager_won', v_pool, p_game_id);

      update wagers
        set status = 'settled_win', winner_id = v_winners[1], settled_at = now()
        where id = v_wager.id;

      -- Notificar vencedor
      insert into notifications (user_id, type, title, description, metadata)
      values (
        v_winners[1],
        'wager_won',
        'Você ganhou a aposta! 🏆',
        'Você ganhou ' || v_pool || ' selos na aposta do jogo ' || v_game_info || '!',
        jsonb_build_object('wager_id', v_wager.id)
      );

      -- Notificar perdedores
      for v_all in (
        with all_parts(uid) as (
          select creator_id from wagers where id = v_wager.id
          union all
          select user_id from wager_participants where wager_id = v_wager.id
        )
        select uid from all_parts where uid <> v_winners[1]
      ) loop
        insert into notifications (user_id, type, title, description, metadata)
        values (
          v_all.uid,
          'wager_lost',
          'Você perdeu a aposta',
          'Você perdeu ' || v_wager.amount || ' selos na aposta do jogo ' || v_game_info || '.',
          jsonb_build_object('wager_id', v_wager.id)
        );
      end loop;

    else
      -- Empate: reembolsar todos
      update wagers
        set status = 'settled_tie', winner_id = null, settled_at = now()
        where id = v_wager.id;

      for v_all in (
        with all_parts(uid) as (
          select creator_id from wagers where id = v_wager.id
          union all
          select user_id from wager_participants where wager_id = v_wager.id
        )
        select uid from all_parts
      ) loop
        update profiles set total_seals = total_seals + v_wager.amount where id = v_all.uid;
        insert into notifications (user_id, type, title, description, metadata)
        values (
          v_all.uid,
          'wager_tied',
          'Aposta empatada',
          'A aposta do jogo ' || v_game_info || ' empatou. Seus ' || v_wager.amount || ' selos foram devolvidos.',
          jsonb_build_object('wager_id', v_wager.id)
        );
      end loop;
    end if;

  end loop;
end;
$$;
