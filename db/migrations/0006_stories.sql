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

-- ⚠️ RÉCITS D'EXEMPLE — à valider / remplacer. Dollar-quoting ($t$) = pas d'échappement.
insert into public.stories (category, title, summary, content, icon, position, is_validated) values
(
  'prophetes',
  $t$Le Prophète Yûnus et le poisson$t$,
  $t$La patience et la force de l'invocation, même dans les ténèbres.$t$,
  $t$Le prophète Yûnus (paix sur lui) fut envoyé à un peuple qui refusait de croire en Allah. Découragé par leur entêtement, il quitta sa ville avant qu'Allah ne le lui permette.

Il embarqua sur un navire. Une violente tempête se leva, et l'équipage tira au sort celui qui serait jeté à la mer pour alléger le bateau : le sort tomba sur Yûnus. Il fut jeté dans les flots, et un grand poisson l'avala.

Dans les ténèbres du ventre du poisson, Yûnus implora Allah : « Il n'y a de divinité que Toi ! Gloire à Toi ! J'ai vraiment été du nombre des injustes. » Allah l'entendit, le sauva et le fit déposer sur un rivage. Son peuple finit par croire, et Allah leur accorda Sa miséricorde.

Ce récit nous enseigne la patience et le pouvoir de l'invocation, même dans les moments les plus sombres.$t$,
  'fish-outline',
  1,
  false
),
(
  'prophetes',
  $t$Le Prophète Ibrahim et le feu$t$,
  $t$La foi inébranlable face à l'épreuve.$t$,
  $t$Le prophète Ibrahim (paix sur lui) appelait son peuple à adorer Allah seul et à délaisser les idoles qu'ils fabriquaient de leurs propres mains.

Pour les amener à réfléchir, il brisa leurs idoles, n'en laissant qu'une. Furieux, son peuple décida de le punir en l'allumant dans un immense feu.

Mais Allah ordonna au feu : « Sois fraîcheur et paix sur Ibrahim. » Le feu ne le brûla pas, et Ibrahim en sortit sain et sauf, par la puissance d'Allah.

Ce récit montre la force de la foi et que rien n'arrive sans la permission d'Allah.$t$,
  'flame-outline',
  2,
  false
),
(
  'histoire',
  $t$Les gens de la caverne (Ashâb al-Kahf)$t$,
  $t$Des jeunes croyants protégés par Allah, un signe de la résurrection.$t$,
  $t$À une époque où la foi en Allah était persécutée, un groupe de jeunes gens refusa d'adorer autre que Lui. Pour préserver leur foi, ils se réfugièrent dans une caverne en s'en remettant à Allah.

Allah les fit dormir d'un sommeil profond durant de longues années — plus de trois siècles. À leur réveil, ils crurent n'avoir dormi qu'un jour, ou une partie d'un jour.

Leur histoire, racontée dans la sourate Al-Kahf, est un signe de la puissance d'Allah et de la résurrection : Celui qui les a préservés et réveillés est capable de redonner la vie.

Elle enseigne aussi à chercher refuge auprès d'Allah pour protéger sa foi.$t$,
  'moon-outline',
  3,
  false
);
