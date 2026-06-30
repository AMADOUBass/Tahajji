-- ============================================================
-- Tahajji — Récits de l'onglet « Histoires » (données).
-- Ré-exécutable : truncate puis réinsère. À lancer APRÈS 0006_stories.sql.
-- Dollar-quoting ($t$) = pas besoin d'échapper les apostrophes.
-- ⚠️ TOUS ces récits sont à FAIRE VALIDER par une autorité religieuse
--    (is_validated = false → bandeau « en cours de validation » dans l'app).
-- Pas de représentation des prophètes (illustrations = icônes uniquement).
-- ============================================================

truncate table public.stories restart identity;

insert into public.stories (category, title, summary, content, icon, position, is_validated) values

-- ---------- Prophètes ----------
(
  'prophetes',
  $t$Le Prophète Yûnus et le poisson$t$,
  $t$La patience et la force de l'invocation, même dans les ténèbres.$t$,
  $t$Le prophète Yûnus (paix sur lui) fut envoyé à un peuple qui refusait de croire en Allah. Découragé par leur entêtement, il quitta sa ville avant qu'Allah ne le lui permette.

Il embarqua sur un navire. Une violente tempête se leva, et l'équipage tira au sort celui qui serait jeté à la mer pour alléger le bateau : le sort tomba sur Yûnus. Il fut jeté dans les flots, et un grand poisson l'avala.

Dans les ténèbres du ventre du poisson, Yûnus implora Allah : « Il n'y a de divinité que Toi ! Gloire à Toi ! J'ai vraiment été du nombre des injustes. » Allah l'entendit, le sauva et le fit déposer sur un rivage. Son peuple finit par croire, et Allah leur accorda Sa miséricorde.

Ce récit nous enseigne la patience et le pouvoir de l'invocation, même dans les moments les plus sombres.$t$,
  'fish-outline', 1, false
),
(
  'prophetes',
  $t$Le Prophète Ibrahim et le feu$t$,
  $t$La foi inébranlable face à l'épreuve.$t$,
  $t$Le prophète Ibrahim (paix sur lui) appelait son peuple à adorer Allah seul et à délaisser les idoles qu'ils fabriquaient de leurs propres mains.

Pour les amener à réfléchir, il brisa leurs idoles, n'en laissant qu'une. Furieux, son peuple décida de le punir en l'allumant dans un immense feu.

Mais Allah ordonna au feu : « Sois fraîcheur et paix sur Ibrahim. » Le feu ne le brûla pas, et Ibrahim en sortit sain et sauf, par la puissance d'Allah.

Ce récit montre la force de la foi et que rien n'arrive sans la permission d'Allah.$t$,
  'flame-outline', 2, false
),
(
  'prophetes',
  $t$Le Prophète Mûsâ et la mer$t$,
  $t$Quand la confiance en Allah ouvre un chemin là où il n'y en a pas.$t$,
  $t$Le prophète Mûsâ (paix sur lui) fut envoyé à Pharaon, qui s'était montré tyrannique et avait asservi les enfants d'Israël. Mûsâ l'appela à croire en Allah, mais Pharaon refusa avec orgueil.

Allah ordonna à Mûsâ de partir de nuit avec son peuple. Pharaon les poursuivit avec son armée. Arrivés au bord de la mer, les croyants se crurent piégés ; mais Mûsâ leur dit : « Non ! Mon Seigneur est avec moi, Il va me guider. »

Sur l'ordre d'Allah, Mûsâ frappa la mer de son bâton : elle s'ouvrit, et son peuple traversa sur la terre ferme. Lorsque Pharaon s'y engagea à son tour, les flots se refermèrent sur lui.

Ce récit enseigne la confiance totale en Allah, même quand toute issue semble fermée.$t$,
  'water-outline', 3, false
),

-- ---------- Histoire de l'islam ----------
(
  'histoire',
  $t$Les gens de la caverne (Ashâb al-Kahf)$t$,
  $t$Des jeunes croyants protégés par Allah, un signe de la résurrection.$t$,
  $t$À une époque où la foi en Allah était persécutée, un groupe de jeunes gens refusa d'adorer autre que Lui. Pour préserver leur foi, ils se réfugièrent dans une caverne en s'en remettant à Allah.

Allah les fit dormir d'un sommeil profond durant de longues années — plus de trois siècles. À leur réveil, ils crurent n'avoir dormi qu'un jour, ou une partie d'un jour.

Leur histoire, racontée dans la sourate Al-Kahf, est un signe de la puissance d'Allah et de la résurrection : Celui qui les a préservés et réveillés est capable de redonner la vie.

Elle enseigne aussi à chercher refuge auprès d'Allah pour protéger sa foi.$t$,
  'moon-outline', 4, false
),

-- ---------- Compagnons ----------
(
  'compagnons',
  $t$Abû Bakr as-Siddîq, l'ami fidèle$t$,
  $t$La loyauté et la confiance, à travers le premier compagnon.$t$,
  $t$Abû Bakr (qu'Allah l'agrée) fut l'un des premiers à croire au message de l'islam. Connu pour son honnêteté avant même l'islam, il n'hésita pas un instant à soutenir la vérité.

On le surnomma « as-Siddîq », le véridique, tant sa confiance était entière. Il mit sa personne et ses biens au service du bien, libérant des opprimés et aidant les nécessiteux.

Sa vie enseigne la loyauté, la générosité et la sincérité — croire avec le cœur, puis agir avec droiture.$t$,
  'people-circle-outline', 5, false
),

-- ---------- Valeurs ----------
(
  'valeurs',
  $t$La bonté envers les parents$t$,
  $t$Un pilier du comportement du musulman.$t$,
  $t$Dans le Coran, Allah ordonne d'être bon envers ses parents, juste après l'ordre de L'adorer Lui seul. C'est dire l'importance de ce lien.

Être bon envers ses parents, c'est leur parler avec douceur, les respecter, prendre soin d'eux surtout dans leur vieillesse, et prier pour eux. Même un simple mot dur est à éviter.

Cette valeur rappelle que la foi se vit aussi dans les gestes du quotidien, en commençant par ceux qui nous sont les plus proches.$t$,
  'heart-outline', 6, false
);
