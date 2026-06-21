-- ============================================================
-- Tahajji — Migration initiale (schéma + RLS + trigger profil)
-- À exécuter dans Supabase → SQL Editor.
-- Compatible avec l'option « Enable automatic RLS » (les `enable row
-- level security` ci-dessous sont alors redondants mais sans effet négatif).
-- ============================================================

-- ========== PROFILS ==========
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale text default 'fr',
  current_level int default 1,
  xp int default 0,
  streak_count int default 0,
  last_active_date date,
  is_premium boolean default false,
  created_at timestamptz default now()
);

-- ========== CONTENU PÉDAGOGIQUE ==========
create table if not exists levels (
  id serial primary key,
  position int not null,
  title text not null,
  description text,
  is_premium boolean default false
);

create table if not exists lessons (
  id serial primary key,
  level_id int not null references levels(id) on delete cascade,
  position int not null,
  title text not null,
  lesson_type text not null default 'learn',  -- learn | practice | exam
  is_premium boolean default false
);

create table if not exists lesson_items (
  id serial primary key,
  lesson_id int not null references lessons(id) on delete cascade,
  position int not null,
  item_type text not null,          -- letter | word | verse
  arabic_text text not null,
  transliteration text,
  translation_fr text,
  audio_url text
);

create table if not exists quiz_questions (
  id serial primary key,
  lesson_id int not null references lessons(id) on delete cascade,
  position int not null,
  question_type text not null,      -- recognize_letter | match_audio | choose_word
  prompt text,
  arabic_text text,
  audio_url text,
  correct_answer text not null,
  options jsonb
);

-- ========== CORAN ==========
create table if not exists surahs (
  id serial primary key,
  number int not null unique,
  name_ar text not null,
  name_fr text not null,
  revelation_type text,             -- meccan | medinan
  verse_count int not null
);

create table if not exists verses (
  id serial primary key,
  surah_id int not null references surahs(id) on delete cascade,
  number int not null,
  arabic_text text not null,
  translation_fr text,
  translation_en text,
  audio_url text
);

-- ========== PROGRESSION (PRIVÉ) ==========
create table if not exists user_progress (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id int not null references lessons(id) on delete cascade,
  status text not null default 'in_progress',  -- locked | in_progress | completed
  stars int default 0,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

create table if not exists level_completions (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  level_id int not null references levels(id) on delete cascade,
  earned_at timestamptz default now(),
  unique (user_id, level_id)
);

create table if not exists exam_attempts (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id int not null references lessons(id) on delete cascade,
  score int not null,
  passed boolean not null,
  attempted_at timestamptz default now()
);

-- ========== ABONNEMENTS (sync RevenueCat plus tard) ==========
create table if not exists subscriptions (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text,
  status text,                      -- active | expired | trial
  platform text,                    -- ios | android | web
  expires_at timestamptz,
  updated_at timestamptz default now(),
  unique (user_id)
);

-- ========== RLS ==========
alter table profiles          enable row level security;
alter table user_progress     enable row level security;
alter table level_completions enable row level security;
alter table exam_attempts     enable row level security;
alter table subscriptions     enable row level security;
alter table levels            enable row level security;
alter table lessons           enable row level security;
alter table lesson_items      enable row level security;
alter table quiz_questions    enable row level security;
alter table surahs            enable row level security;
alter table verses            enable row level security;

-- Contenu : lecture publique
drop policy if exists "content readable by all" on levels;
create policy "content readable by all" on levels for select using (true);
drop policy if exists "content readable by all" on lessons;
create policy "content readable by all" on lessons for select using (true);
drop policy if exists "content readable by all" on lesson_items;
create policy "content readable by all" on lesson_items for select using (true);
drop policy if exists "content readable by all" on quiz_questions;
create policy "content readable by all" on quiz_questions for select using (true);
drop policy if exists "content readable by all" on surahs;
create policy "content readable by all" on surahs for select using (true);
drop policy if exists "content readable by all" on verses;
create policy "content readable by all" on verses for select using (true);

-- Profil : chacun le sien
drop policy if exists "own profile" on profiles;
create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Progression : chacun la sienne
drop policy if exists "own progress" on user_progress;
create policy "own progress" on user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own completions" on level_completions;
create policy "own completions" on level_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own attempts" on exam_attempts;
create policy "own attempts" on exam_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own subscription" on subscriptions;
create policy "own subscription" on subscriptions
  for select using (auth.uid() = user_id);

-- ========== CRÉATION AUTO DU PROFIL ==========
create or replace function handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
