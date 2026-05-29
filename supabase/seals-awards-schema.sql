-- ============================================================
-- Selos da Copa — distribuição por perfil de usuário
-- Idempotente: pode ser rodado múltiplas vezes sem erros.
-- Run this in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. Coluna total_seals em profiles
-- ============================================================
alter table public.profiles add column if not exists total_seals int not null default 0;

-- ============================================================
-- 2. Tabela user_seals — histórico de selos ganhos por usuário
-- ============================================================
create table if not exists public.user_seals (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  event_key   text        not null,
  seals       int         not null check (seals > 0),
  game_id     uuid        references public.games(id) on delete set null,
  awarded_at  timestamptz not null default now()
);

create index if not exists user_seals_daily
  on public.user_seals(user_id, event_key, awarded_at);

alter table public.user_seals enable row level security;

drop policy if exists "user_seals: users read own" on public.user_seals;
drop policy if exists "user_seals: service insert" on public.user_seals;

create policy "user_seals: users read own" on public.user_seals
  for select using (auth.uid() = user_id);

-- RPCs security definer podem inserir
create policy "user_seals: service insert" on public.user_seals
  for insert with check (true);

-- ============================================================
-- 3. RPC claim_daily_seal — baú diário (idempotente por dia)
-- ============================================================
create or replace function public.claim_daily_seal()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_seals       int;
  v_today       date := current_date;
  v_already     bool;
  v_label       text;
  v_description text;
  v_icon        text;
begin
  select exists(
    select 1 from user_seals
    where user_id   = auth.uid()
      and event_key = 'daily_chest'
      and awarded_at::date = v_today
  ) into v_already;

  if v_already then
    return jsonb_build_object('granted', false, 'reason', 'already_claimed_today');
  end if;

  select seals, label, description, icon
    into v_seals, v_label, v_description, v_icon
  from seal_rewards
  where event_key = 'daily_chest' and active = true;

  if not found or v_seals = 0 then
    return jsonb_build_object('granted', false, 'reason', 'reward_inactive');
  end if;

  insert into user_seals(user_id, event_key, seals)
  values (auth.uid(), 'daily_chest', v_seals);

  update profiles set total_seals = total_seals + v_seals where id = auth.uid();

  return jsonb_build_object(
    'granted',      true,
    'seals',        v_seals,
    'label',        v_label,
    'description',  v_description,
    'icon',         v_icon
  );
end;
$$;

-- ============================================================
-- 4. RPC award_game_seals — distribui selos após resultado
-- ============================================================
create or replace function public.award_game_seals(p_game_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  b       record;
  v_seals int;
  v_event text;
  v_game  public.games%rowtype;
begin
  select * into v_game from games where id = p_game_id;

  for b in select * from bets where game_id = p_game_id loop

    -- bet_sent — bônus de participação
    if not exists(
      select 1 from user_seals
      where user_id = b.user_id and event_key = 'bet_sent' and game_id = p_game_id
    ) then
      select seals into v_seals from seal_rewards where event_key = 'bet_sent' and active = true;
      if found and v_seals > 0 then
        insert into user_seals(user_id, event_key, seals, game_id)
        values (b.user_id, 'bet_sent', v_seals, p_game_id);
        update profiles set total_seals = total_seals + v_seals where id = b.user_id;
      end if;
    end if;

    -- resultado do palpite
    v_event := case b.hit_type
      when 'exact'  then 'exact_score'
      when 'winner' then 'winner_hit'
      when 'draw'   then 'draw_hit'
      else null
    end;

    if v_event is not null and not exists(
      select 1 from user_seals
      where user_id = b.user_id and event_key = v_event and game_id = p_game_id
    ) then
      select seals into v_seals from seal_rewards where event_key = v_event and active = true;
      if found and v_seals > 0 then
        insert into user_seals(user_id, event_key, seals, game_id)
        values (b.user_id, v_event, v_seals, p_game_id);
        update profiles set total_seals = total_seals + v_seals where id = b.user_id;
      end if;
    end if;

    -- knockout_bonus — fase eliminatória
    if v_game.phase != 'group' and not exists(
      select 1 from user_seals
      where user_id = b.user_id and event_key = 'knockout_bonus' and game_id = p_game_id
    ) then
      select seals into v_seals from seal_rewards where event_key = 'knockout_bonus' and active = true;
      if found and v_seals > 0 then
        insert into user_seals(user_id, event_key, seals, game_id)
        values (b.user_id, 'knockout_bonus', v_seals, p_game_id);
        update profiles set total_seals = total_seals + v_seals where id = b.user_id;
      end if;
    end if;

  end loop;
end;
$$;

-- ============================================================
-- 5. recalculate_game_bets com award_game_seals embutido
--    (substitui a versão em schema.sql)
-- ============================================================
create or replace function public.recalculate_game_bets(p_game_id uuid)
returns void language plpgsql security definer as $$
declare
  g   public.games%rowtype;
  b   public.bets%rowtype;
  hit text;
  pts int;
begin
  select * into g from public.games where id = p_game_id;

  if g.score_a is null or g.score_b is null then
    raise exception 'Game has no final result';
  end if;

  for b in select * from public.bets where game_id = p_game_id loop
    hit := public.calculate_hit_type(b.score_a, b.score_b, g.score_a, g.score_b);
    pts := public.points_for_hit(hit);

    update public.bets
    set points = pts, hit_type = hit, updated_at = now()
    where id = b.id;
  end loop;

  insert into public.ranking (user_id, total_points, total_bets, exact_hits, winner_hits, draw_hits, updated_at)
  select
    b2.user_id,
    sum(b2.points),
    count(*),
    count(*) filter (where b2.hit_type = 'exact'),
    count(*) filter (where b2.hit_type = 'winner'),
    count(*) filter (where b2.hit_type = 'draw'),
    now()
  from public.bets b2
  where b2.user_id in (select user_id from public.bets where game_id = p_game_id)
  group by b2.user_id
  on conflict (user_id) do update set
    total_points = excluded.total_points,
    total_bets   = excluded.total_bets,
    exact_hits   = excluded.exact_hits,
    winner_hits  = excluded.winner_hits,
    draw_hits    = excluded.draw_hits,
    updated_at   = now();

  -- Distribui selos para os apostadores deste jogo
  perform public.award_game_seals(p_game_id);

  -- Resolve apostas P2P para este jogo
  perform public.resolve_game_wagers(p_game_id);
end;
$$;
