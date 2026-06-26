-- ============================================================
-- Tahajji — Migration 0005 : système de cœurs (vies).
-- 5 cœurs max, recharge 1 / 10 min, premium = illimité.
-- Géré côté serveur (non falsifiable) ; le client lit hearts + hearts_updated_at
-- et calcule la recharge pour l'affichage.
-- À exécuter APRÈS 0004. SQL Editor.
-- ============================================================

alter table public.profiles add column if not exists hearts int not null default 5;
alter table public.profiles add column if not exists hearts_updated_at timestamptz not null default now();

-- (hearts / hearts_updated_at ne sont PAS dans le GRANT UPDATE de l'utilisateur,
--  donc déjà non écrivables par le client — comme xp.)

-- Consomme un cœur (après une mauvaise réponse). Premium = aucun effet.
create or replace function public.consume_heart()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_h int; v_ts timestamptz; v_prem boolean;
  v_max int := 5;
  v_interval interval := interval '10 minutes';
  v_ticks int;
begin
  if v_user is null then raise exception 'not authenticated'; end if;
  select hearts, hearts_updated_at, is_premium into v_h, v_ts, v_prem
  from public.profiles where id = v_user;

  if v_prem then return v_max; end if;

  -- Recharge écoulée depuis hearts_updated_at
  v_ticks := floor(extract(epoch from (now() - v_ts)) / extract(epoch from v_interval));
  if v_ticks > 0 then
    v_h := least(v_max, v_h + v_ticks);
    if v_h >= v_max then v_ts := now(); else v_ts := v_ts + (v_ticks * v_interval); end if;
  end if;

  -- Si on part de plein, le minuteur de recharge démarre maintenant.
  if v_h >= v_max then v_ts := now(); end if;
  v_h := greatest(0, v_h - 1);

  update public.profiles set hearts = v_h, hearts_updated_at = v_ts where id = v_user;
  return v_h;
end;
$$;

-- Regagne des cœurs (ex. après une révision). Cap à 5.
create or replace function public.refill_hearts(p_amount int)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_h int; v_ts timestamptz;
  v_max int := 5;
  v_interval interval := interval '10 minutes';
  v_ticks int;
begin
  if v_user is null then raise exception 'not authenticated'; end if;
  select hearts, hearts_updated_at into v_h, v_ts
  from public.profiles where id = v_user;

  v_ticks := floor(extract(epoch from (now() - v_ts)) / extract(epoch from v_interval));
  if v_ticks > 0 then
    v_h := least(v_max, v_h + v_ticks);
    v_ts := v_ts + (v_ticks * v_interval);
  end if;

  v_h := least(v_max, v_h + greatest(0, coalesce(p_amount, 0)));
  if v_h >= v_max then v_ts := now(); end if;

  update public.profiles set hearts = v_h, hearts_updated_at = v_ts where id = v_user;
  return v_h;
end;
$$;

grant execute on function public.consume_heart() to authenticated;
grant execute on function public.refill_hearts(int) to authenticated;
