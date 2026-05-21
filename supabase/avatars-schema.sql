-- ============================================================
-- Bolão da Copa — Avatars Schema
-- Arquivo SEPARADO do schema.sql principal.
-- Executar APÓS o schema.sql já estar aplicado no Supabase.
-- Idempotente: pode ser rodado múltiplas vezes sem erros.
-- ============================================================

create table if not exists public.avatars (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  url         text        not null,
  category    text,
  active      boolean     not null default true,
  created_by  uuid        references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table public.avatars enable row level security;

drop policy if exists "avatars: authenticated users read active" on public.avatars;
drop policy if exists "avatars: admin reads all"                on public.avatars;
drop policy if exists "avatars: admin insert"                   on public.avatars;
drop policy if exists "avatars: admin update"                   on public.avatars;
drop policy if exists "avatars: admin delete"                   on public.avatars;

-- Usuários autenticados veem apenas avatares ativos
create policy "avatars: authenticated users read active" on public.avatars
  for select using (auth.uid() is not null and active = true);

-- Admins veem todos (inclusive inativos) — OR logic sobrepõe a policy acima
create policy "avatars: admin reads all" on public.avatars
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "avatars: admin insert" on public.avatars
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "avatars: admin update" on public.avatars
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "avatars: admin delete" on public.avatars
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- Storage bucket 'avatars'
-- OU criar via Dashboard: Storage > New bucket > "avatars" > Public ON
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars storage: public read"  on storage.objects;
drop policy if exists "avatars storage: admin insert" on storage.objects;
drop policy if exists "avatars storage: admin update" on storage.objects;
drop policy if exists "avatars storage: admin delete" on storage.objects;

create policy "avatars storage: public read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars storage: admin insert" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "avatars storage: admin update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "avatars storage: admin delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- Custo em selos e avatar padrão
-- ============================================================
alter table public.avatars add column if not exists seal_cost  int     not null default 0 check (seal_cost >= 0);
alter table public.avatars add column if not exists is_default boolean not null default false;

-- Garante somente 1 avatar padrão por vez
create unique index if not exists avatars_single_default
  on public.avatars (is_default)
  where is_default = true;

-- ============================================================
-- Tabela de desbloqueios de avatares por usuário
-- ============================================================
create table if not exists public.user_avatar_unlocks (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  avatar_id   uuid        not null references public.avatars(id)  on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, avatar_id)
);

create index if not exists user_avatar_unlocks_user
  on public.user_avatar_unlocks(user_id);

alter table public.user_avatar_unlocks enable row level security;

drop policy if exists "user_avatar_unlocks: users read own"  on public.user_avatar_unlocks;
drop policy if exists "user_avatar_unlocks: service insert"  on public.user_avatar_unlocks;
drop policy if exists "user_avatar_unlocks: admin reads all" on public.user_avatar_unlocks;

create policy "user_avatar_unlocks: users read own" on public.user_avatar_unlocks
  for select using (auth.uid() = user_id);

create policy "user_avatar_unlocks: service insert" on public.user_avatar_unlocks
  for insert with check (true);

create policy "user_avatar_unlocks: admin reads all" on public.user_avatar_unlocks
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- RPC: desbloquear avatar (atômico: debita selos + registra unlock)
-- ============================================================
create or replace function public.unlock_avatar(p_avatar_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_cost    int;
  v_seals   int;
  v_already bool;
begin
  select seal_cost into v_cost from avatars where id = p_avatar_id and active = true;
  if not found then
    return jsonb_build_object('success', false, 'reason', 'avatar_not_found');
  end if;

  if v_cost = 0 then
    return jsonb_build_object('success', false, 'reason', 'avatar_is_free');
  end if;

  select exists(
    select 1 from user_avatar_unlocks where user_id = auth.uid() and avatar_id = p_avatar_id
  ) into v_already;

  if v_already then
    return jsonb_build_object('success', false, 'reason', 'already_unlocked');
  end if;

  select total_seals into v_seals from profiles where id = auth.uid();

  if v_seals < v_cost then
    return jsonb_build_object('success', false, 'reason', 'insufficient_seals',
      'required', v_cost, 'available', v_seals);
  end if;

  update profiles set total_seals = total_seals - v_cost where id = auth.uid();
  insert into user_avatar_unlocks(user_id, avatar_id) values (auth.uid(), p_avatar_id);

  return jsonb_build_object('success', true, 'seals_spent', v_cost);
end;
$$;

-- ============================================================
-- RPC: definir avatar padrão (limpa o anterior e define o novo na mesma txn)
-- ============================================================
create or replace function public.set_default_avatar(p_avatar_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'admin') then
    raise exception 'Admin only';
  end if;
  update avatars set is_default = false where is_default = true;
  update avatars set is_default = true  where id = p_avatar_id;
end;
$$;
