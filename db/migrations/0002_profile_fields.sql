-- ============================================================
-- Tahajji — Migration 0002 : champs de profil éditables (+ préparation social).
-- À exécuter dans Supabase → SQL Editor.
-- ============================================================

alter table profiles add column if not exists avatar_url text;
alter table profiles add column if not exists bio text;

-- (Futur réseau social : on pourra ajouter `username unique`, une table `follows`,
--  et activer Supabase Realtime + une policy de lecture publique des profils.)
