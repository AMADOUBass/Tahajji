-- ============================================================
-- Tahajji — Migration 0003 : sécurise l'économie du jeu.
-- Le client ne peut plus modifier is_premium / xp / streak_count / current_level.
-- Ces champs ne changent que via des fonctions serveur (SECURITY DEFINER) ou le
-- service_role (futur webhook RevenueCat). À exécuter dans le SQL Editor.
-- ============================================================

-- 1) Privilèges au niveau colonne : l'utilisateur ne peut écrire QUE ces champs.
revoke update on public.profiles from authenticated;
grant update (display_name, bio, locale, avatar_url, last_active_date)
  on public.profiles to authenticated;

-- 2) Compléter une leçon : progression + XP calculés par le SERVEUR (XP non falsifiable).
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

  -- L'XP n'est crédité qu'à la première complétion (montant fixé côté serveur).
  if v_first then
    update public.profiles set xp = xp + 50 where id = v_user;
  end if;
end;
$$;

grant execute on function public.complete_lesson(int, int) to authenticated;

-- 3) Premium (DEV/placeholder) : bascule le premium de l'utilisateur courant.
--    ⚠️ TEMPORAIRE — à SUPPRIMER quand RevenueCat (webhook service_role) sera branché,
--    sinon un utilisateur peut s'octroyer le premium.
create or replace function public.set_premium(p_value boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  update public.profiles set is_premium = p_value where id = auth.uid();
end;
$$;

grant execute on function public.set_premium(boolean) to authenticated;
