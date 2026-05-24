-- ============================================================
-- Selos da Copa — sistema de recompensas configuráveis
-- Idempotente: pode ser rodado múltiplas vezes sem erros.
-- Run this in Supabase SQL Editor
-- ============================================================

create table if not exists public.seal_rewards (
  id          uuid        primary key default gen_random_uuid(),
  event_key   text        not null unique,
  label       text        not null,
  description text,
  seals       int         not null default 0 check (seals >= 0),
  icon        text        not null default 'mdi-seal',
  active      boolean     not null default true,
  created_at  timestamptz not null default now()
);

alter table public.seal_rewards enable row level security;

drop policy if exists "seal_rewards: authenticated reads" on public.seal_rewards;
drop policy if exists "seal_rewards: admin manages"       on public.seal_rewards;

-- Qualquer usuário autenticado pode ler
create policy "seal_rewards: authenticated reads" on public.seal_rewards
  for select using (auth.role() = 'authenticated');

-- Apenas admins podem inserir, atualizar e deletar
create policy "seal_rewards: admin manages" on public.seal_rewards
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- Seed: eventos iniciais
-- ============================================================
insert into public.seal_rewards (event_key, label, description, seals, icon) values
  ('daily_chest',    'Baú Diário',              'Recompensa por fazer login todos os dias',         10, 'mdi-treasure-chest'),
  ('exact_score',    'Acerto Exato do Placar',  'Acertou o placar exato do jogo',                   50, 'mdi-bullseye-arrow'),
  ('winner_hit',     'Acerto do Vencedor',      'Acertou quem venceu mas não o placar exato',       20, 'mdi-trophy'),
  ('draw_hit',       'Acerto de Empate',        'Acertou que o jogo terminaria empatado',           20, 'mdi-handshake'),
  ('bet_sent',       'Palpite Enviado',         'Bonus por participar e enviar um palpite',          5, 'mdi-soccer'),
  ('knockout_bonus', 'Bônus Mata-Mata',         'Bonus extra para jogos da fase eliminatória',      30, 'mdi-sword-cross'),
  ('group_created',  'Grupo Criado',            'Você criou um novo grupo no bolão',                 0, 'mdi-account-group')
on conflict (event_key) do nothing;
