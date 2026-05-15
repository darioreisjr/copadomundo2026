-- ============================================================
-- Copa do Mundo - Bolão MVP Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- profiles: extends auth.users
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null,
  role       text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: users read own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: users update own" on public.profiles
  for update using (auth.uid() = id);

-- Allow inserts from trigger
create policy "profiles: service insert" on public.profiles
  for insert with check (true);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- games
-- ============================================================
create table if not exists public.games (
  id              uuid primary key default gen_random_uuid(),
  team_a          text not null,
  team_b          text not null,
  flag_a          text,
  flag_b          text,
  match_date      timestamptz not null,
  phase           text not null,  -- 'group', 'round_of_16', 'quarter', 'semi', 'final'
  group_name      text,           -- 'A', 'B', ... (nullable for knockout)
  status          text not null default 'upcoming'
                  check (status in ('upcoming','open','closed','live','finished')),
  score_a         int,
  score_b         int,
  bet_opens_at    timestamptz,
  bet_closes_at   timestamptz,
  created_at      timestamptz not null default now()
);

-- Evita duplicatas na importação: mesmo confronto não pode ter duas entradas na mesma data
alter table public.games
  drop constraint if exists games_unique_match;
alter table public.games
  add constraint games_unique_match unique (team_a, team_b, match_date);

alter table public.games enable row level security;

create policy "games: anyone reads" on public.games
  for select using (true);

create policy "games: admin manages" on public.games
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Automatically set bet window when match_date is set
create or replace function public.set_bet_window()
returns trigger language plpgsql as $$
begin
  if new.bet_opens_at is null then
    new.bet_opens_at := new.match_date - interval '24 hours';
  end if;
  if new.bet_closes_at is null then
    new.bet_closes_at := new.match_date;
  end if;
  return new;
end;
$$;

drop trigger if exists before_game_insert on public.games;
create trigger before_game_insert
  before insert on public.games
  for each row execute procedure public.set_bet_window();

drop trigger if exists before_game_update on public.games;
create trigger before_game_update
  before update of match_date on public.games
  for each row execute procedure public.set_bet_window();

-- ============================================================
-- bets
-- ============================================================
create table if not exists public.bets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  game_id     uuid not null references public.games(id) on delete cascade,
  score_a     int not null check (score_a >= 0),
  score_b     int not null check (score_b >= 0),
  points      int not null default 0,
  hit_type    text check (hit_type in ('exact','winner','draw',null)),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, game_id)
);

alter table public.bets enable row level security;

create policy "bets: users read own" on public.bets
  for select using (auth.uid() = user_id);

create policy "bets: users insert own" on public.bets
  for insert with check (auth.uid() = user_id);

create policy "bets: users update own" on public.bets
  for update using (auth.uid() = user_id);

create policy "bets: admin reads all" on public.bets
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- ranking (materialized view updated after each result)
-- ============================================================
create table if not exists public.ranking (
  user_id          uuid primary key references public.profiles(id) on delete cascade,
  total_points     int not null default 0,
  total_bets       int not null default 0,
  exact_hits       int not null default 0,
  winner_hits      int not null default 0,
  draw_hits        int not null default 0,
  updated_at       timestamptz not null default now()
);

alter table public.ranking enable row level security;

create policy "ranking: anyone reads" on public.ranking
  for select using (true);

-- ============================================================
-- Function: calculate points for a bet
-- ============================================================
create or replace function public.calculate_hit_type(
  p_score_a int, p_score_b int,  -- predicted
  r_score_a int, r_score_b int   -- real
) returns text language plpgsql immutable as $$
begin
  if p_score_a = r_score_a and p_score_b = r_score_b then
    return 'exact';
  elsif p_score_a = p_score_b and r_score_a = r_score_b then
    return 'draw';
  elsif (p_score_a > p_score_b and r_score_a > r_score_b)
     or (p_score_a < p_score_b and r_score_a < r_score_b) then
    return 'winner';
  else
    return null;
  end if;
end;
$$;

create or replace function public.points_for_hit(hit text) returns int
language plpgsql immutable as $$
begin
  return case hit
    when 'exact'  then 10
    when 'winner' then 5
    when 'draw'   then 5
    else 0
  end;
end;
$$;

-- ============================================================
-- Function: recalculate all bets for a game after result saved
-- ============================================================
create or replace function public.recalculate_game_bets(p_game_id uuid)
returns void language plpgsql security definer as $$
declare
  g public.games%rowtype;
  b public.bets%rowtype;
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

  -- Rebuild ranking for all users who bet on this game
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
end;
$$;
