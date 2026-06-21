# Spec produit — Apprendre à lire le Coran depuis zéro

**Version 1.0 — document de référence pour le MVP**
Application éducative mobile pour musulmans francophones débutants.

---

## 1. Vision et positionnement

**Une application qui amène un débutant total — qui ne connaît pas une seule lettre arabe — à lire et comprendre le Coran de façon autonome, en français, étape par étape, avec validation de ses compétences.**

Ce n'est **pas** une énième app pour lire le Coran (ce marché est saturé : Muslim Pro, Quran.com, Quran Majeed comptent des dizaines de millions d'utilisateurs gratuits). C'est une app **d'apprentissage structuré**, là où le marché est encore vide pour le public francophone.

La différence tient en une phrase :

> Les autres apps supposent que tu sais déjà lire l'arabe. La tienne part de zéro et t'y amène.

---

## 2. Marché cible

### Public principal
Musulmans **francophones non-arabophones** qui veulent apprendre à lire le Coran :

- Afrique de l'Ouest et du Nord francophone : Sénégal, Mali, Côte d'Ivoire, Guinée, Burkina, Maroc, Algérie, Tunisie
- Diaspora : France (~5–6 millions de musulmans), Belgique, Québec/Canada
- Convertis francophones (segment petit mais très motivé et prêt à payer)
- Parents qui veulent que leurs enfants apprennent (segment clé pour la monétisation)

### Pourquoi ce public est sous-servi
Presque toutes les apps d'apprentissage sérieuses sont **en anglais** et pensées pour un public anglophone. Le francophone qui ne parle pas anglais et ne lit pas l'arabe n'a aujourd'hui que YouTube (désorganisé) ou des cours en présentiel (coûteux, peu accessibles).

### Réalisme
Le marché est immense, mais en tant que développeur solo tu ne le toucheras pas en entier. Ton plan d'acquisition réaliste passe par des communautés précises : groupes Facebook/WhatsApp de musulmans francophones, TikTok/YouTube de da'wah, réseaux de mosquées et d'écoles coraniques. Vise une niche que tu peux atteindre, pas « tous les musulmans du monde ».

---

## 3. Différenciation

| Concurrent | Ce qu'il fait | Ce qu'il ne fait PAS |
|---|---|---|
| Duolingo | Arabe général, gamifié | Pas islamique, pas le Coran, anglais |
| Quran.com / Muslim Pro | Lecture du Coran | N'apprend pas à lire de zéro |
| Tarteel AI | Correction de récitation par IA | Suppose que tu sais déjà lire |
| Quranic | Vocabulaire coranique | Anglais, pas de parcours lecture A→Z |
| YouTube | Contenu gratuit abondant | Aucune structure, aucune validation |

**Ton angle unique :** parcours complet (alphabet → lecture autonome) + pratique sur de vrais versets + validation par examens et certificats + **en français** + **fonctionne hors-ligne**.

---

## 4. Architecture produit

Cinq modules. J'ai gardé la structure de ton spec d'origine et ajouté ce qui manquait (en gras).

### Module 1 — Parcours d'apprentissage (cœur du produit)

Progression pédagogique, du zéro à la lecture fluide :

1. Alphabet arabe (formes isolées des lettres)
2. Lettres connectées (début / milieu / fin de mot)
3. Voyelles courtes (harakât) et syllabes
4. Voyelles longues et règles de base (soukoun, chadda, tanwîn)
5. Mots fréquents du Coran
6. Mots dans de vrais versets
7. Lecture de sourates courtes (Al-Fatiha, Al-Ikhlas…)
8. Lecture fluide du Juz 'Amma

> **Important :** cette séquence existe déjà sous une forme éprouvée depuis des siècles — la **Qaida Nourania (Qā'ida Nūrāniyya)**, méthode standard mondiale pour apprendre à lire le Coran de zéro. **Structure ton curriculum dessus.** Ça te donne une pédagogie validée et de la crédibilité instantanée auprès des parents et des écoles.

Fonctionnalités : leçons courtes guidées, navigation précédent/suivant, barre de progression, répétition, exercices interactifs de reconnaissance et de lecture.

### Module 2 — Coran complet interactif (bibliothèque)

- Coran complet, navigation simple, mode lecture fluide
- Traduction FR / EN, audio par verset
- Mode apprentissage : taper un mot → audio + sens ; surlignage des mots déjà appris
- Mode pratique : exercices sur de vrais versets, lecture assistée, répétition ciblée

> **Règle non négociable :** la lecture du Coran (le texte et l'audio de récitation) reste **toujours gratuite**. On y revient dans la section monétisation — c'est essentiel pour la confiance.

### Module 3 — Audio et prononciation

**MVP (simple) :** audio natif pré-enregistré pour lettres / mots / versets, bouton « écouter », répétition par l'utilisateur.

**Version future (IA) :** reconnaissance vocale, correction de prononciation, score de lecture, comparaison avec la récitation correcte. *À ne pas faire au début — la reconnaissance vocale du Tajweed est techniquement très difficile et coûteuse.*

### Module 4 — Examens et validation

- Micro-tests après chaque leçon (reconnaître une lettre, lire un mot, quiz)
- Tests de niveau (lecture de mots, reconnaissance audio, lecture guidée)
- Examen final de niveau (lecture sans aide, compréhension simple)
- Notation : ⭐ terminé · ⭐⭐ correct · ⭐⭐⭐ maîtrise

### Module 5 — Gamification et certificats

- XP, niveaux, badges, streak (jours consécutifs), objectifs quotidiens
- Certificats par niveau complété (ex : « Lecture arabe niveau 1 », « Juz 'Amma débutant »)

### **Module 6 (AJOUTÉ) — Tableau de bord parent / enseignant**

C'est l'ajout le plus important côté business (voir monétisation).

- Un parent ou un enseignant crée des profils d'élèves et suit leur progression
- Statistiques : leçons complétées, niveaux validés, régularité
- **C'est ce module qui débloque la vente aux écoles coraniques et aux familles — ta source de revenus la plus fiable.**

### **Fonctionnalités transversales (AJOUTÉES)**

- **Mode hors-ligne complet.** Critique pour l'Afrique (connexion instable, data chère). Les leçons et l'audio se téléchargent et fonctionnent sans réseau. C'est un différentiateur majeur que les apps occidentales négligent.
- **Audio léger / faible consommation de data**, pour ne pas pénaliser les utilisateurs africains.
- **Notifications de rappel** (streak, objectif quotidien) pour la rétention.

---

## 5. Modèle économique — comment l'app fait de l'argent

C'est la section que tu m'as demandé de renforcer. Voici une stratégie complète et réaliste.

### 5.1 Le principe fondateur (à ne jamais violer)

Dans le marché musulman, faire payer **l'accès au Coran lui-même** est très mal perçu et détruit la confiance. Muslim Pro a subi un boycott pour avoir vendu les données de ses utilisateurs — c'est le genre d'erreur réputationnelle dont on ne se relève pas.

**La règle :** le Coran (lecture, traduction, audio de récitation) est **gratuit pour toujours**. Tu fais payer **l'outil pédagogique** autour : le parcours d'apprentissage avancé, le suivi, les certificats, la gamification, l'IA. Le cadrage marketing est : *« Soutenez le développement d'un outil gratuit d'apprentissage du Coran. »*

### 5.2 Les quatre sources de revenus

**A. Abonnement individuel (freemium) — revenu de base**

- **Gratuit :** alphabet + premiers niveaux, lecture complète du Coran, audio de base.
- **Premium :** tous les niveaux avancés, examens complets, certificats, tableau de bord détaillé, mode apprentissage dans le Coran, (plus tard) IA de prononciation.
- **Prix repère :** ~5–7 $/mois, ou ~40–50 $/an, ou **achat à vie ~50–70 $**.

> Conseil marché : propose fortement l'**option à vie**. Beaucoup de musulmans préfèrent un paiement unique à un abonnement récurrent pour une app religieuse. Ça augmente la conversion et te donne du cash d'avance.

**B. Forfait famille — fort potentiel**

Un parent paie un seul abonnement couvrant plusieurs enfants, avec le tableau de bord parent. Prix : ~10–12 $/mois ou ~80–100 $/an. La valeur perçue est très élevée pour les parents : ils paieraient bien plus cher un professeur de Coran en présentiel.

**C. Licences institutionnelles (B2B) — ta source la plus fiable**

C'est le levier que ChatGPT a totalement manqué, et c'est probablement ton meilleur revenu.

Vends l'app comme **outil d'enseignement** aux :
- écoles coraniques / madrasas (Afrique francophone et diaspora)
- écoles islamiques privées
- mosquées qui donnent des cours
- associations

Tu offres des comptes enseignants + suivi d'élèves + contenu structuré. Prix : abonnement annuel par établissement (ex. 200–500 $/an selon le nombre d'élèves), ou par siège.

Pourquoi c'est mieux que le grand public :
- moins sensible au prix (c'est un budget pédagogique, pas une dépense perso)
- revenu récurrent et prévisible
- 20 écoles à 400 $/an = 8 000 $/an stables, bien plus faciles à atteindre que des milliers d'abonnés individuels.

**D. (Optionnel) Soutien / sadaqah**

Un bouton « soutenir le projet » pour les dons volontaires. Revenu d'appoint, pas un pilier, mais bien aligné culturellement.

### 5.3 Ce qu'il NE FAUT PAS faire

- ❌ **Pas de publicité dans une app de Coran** — perçu comme irrespectueux, casse la confiance.
- ❌ **Ne jamais vendre ni partager les données** des utilisateurs (l'erreur fatale de Muslim Pro).
- ❌ **Ne pas paywaller le texte du Coran** lui-même.

### 5.4 Projection illustrative (hypothèses, pas une promesse)

Ces chiffres servent à raisonner, pas à prédire. Le résultat réel dépend entièrement de ton exécution et de ta capacité à atteindre les communautés.

**Scénario conservateur, année 1 :**
- 20 000 téléchargements (atteignables via communautés francophones ciblées)
- Conversion gratuit → payant de 3 % → ~600 abonnés payants
- Panier moyen ~45 $/an (mix mensuel/annuel/à vie) → **~27 000 $/an**
- + 10 institutions à 400 $/an → **+4 000 $/an**
- **Total ordre de grandeur : 25 000 – 35 000 $ année 1**, en croissance si la rétention est bonne.

Ce n'est pas un revenu qui change une vie immédiatement, mais c'est réel, ça se construit, et le coût marginal par utilisateur supplémentaire est quasi nul.

> Je ne suis pas conseiller financier : traite ces chiffres comme un exercice de cadrage, pas comme une garantie.

---

## 6. Production du contenu — le vrai défi (à ne pas sous-estimer)

**Le code n'est pas le travail le plus dur. Le contenu l'est.** C'est ici que la plupart des projets comme celui-ci échouent. Prévois-le sérieusement.

### 6.1 Le curriculum
Conçois le parcours sur la base de la **Qaida Nourania** (méthode éprouvée). Idéalement avec l'aide d'une personne qualifiée en enseignement du Coran. Ne l'improvise pas seul.

### 6.2 L'audio (le gros morceau)
Tu auras besoin de **centaines de clips audio** : chaque lettre, chaque combinaison, chaque mot, chaque verset — récités correctement avec le bon Tajweed. Deux options :
- Enregistrer avec un **récitateur qualifié (qari)** — la meilleure qualité, contrôle total. Prévois un budget (quelques centaines à quelques milliers de dollars selon le volume).
- Licencier de l'audio existant correctement autorisé.

C'est 60–70 % de l'effort réel du projet. Planifie-le dès le départ.

### 6.3 La validation religieuse — ta survie
**Une seule erreur de prononciation ou de traduction dans une app de Coran te discrédite instantanément** auprès de toute la communauté, et le bouche-à-oreille te tue. Donc :
- Fais **valider tout le contenu par une autorité religieuse** reconnue (imam, hafiz, institution) avant publication.
- Affiche cette validation : c'est aussi ton **meilleur argument marketing** (« contenu validé par [autorité] »).

---

## 7. Stack technique recommandé

Choisi pour coller à ce que tu maîtrises déjà.

| Couche | Choix | Pourquoi |
|---|---|---|
| **Application mobile** | **Expo (React Native)** | Tu réutilises ton expérience React/Next.js ; un seul code pour iOS + Android ; test en direct sur ton téléphone (live-reload) ; **mises à jour OTA** pour corriger le contenu sans repasser par l'App Store |
| **Backend / base de données / auth** | **Supabase** (PostgreSQL) | Tu le maîtrises ; auth, base de données et stockage intégrés |
| **Stockage audio** | Supabase Storage ou **Cloudflare R2** | R2 = pas de frais de sortie, idéal pour servir beaucoup d'audio à bas coût |
| **Hors-ligne** | `expo-sqlite` + cache audio (`expo-file-system`) | Leçons et audio disponibles sans réseau |
| **Audio** | `expo-av` | Lecture des clips lettres / mots / versets |
| **Notifications** | `expo-notifications` | Rappels de streak et objectifs |
| **Paiements mobiles** | **RevenueCat** (SDK React Native) | Gère proprement les abonnements App Store + Google Play ; **nécessite un *development build* via EAS, pas Expo Go** |
| **Paiements web / institutionnels** | **Stripe** | Pour les licences B2B et le forfait famille via le web |
| **Notifications push distantes (optionnel)** | Expo Push Notifications | Si besoin d'envoyer des push depuis le serveur (annonces, relances) ; les rappels locaux sont déjà couverts par `expo-notifications` |
| **Certificats** | Génération PDF côté client/serveur | Certificats téléchargeables |
| **IA prononciation (v2+)** | Service spécialisé / modèle dédié | Repoussé après le MVP — difficile et coûteux |

**Pourquoi mobile et non web :** usage quotidien, audio, notifications, hors-ligne → le mobile gagne nettement. Avec Expo tu testes en direct sur ton propre téléphone pendant que tu codes. Tu peux ajouter un petit portail web plus tard pour les institutions (et y réutiliser ta stack Next.js).

---

## 8. Roadmap MVP

Découpée pour un développeur solo travaillant à temps partiel (tu finis ton DEC et ton stage en parallèle). Les semaines sont indicatives.

### MVP (Version 1) — l'essentiel à coder en priorité
- Parcours A → Z (au moins les niveaux 1 à 4 : alphabet → syllabes)
- Leçons structurées + navigation + barre de progression
- Audio simple pré-enregistré
- Quiz basiques + micro-tests
- Système de progression et de streak
- Lecture du Coran (au moins le Juz 'Amma) gratuite
- Mode hors-ligne de base
- Auth + un seul niveau payant pour tester la monétisation

### Phases (indicatif, temps partiel)

| Phase | Contenu | Durée approx. |
|---|---|---|
| 0 — Préparation | Curriculum (Qaida Nourania), maquettes, plan de contenu | 2–3 sem |
| 1 — Contenu | Enregistrement/collecte audio niveaux 1–4, validation religieuse | 3–5 sem (en parallèle) |
| 2 — Cœur app | Parcours + leçons + audio + progression (Expo + Supabase), test du rendu arabe sur iOS et Android dès le début | 4–6 sem |
| 3 — Coran + hors-ligne | Bibliothèque Coran, mode hors-ligne, quiz | 2–3 sem |
| 4 — Monétisation | RevenueCat, un niveau premium, écran d'abonnement | 1–2 sem |
| 5 — Test + lancement | Beta avec quelques utilisateurs réels, corrections, publication stores | 2–3 sem |

> Ordre de grandeur : un MVP publiable en **~12–16 semaines à temps partiel**, à condition que le contenu avance en parallèle du code.

### Après le MVP (Nice to have)
Examens avancés · gamification complète · certificats · mode apprentissage dans le Coran · forfait famille · tableau de bord enseignant · licences institutionnelles · IA de prononciation.

---

## 9. Risques et mitigations

| Risque | Gravité | Mitigation |
|---|---|---|
| Erreur de contenu religieux | **Critique** | Validation par autorité avant publication ; afficher la caution |
| Sous-estimer la production audio | Élevé | Planifier le contenu dès la phase 0 ; budget récitateur |
| Sensibilité à monétiser le Coran | Élevé | Coran toujours gratuit ; ne faire payer que l'outil pédagogique |
| Faible rétention | Moyen | Streak, objectifs quotidiens, notifications, leçons courtes |
| Acquisition difficile | Moyen | Cibler des communautés précises, pas « tout le monde » ; angle B2B écoles |
| Concurrence des géants | Moyen | Ne pas les affronter sur la lecture ; rester sur l'apprentissage francophone |

---

## 10. Indicateurs de succès à suivre

- Activation : % d'utilisateurs qui terminent le niveau 1
- Rétention J1 / J7 / J30
- Longueur de streak moyenne
- Conversion gratuit → payant
- Nombre de niveaux validés par utilisateur
- Contrats institutionnels signés

---

## 11. Prochaines étapes concrètes

1. **Valider la pédagogie** : étudier la Qaida Nourania et figer la séquence exacte des niveaux 1–4.
2. **Trouver une caution religieuse** dès maintenant (imam / institution) — avant de coder.
3. **Régler la question de l'audio** : qui récite, à quel coût, sous quelle licence.
4. **Construire le MVP** des niveaux 1–4 en Expo (React Native) + Supabase, en testant sur ton téléphone via Expo Go.
5. **Tester sur 10–20 utilisateurs réels** d'une communauté francophone avant d'élargir.
6. **Brancher la monétisation** (RevenueCat, une offre premium + l'option à vie).
7. **Démarcher 2–3 écoles coraniques** pour valider le revenu institutionnel.

---

### Résumé en une ligne

Une app mobile francophone, hors-ligne, qui amène un débutant total à lire le Coran de zéro — gratuite pour la lecture, payante pour l'apprentissage avancé et les certificats, avec une vente B2B aux écoles comme revenu le plus solide.
