create table if not exists match_analyses (
  game_id              uuid primary key references games(id) on delete cascade,
  total_jogos          integer,
  vitorias_a           integer,
  vitorias_b           integer,
  empates              integer,
  gols_a               integer,
  gols_b               integer,
  ultima_copa          text,
  probabilidade_a      integer,
  probabilidade_empate integer,
  probabilidade_b      integer,
  placar_sugerido      text,
  analise              text,
  created_at           timestamptz default now()
);

alter table match_analyses enable row level security;

create policy "anyone can read analyses"
  on match_analyses for select
  using (true);

create policy "authenticated users can insert analyses"
  on match_analyses for insert
  to authenticated
  with check (true);
