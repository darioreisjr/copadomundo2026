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
