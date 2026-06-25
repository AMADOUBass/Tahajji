-- ============================================================
-- Tahajji — Migration 0004 : série (streak) calculée côté serveur.
-- Met à jour complete_lesson() pour gérer streak_count + last_active_date,
-- et verrouille last_active_date (le client ne peut plus le falsifier).
-- À exécuter APRÈS 0003. SQL Editor.
-- ============================================================

-- Le client ne doit plus écrire last_active_date (la série en dépend).
revoke update (last_active_date) on public.profiles from authenticated;

create or replace function public.complete_lesson(p_lesson_id int, p_stars int)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_existing public.user_progress;
  v_first boolean;
  v_stars int := least(greatest(coalesce(p_stars, 0), 0), 3);
  v_today date := current_date;
  v_last date;
  v_streak int;
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  select * into v_existing
  from public.user_progress
  where user_id = v_user and lesson_id = p_lesson_id;

  v_first := v_existing.id is null or v_existing.status <> 'completed';

  insert into public.user_progress (user_id, lesson_id, status, stars, completed_at)
  values (v_user, p_lesson_id, 'completed', v_stars, now())
  on conflict (user_id, lesson_id) do update
    set status = 'completed',
        stars = greatest(excluded.stars, public.user_progress.stars),
        completed_at = now();

  -- Série : +1 si actif hier, =1 si reprise/première fois, inchangé si déjà aujourd'hui.
  select last_active_date, streak_count into v_last, v_streak
  from public.profiles where id = v_user;

  if v_last = v_today then
    v_streak := coalesce(v_streak, 1);
  elsif v_last = v_today - 1 then
    v_streak := coalesce(v_streak, 0) + 1;
  else
    v_streak := 1;
  end if;

  update public.profiles
  set xp = xp + case when v_first then 50 else 0 end,
      streak_count = v_streak,
      last_active_date = v_today
  where id = v_user;
end;
$$;

grant execute on function public.complete_lesson(int, int) to authenticated;
