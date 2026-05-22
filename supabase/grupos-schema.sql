-- ============================================================
-- Grupos Privados de Ranking — Schema
-- Idempotente: pode ser rodado múltiplas vezes sem erros.
-- Run this in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. Tabelas (sem policies ainda)
-- ============================================================
create table if not exists public.groups (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  owner_id   uuid        not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.groups enable row level security;

create table if not exists public.group_members (
  id          uuid        primary key default gen_random_uuid(),
  group_id    uuid        not null references public.groups(id) on delete cascade,
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  status      text        not null default 'pending'
                check (status in ('pending', 'active')),
  invited_by  uuid        references public.profiles(id),
  created_at  timestamptz not null default now(),
  unique (group_id, user_id)
);

alter table public.group_members enable row level security;

-- ============================================================
-- 2. Funções helper com security definer (bypass RLS)
--    Necessárias para evitar recursão infinita nas policies:
--    groups → group_members → groups → ...
-- ============================================================
create or replace function public.is_group_owner(p_group_id uuid, p_user_id uuid)
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from public.groups
    where id = p_group_id and owner_id = p_user_id
  )
$$;

create or replace function public.is_group_member(p_group_id uuid, p_user_id uuid)
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = p_user_id
  )
$$;

-- ============================================================
-- 3. Policies de group_members (usam is_group_owner — sem ciclo)
-- ============================================================
drop policy if exists "group_members: user reads own"          on public.group_members;
drop policy if exists "group_members: active member reads group" on public.group_members;
drop policy if exists "group_members: owner reads all"           on public.group_members;
drop policy if exists "group_members: owner inserts"             on public.group_members;
drop policy if exists "group_members: user updates own"          on public.group_members;
drop policy if exists "group_members: owner deletes members"     on public.group_members;
drop policy if exists "group_members: user deletes own"          on public.group_members;

-- Usuário lê o próprio registro (convites pendentes recebidos)
create policy "group_members: user reads own" on public.group_members
  for select using (auth.uid() = user_id);

-- Qualquer membro do grupo (ativo ou pendente) vê todos os membros do mesmo grupo
create policy "group_members: active member reads group" on public.group_members
  for select using (public.is_group_member(group_id, auth.uid()));

create policy "group_members: owner reads all" on public.group_members
  for select using (public.is_group_owner(group_id, auth.uid()));

create policy "group_members: owner inserts" on public.group_members
  for insert with check (public.is_group_owner(group_id, auth.uid()));

create policy "group_members: user updates own" on public.group_members
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "group_members: owner deletes members" on public.group_members
  for delete using (public.is_group_owner(group_id, auth.uid()));

create policy "group_members: user deletes own" on public.group_members
  for delete using (auth.uid() = user_id);

-- Usuário autenticado entra diretamente em grupos públicos (self-join)
drop policy if exists "group_members: self join public group" on public.group_members;
create policy "group_members: self join public group" on public.group_members
  for insert with check (
    auth.uid() = user_id
    and status = 'active'
    and exists (
      select 1 from public.groups
      where id = group_id and is_public = true
    )
  );

-- ============================================================
-- 4. Policies de groups (usam is_group_member — sem ciclo)
-- ============================================================
drop policy if exists "groups: members read"          on public.groups;
drop policy if exists "groups: public groups readable" on public.groups;
drop policy if exists "groups: owner manages"          on public.groups;

-- Dono e membros lêem o grupo
create policy "groups: members read" on public.groups
  for select using (
    auth.uid() = owner_id
    or public.is_group_member(id, auth.uid())
  );

-- Qualquer autenticado pode ler grupos públicos (busca/descoberta)
create policy "groups: public groups readable" on public.groups
  for select using (is_public = true);

create policy "groups: owner manages" on public.groups
  for all using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- ============================================================
-- 5. Colunas extras da tabela groups (idempotente)
-- ============================================================
alter table public.groups add column if not exists description text;
alter table public.groups add column if not exists is_public   boolean not null default false;
alter table public.groups add column if not exists image_url   text;

-- ============================================================
-- 6. Storage bucket para imagens de grupo
-- ============================================================
insert into storage.buckets (id, name, public)
values ('group-images', 'group-images', true)
on conflict (id) do nothing;

drop policy if exists "group-images: public read"  on storage.objects;
drop policy if exists "group-images: auth upload"  on storage.objects;
drop policy if exists "group-images: auth delete"  on storage.objects;

create policy "group-images: public read" on storage.objects
  for select using (bucket_id = 'group-images');

create policy "group-images: auth upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'group-images');

create policy "group-images: auth delete" on storage.objects
  for delete to authenticated using (bucket_id = 'group-images');
