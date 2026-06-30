-- ============================================================
-- Tahajji — Migration 0006 : onglet « Histoires » (récits de l'islam).
-- Table lisible par tous les utilisateurs connectés ; écriture via dashboard/seed
-- uniquement (pas depuis l'app). Mise en cache hors-ligne automatique.
-- ⚠️ Récits d'exemple à FAIRE VALIDER par une autorité religieuse avant publication.
-- À exécuter APRÈS 0005. SQL Editor.
-- ============================================================

create table if not exists public.stories (
  id bigint generated always as identity primary key,
  category text not null,                          -- prophetes | histoire | valeurs | compagnons
  title text not null,
  summary text,                                    -- court résumé (liste)
  content text not null,                           -- récit (paragraphes séparés par une ligne vide)
  icon text,                                       -- nom d'icône Ionicons (illustration)
  position int not null default 0,
  is_validated boolean not null default false,     -- validé par une autorité
  created_at timestamptz not null default now()
);

alter table public.stories enable row level security;

drop policy if exists "stories readable by authenticated" on public.stories;
create policy "stories readable by authenticated"
  on public.stories for select to authenticated using (true);

-- Les récits (données) sont dans db/stories_seed.sql (ré-exécutable). Exécute-le après cette migration.
