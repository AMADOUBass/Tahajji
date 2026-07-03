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
  $t$Adam et le repentir$t$,
  $t$Allah accepta le repentir d'Adam après sa faute.$t$,
  $t$Allah créa Adam et lui enseigna de nombreuses choses. Il lui permit de vivre au Paradis avec son épouse, mais leur interdit un arbre précis.

Ils furent trompés par Satan et mangèrent de cet arbre. Ils reconnurent immédiatement leur erreur et demandèrent pardon à Allah.

Allah accepta leur repentir. Adam fut ensuite envoyé sur terre, où commença la vie de l'humanité. Cette histoire enseigne que la porte du repentir reste ouverte pour celui qui revient sincèrement vers Allah.$t$,
  'leaf-outline', 1, false
),
(
  'prophetes',
  $t$Noé et l'arche$t$,
  $t$Le prophète Noé appela son peuple pendant de longues années.$t$,
  $t$Noé invita son peuple à adorer Allah seul. Malgré ses efforts pendant de très nombreuses années, peu de personnes crurent en son message.

Allah lui ordonna de construire une arche. Beaucoup se moquèrent de lui, mais il obéit avec patience.

Lorsque le déluge arriva, les croyants furent sauvés dans l'arche. Cette histoire rappelle l'importance de la patience et de la confiance en Allah.$t$,
  'boat-outline', 2, false
),
(
  'prophetes',
  $t$Abraham et les idoles$t$,
  $t$Abraham montra que seul Allah mérite l'adoration.$t$,
  $t$Abraham vit que son peuple adorait des statues. Il leur expliqua avec sagesse que ces objets ne pouvaient ni aider ni protéger.

Il démontra la faiblesse des idoles afin d'amener son peuple à réfléchir. Beaucoup refusèrent pourtant son appel.

Allah protégea Abraham lorsqu'il fut éprouvé. Son histoire enseigne le courage dans la défense du monothéisme.$t$,
  'hammer-outline', 3, false
),
(
  'prophetes',
  $t$Ismaël et le sacrifice$t$,
  $t$Abraham et Ismaël obéirent au commandement d'Allah.$t$,
  $t$Abraham vit en rêve qu'il devait sacrifier son fils Ismaël. Les prophètes reçoivent des rêves véridiques venant d'Allah.

Ismaël accepta avec patience d'obéir au commandement d'Allah. Tous deux montrèrent une grande soumission.

Avant que le sacrifice n'ait lieu, Allah remplaça Ismaël par un mouton. Cet événement est rappelé lors de l'Aïd al-Adha.$t$,
  'moon-outline', 4, false
),
(
  'prophetes',
  $t$Joseph et le pardon$t$,
  $t$Joseph pardonna à ses frères malgré le mal qu'ils lui avaient fait.$t$,
  $t$Les frères de Joseph furent jaloux de lui et le jetèrent dans un puits. Plus tard, Allah lui accorda une position importante en Égypte.

Lorsque ses frères revinrent le voir, ils regrettèrent leurs actes. Joseph ne chercha pas à se venger.

Il leur pardonna et remercia Allah pour Ses bienfaits. Son histoire montre la patience, le pardon et la confiance en Allah.$t$,
  'star-outline', 5, false
),
(
  'prophetes',
  $t$Moïse face à Pharaon$t$,
  $t$Moïse transmit le message d'Allah malgré un dirigeant injuste.$t$,
  $t$Allah envoya Moïse auprès de Pharaon pour l'appeler à adorer Allah seul et à cesser son injustice.

Pharaon refusa et continua son oppression. Allah accorda plusieurs signes à Moïse.

Allah sauva Moïse et les croyants en ouvrant la mer. Cette histoire montre qu'Allah soutient Ses serviteurs croyants.$t$,
  'water-outline', 6, false
),
(
  'prophetes',
  $t$Jonas dans le poisson$t$,
  $t$Jonas invoqua Allah dans l'épreuve et fut secouru.$t$,
  $t$Jonas quitta son peuple avant d'en recevoir l'ordre d'Allah. Il monta ensuite sur un bateau.

Il fut avalé par un grand poisson. Dans cette épreuve, il invoqua Allah avec sincérité et reconnut sa faute.

Allah accepta son repentir et le sauva. Cette histoire enseigne à ne jamais désespérer de la miséricorde d'Allah.$t$,
  'fish-outline', 7, false
),
(
  'prophetes',
  $t$La première révélation$t$,
  $t$Le début de la mission du dernier prophète.$t$,
  $t$Alors qu'il méditait dans la grotte de Hira, le Prophète Muhammad reçut la première révélation par l'intermédiaire de l'ange Jibril.

Les premiers versets révélés commencèrent par le commandement : « Lis ». Ils soulignent l'importance du savoir.

Cet événement marqua le début de la révélation du Coran et de la mission prophétique.$t$,
  'book-outline', 8, false
),

-- ---------- Compagnons ----------
(
  'compagnons',
  $t$Abou Bakr le fidèle$t$,
  $t$Abou Bakr soutint le Prophète dans les moments difficiles.$t$,
  $t$Abou Bakr fut parmi les premiers à croire au message de l'islam. Il soutint le Prophète avec ses biens et sa personne.

Lors de l'Hégire vers Médine, il accompagna le Prophète dans leur voyage difficile.

Sa sincérité, sa confiance en Allah et sa générosité sont un exemple pour les musulmans.$t$,
  'people-circle-outline', 9, false
),
(
  'compagnons',
  $t$Omar et la justice$t$,
  $t$Omar était connu pour son sens de la justice.$t$,
  $t$Après avoir accepté l'islam, Omar défendit ouvertement les musulmans.

Devenu calife, il gouverna avec justice et simplicité. Il veillait personnellement au bien-être de la population.

Son comportement rappelle que le pouvoir est une responsabilité devant Allah.$t$,
  'shield-checkmark-outline', 10, false
),
(
  'compagnons',
  $t$Othman et la générosité$t$,
  $t$Othman consacra une grande partie de ses biens au bien.$t$,
  $t$Othman était un compagnon généreux. Il finança plusieurs projets utiles à la communauté musulmane.

Pendant son califat, il fit rassembler les copies officielles du Coran afin de préserver sa récitation.

Son exemple montre l'importance de la générosité et de la préservation du Livre d'Allah.$t$,
  'gift-outline', 11, false
),
(
  'compagnons',
  $t$Ali et le courage$t$,
  $t$Ali fit preuve de courage et de sagesse.$t$,
  $t$Ali fut élevé auprès du Prophète et accepta très tôt l'islam.

Lors de l'Hégire, il dormit dans le lit du Prophète pour lui permettre de quitter La Mecque en sécurité par la permission d'Allah.

Il resta connu pour son courage, sa science et son attachement à la justice.$t$,
  'shield-outline', 12, false
),
(
  'compagnons',
  $t$Bilal et la patience$t$,
  $t$Bilal resta ferme malgré les épreuves.$t$,
  $t$Bilal fut persécuté parce qu'il croyait en Allah. Malgré les souffrances, il resta ferme dans sa foi.

Après avoir été libéré, il devint le premier muezzin de l'islam.

Son histoire montre que la foi donne de la force face aux difficultés.$t$,
  'megaphone-outline', 13, false
),

-- ---------- Histoire de l'islam ----------
(
  'histoire',
  $t$L'Hégire vers Médine$t$,
  $t$Les musulmans quittèrent La Mecque pour préserver leur foi.$t$,
  $t$Les persécutions contre les musulmans devinrent très difficiles à La Mecque.

Par ordre d'Allah, le Prophète et les croyants émigrèrent vers Médine. Cette migration est appelée l'Hégire.

Elle marque le début du calendrier musulman et montre l'importance de préserver sa religion.$t$,
  'walk-outline', 14, false
),
(
  'histoire',
  $t$Le traité de Hudaybiyya$t$,
  $t$Un accord de paix apporta de grands bienfaits.$t$,
  $t$Le Prophète et ses compagnons souhaitaient accomplir la ʿOumra, mais ils furent arrêtés avant d'entrer à La Mecque.

Un traité de paix fut conclu. Certains compagnons le trouvèrent difficile à accepter sur le moment.

Avec le temps, cet accord permit une large diffusion de l'islam. Il montre la valeur de la patience et de la sagesse.$t$,
  'document-text-outline', 15, false
),
(
  'histoire',
  $t$La conquête de La Mecque$t$,
  $t$Le Prophète entra à La Mecque avec miséricorde.$t$,
  $t$Après plusieurs événements, le Prophète entra à La Mecque à la tête des musulmans.

Au lieu de se venger, il accorda un pardon général à la majorité de ses anciens adversaires.

Les idoles autour de la Kaaba furent retirées et le culte d'Allah seul y fut rétabli.$t$,
  'home-outline', 16, false
),

-- ---------- Valeurs ----------
(
  'valeurs',
  $t$La sincérité$t$,
  $t$Allah aime les actes faits avec une intention sincère.$t$,
  $t$En islam, les actions valent par leurs intentions. Un même acte peut avoir une grande récompense ou aucune selon l'intention.

Le croyant cherche à agir pour plaire à Allah et non pour être admiré par les gens.

La sincérité apporte la bénédiction dans les œuvres.$t$,
  'heart-outline', 17, false
),
(
  'valeurs',
  $t$La patience$t$,
  $t$La patience aide le croyant dans toutes les épreuves.$t$,
  $t$Le Coran encourage les croyants à être patients face aux difficultés.

La patience ne signifie pas rester sans agir. Elle consiste à continuer à obéir à Allah tout en gardant confiance en Lui.

Allah promet une grande récompense aux patients.$t$,
  'hourglass-outline', 18, false
),
(
  'valeurs',
  $t$La miséricorde$t$,
  $t$Le musulman est appelé à être miséricordieux.$t$,
  $t$Le Prophète enseigna la miséricorde envers les personnes et les animaux.

Être miséricordieux signifie pardonner, aider et traiter les autres avec douceur lorsque cela est juste.

Celui qui fait preuve de miséricorde espère la miséricorde d'Allah.$t$,
  'heart-circle-outline', 19, false
),
(
  'valeurs',
  $t$Dire la vérité$t$,
  $t$La vérité est une qualité essentielle du croyant.$t$,
  $t$L'islam encourage toujours la vérité dans les paroles et les actes.

Dire la vérité renforce la confiance entre les personnes et éloigne du mensonge.

Le croyant s'efforce d'être honnête, même lorsque cela est difficile.$t$,
  'checkmark-circle-outline', 20, false
),

-- ---------- Femmes de l'islam ----------
(
  'femmes',
  $t$Khadija, le premier soutien$t$,
  $t$Khadija fut la première à croire au Prophète.$t$,
  $t$Lorsque le Prophète reçut la première révélation, Khadija le réconforta et lui apporta un soutien total.

Elle fut la première personne à accepter l'islam. Elle consacra sa richesse et son énergie à aider les musulmans.

Sa foi, sa sagesse et sa fidélité en font un modèle pour tous.$t$,
  'heart-outline', 21, false
),
(
  'femmes',
  $t$Aïcha et le savoir$t$,
  $t$Aïcha transmit une grande partie de la science de l'islam.$t$,
  $t$Aïcha apprit directement auprès du Prophète pendant de nombreuses années.

Après sa mort, elle enseigna le Coran, les hadiths et la jurisprudence à de nombreux musulmans.

Son exemple montre l'importance de rechercher et de transmettre le savoir.$t$,
  'library-outline', 22, false
),
(
  'femmes',
  $t$Fatima et la simplicité$t$,
  $t$Fatima mena une vie humble malgré les difficultés.$t$,
  $t$Fatima était connue pour sa patience, sa modestie et son attachement à Allah.

Elle accomplissait ses responsabilités avec sincérité malgré une vie parfois difficile.

Son comportement rappelle que la véritable richesse est celle du cœur.$t$,
  'flower-outline', 23, false
),
(
  'femmes',
  $t$Maryam, choisie par Allah$t$,
  $t$Maryam est un exemple de pureté et de foi.$t$,
  $t$Maryam adorait Allah avec sincérité depuis son enfance.

Allah la choisit pour être la mère du prophète ʿÎsâ, sans père, par Sa puissance.

Elle resta patiente face aux épreuves et plaça sa confiance en Allah.$t$,
  'sparkles-outline', 24, false
),
(
  'femmes',
  $t$Asma et l'Hégire$t$,
  $t$Asma aida le Prophète pendant l'Hégire.$t$,
  $t$Lors de l'Hégire, Asma apportait discrètement de la nourriture au Prophète et à son père Abou Bakr.

Elle déchira sa ceinture en deux pour attacher les provisions, ce qui lui valut un surnom célèbre.

Son courage et son intelligence servirent la communauté musulmane.$t$,
  'bag-outline', 25, false
),
(
  'femmes',
  $t$Oum Salama et le bon conseil$t$,
  $t$Oum Salama donna un conseil précieux.$t$,
  $t$Après le traité de Hudaybiyya, plusieurs compagnons hésitaient à agir.

Oum Salama conseilla au Prophète de commencer lui-même l'action sans parler.

Les compagnons suivirent immédiatement son exemple. Cette histoire montre la valeur de la sagesse.$t$,
  'bulb-outline', 26, false
),
(
  'femmes',
  $t$Soumayya, première martyre$t$,
  $t$Soumayya resta ferme dans sa foi.$t$,
  $t$Soumayya fut parmi les premiers musulmans de La Mecque.

Elle subit de graves persécutions mais refusa d'abandonner sa foi.

Elle devint la première martyre de l'islam.$t$,
  'flame-outline', 27, false
),
(
  'femmes',
  $t$La pudeur de Maryam$t$,
  $t$La pudeur est une qualité noble.$t$,
  $t$Le Coran présente Maryam comme un exemple de foi et de chasteté.

Elle plaça toujours sa confiance en Allah.

Son histoire inspire les croyants de toutes les générations.$t$,
  'heart-circle-outline', 28, false
),
(
  'femmes',
  $t$Le courage d'Asiya$t$,
  $t$Asiya choisit la foi malgré les difficultés.$t$,
  $t$Asiya, l'épouse de Pharaon, crut en Allah malgré l'opposition de son mari.

Elle demanda à Allah une demeure au Paradis.

Sa patience et sa foi sont citées en exemple dans le Coran.$t$,
  'shield-checkmark-outline', 29, false
),

-- ---------- Compagnons & jeunes (suite) ----------
(
  'compagnons',
  $t$Mous'ab, le jeune ambassadeur$t$,
  $t$Mous'ab diffusa l'islam à Médine.$t$,
  $t$Jeune homme issu d'une famille aisée, Mous'ab accepta l'islam malgré les difficultés.

Le Prophète l'envoya enseigner l'islam à Médine avant l'Hégire.

Grâce à son travail, de nombreuses personnes embrassèrent l'islam.$t$,
  'chatbubbles-outline', 30, false
),
(
  'compagnons',
  $t$Oussama, jeune chef$t$,
  $t$Oussama reçut une grande responsabilité très jeune.$t$,
  $t$Malgré son jeune âge, le Prophète le nomma chef d'une armée.

Certains furent surpris, mais le Prophète rappela que la compétence est plus importante que l'âge.

Oussama accomplit sa mission avec sérieux.$t$,
  'flag-outline', 31, false
),
(
  'compagnons',
  $t$Ibn Abbas, le jeune savant$t$,
  $t$Ibn Abbas rechercha le savoir dès son enfance.$t$,
  $t$Très jeune, Ibn Abbas accompagnait le Prophète et mémorisait ses enseignements.

Après la mort du Prophète, il continua à apprendre auprès des compagnons.

Il devint l'un des plus grands spécialistes de l'explication du Coran.$t$,
  'library-outline', 32, false
),
(
  'compagnons',
  $t$Ali dans son enfance$t$,
  $t$Ali accepta l'islam alors qu'il était très jeune.$t$,
  $t$Ali fut parmi les premiers à croire au message du Prophète.

Il grandit dans l'amour d'Allah et de Son Messager.

Sa jeunesse montre qu'il n'y a pas d'âge pour suivre la vérité.$t$,
  'star-outline', 33, false
),
(
  'compagnons',
  $t$Abd Allah ibn Omar$t$,
  $t$Un jeune attaché à la Sunna.$t$,
  $t$Ibn Omar suivait avec soin les enseignements du Prophète.

Il était connu pour son honnêteté, sa générosité et son adoration.

Il transmit de nombreux hadiths aux générations suivantes.$t$,
  'bookmark-outline', 34, false
),
(
  'compagnons',
  $t$Salman cherche la vérité$t$,
  $t$Salman parcourut un long chemin vers l'islam.$t$,
  $t$Salman voyagea pendant des années à la recherche de la vraie religion.

Lorsqu'il rencontra le Prophète, il reconnut les signes qu'il attendait.

Sa persévérance fut récompensée par la guidée d'Allah.$t$,
  'compass-outline', 35, false
),
(
  'compagnons',
  $t$Abou Dhar et la franchise$t$,
  $t$Abou Dhar disait la vérité avec courage.$t$,
  $t$Dès qu'il accepta l'islam, il annonça publiquement sa foi malgré les dangers.

Il mena une vie simple et détachée des richesses.

Son histoire enseigne le courage et la sincérité.$t$,
  'megaphone-outline', 36, false
),
(
  'compagnons',
  $t$Abou Hourayra et les hadiths$t$,
  $t$Abou Hourayra transmit de nombreux hadiths.$t$,
  $t$Il consacra beaucoup de temps à accompagner le Prophète.

Grâce à sa mémoire et à son assiduité, il rapporta un très grand nombre de hadiths authentiques.

Son exemple rappelle l'importance de préserver le savoir.$t$,
  'document-text-outline', 37, false
),

-- ---------- Histoire (suite) ----------
(
  'histoire',
  $t$Les jeunes de la caverne$t$,
  $t$Des jeunes choisirent la foi avant tout.$t$,
  $t$Les jeunes croyants refusèrent l'idolâtrie de leur peuple.

Ils se réfugièrent dans une caverne en plaçant leur confiance en Allah.

Allah les protégea par un miracle pendant de longues années.$t$,
  'moon-outline', 38, false
),

-- ---------- Valeurs (suite) ----------
(
  'valeurs',
  $t$Le jeune qui grandit dans l'adoration$t$,
  $t$La jeunesse est un temps précieux pour obéir à Allah.$t$,
  $t$Le Prophète a enseigné que, parmi les sept personnes protégées par Allah le Jour du Jugement, figure un jeune qui grandit dans l'adoration d'Allah.

Cette parole encourage les jeunes à développer de bonnes habitudes dès leur enfance.

Chaque bonne action accomplie avec sincérité rapproche d'Allah.$t$,
  'sunny-outline', 39, false
);
