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
),

-- ---------- Prophètes (suite) ----------
(
  'prophetes',
  $t$Adam, le premier homme$t$,
  $t$L'erreur est humaine, mais la porte du repentir reste ouverte.$t$,
  $t$Adam (paix sur lui) est le premier être humain et le premier prophète. Allah le créa, puis ordonna aux anges de se prosterner devant lui par respect ; tous obéirent, sauf Iblîs, par orgueil.

Adam et son épouse vécurent au Paradis, où tout leur était permis sauf un arbre. Iblîs les trompa et ils en mangèrent ; ils furent alors envoyés sur la terre.

Pleins de regret, ils se tournèrent vers Allah et se repentirent. Allah, le Très Miséricordieux, accepta leur repentir. Ce récit enseigne que chacun peut se tromper, mais que le repentir sincère est toujours accueilli.$t$,
  'leaf-outline', 7, false
),
(
  'prophetes',
  $t$Nûh et l'arche$t$,
  $t$La patience dans l'appel au bien.$t$,
  $t$Le prophète Nûh (paix sur lui) appela son peuple à adorer Allah seul durant de très longues années. Malgré sa patience, peu le suivirent et la plupart se moquèrent de lui.

Sur l'ordre d'Allah, Nûh construisit une grande arche. Quand vint le châtiment, un déluge immense recouvrit la terre. Nûh y embarqua les croyants et un couple de chaque espèce.

Les croyants furent sauvés, et l'arche se posa lorsque les eaux se retirèrent. Ce récit enseigne la persévérance dans le bien et la confiance en la promesse d'Allah.$t$,
  'boat-outline', 8, false
),
(
  'prophetes',
  $t$Yûsuf, le plus beau des récits$t$,
  $t$La patience, la chasteté et le pardon.$t$,
  $t$Le prophète Yûsuf (paix sur lui), fils de Yaʿqûb, vit en rêve onze étoiles, le soleil et la lune se prosterner. Par jalousie, ses frères le jetèrent dans un puits ; il fut recueilli, puis grandit en Égypte.

Éprouvé puis injustement emprisonné, Yûsuf resta patient et fidèle à Allah. Grâce à sa sagesse et à l'interprétation des rêves, il devint un haut responsable et sauva l'Égypte de la famine.

Il retrouva enfin sa famille et pardonna à ses frères. Ce récit enseigne la patience face à l'injustice et la beauté du pardon.$t$,
  'sparkles-outline', 9, false
),
(
  'prophetes',
  $t$ʿÎsâ et sa mère Maryam$t$,
  $t$La pureté de la foi en l'unicité d'Allah.$t$,
  $t$Maryam (paix sur elle) était une femme d'une grande piété. Par la volonté d'Allah, elle donna naissance à ʿÎsâ (Jésus, paix sur lui) sans père — un miracle, comme Adam fut créé sans père ni mère.

ʿÎsâ est un grand prophète d'Allah. Par la permission d'Allah, il accomplit des miracles, et parla même au berceau pour défendre l'honneur de sa mère.

En islam, ʿÎsâ n'est ni Dieu ni fils de Dieu : il est un prophète et un serviteur d'Allah. Ce récit enseigne le respect de Maryam et la pureté de la croyance en un Dieu unique.$t$,
  'star-outline', 10, false
),
(
  'prophetes',
  $t$Ayyûb et la patience$t$,
  $t$Rester ferme et reconnaissant dans l'épreuve.$t$,
  $t$Le prophète Ayyûb (Job, paix sur lui) était comblé de bienfaits : santé, famille et richesse. Allah l'éprouva en lui retirant tout cela, et par une longue maladie.

Malgré l'épreuve, Ayyûb ne se plaignit jamais d'Allah ; il resta patient et reconnaissant, continuant à L'invoquer avec humilité.

Allah le guérit et lui rendit plus qu'il n'avait perdu. Ayyûb est le symbole de la patience (sabr). Ce récit enseigne la confiance en Allah dans les moments difficiles.$t$,
  'fitness-outline', 11, false
),
(
  'prophetes',
  $t$Dâwûd et Jâlût (Goliath)$t$,
  $t$La foi et le courage valent plus que la force apparente.$t$,
  $t$Avant de devenir prophète et roi, Dâwûd (David, paix sur lui) était un jeune homme parmi les croyants. Leur armée affronta le tyran Jâlût (Goliath) et ses troupes redoutables.

Alors que beaucoup tremblaient, le jeune Dâwûd, plein de foi, affronta Jâlût et le terrassa par la permission d'Allah.

Allah accorda ensuite à Dâwûd la royauté, la sagesse et une voix magnifique pour Le glorifier. Ce récit montre que la confiance en Allah dépasse toute force matérielle.$t$,
  'shield-outline', 12, false
),
(
  'prophetes',
  $t$Sulaymân et la huppe$t$,
  $t$La vraie puissance s'emploie à appeler vers le bien.$t$,
  $t$Le prophète Sulaymân (Salomon, paix sur lui), fils de Dâwûd, reçut d'Allah un royaume immense et la capacité de comprendre le langage des animaux ; le vent même était à son service.

Un jour, une huppe l'informa d'un royaume lointain, Saba, dont la reine et le peuple adoraient le soleil au lieu d'Allah. Sulaymân leur envoya un message les invitant à la vérité.

Touchée par sa sagesse, la reine de Saba reconnut la grandeur d'Allah et crut. Ce récit montre que la puissance véritable sert à guider vers l'unicité d'Allah.$t$,
  'sunny-outline', 13, false
),

-- ---------- Histoire de l'islam (suite) ----------
(
  'histoire',
  $t$L'année de l'éléphant$t$,
  $t$Allah protège Sa maison sacrée.$t$,
  $t$Quelque temps avant la naissance du Prophète Muhammad (paix et bénédiction sur lui), un puissant gouverneur nommé Abraha marcha sur La Mecque avec une armée comptant des éléphants, pour détruire la Kaʿba.

Mais en approchant, l'éléphant de tête refusa d'avancer vers la Kaʿba. Allah envoya alors des nuées d'oiseaux qui lancèrent sur l'armée des pierres d'argile.

L'armée fut anéantie et la Kaʿba protégée. Cet événement, rappelé dans la sourate Al-Fîl, montre que nulle force ne peut défier la volonté d'Allah.$t$,
  'shield-checkmark-outline', 14, false
),

-- ---------- Compagnons (suite) ----------
(
  'compagnons',
  $t$Bilâl, le premier muezzin$t$,
  $t$La valeur d'une personne tient à sa foi, non à son origine.$t$,
  $t$Bilâl ibn Rabâh (qu'Allah l'agrée) était un esclave d'origine abyssine. Lorsqu'il embrassa l'islam, son maître le tortura sous le soleil brûlant pour qu'il renie sa foi.

Mais Bilâl, ferme et patient, répétait seulement : « Ahad, Ahad » — « Un seul, un seul ». Abû Bakr finit par l'affranchir.

Plus tard, grâce à sa belle voix et à sa foi, Bilâl devint le premier muezzin de l'islam, appelant les croyants à la prière. Son histoire enseigne que la noblesse vient du cœur et de la foi.$t$,
  'megaphone-outline', 15, false
),

-- ---------- Valeurs (suite) ----------
(
  'valeurs',
  $t$La véracité (as-sidq)$t$,
  $t$Faire de l'honnêteté une habitude.$t$,
  $t$L'islam accorde une grande importance à la véracité : dire la vérité, tenir ses promesses et être honnête dans ses actes.

Le musulman est appelé à être digne de confiance, dans ses paroles comme dans son travail. Le mensonge, lui, brise la confiance et éloigne du bien.

La sincérité rapproche d'Allah et mène à la droiture. Ce rappel enseigne à être honnête dans les petites comme dans les grandes choses.$t$,
  'checkmark-circle-outline', 16, false
);
