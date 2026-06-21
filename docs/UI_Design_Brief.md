# Brief de design — App « Apprendre à lire le Coran »

Document destiné à Claude Design pour générer l'interface.

---

## 1. C'est quoi l'app

Une application mobile d'apprentissage qui amène un musulman francophone **débutant total** — qui ne connaît aucune lettre arabe — à savoir lire et comprendre le Coran, étape par étape.

Pense à **« Duolingo, mais pour apprendre à lire le Coran, en français »** : un parcours guidé de leçons courtes, des exercices interactifs, de l'audio, une progression gamifiée (XP, streak, niveaux), et un accès libre au Coran pour pratiquer.

**Utilisateur type :** un adulte ou un jeune francophone (Afrique francophone, France, Québec) motivé, souvent peu confiant (« je n'ai jamais réussi à apprendre l'arabe »). L'app doit donc être **rassurante, chaleureuse et encourageante**, jamais intimidante ou scolaire.

---

## 2. Personnalité visuelle

- **Spirituel mais moderne** — inspiré de la beauté des manuscrits coraniques (chaleur du papier, or de l'enluminure, calligraphie), mais avec la clarté et la simplicité d'une app d'apprentissage d'aujourd'hui.
- **Calme et respirant** — beaucoup d'espace, pas d'encombrement. L'apprentissage du Coran demande du calme.
- **Chaleureux, pas froid** — fonds crème façon papier plutôt que blanc clinique, texte brun chaud plutôt que noir pur.
- **Encourageant** — les erreurs aux quiz sont douces (corail, pas rouge agressif), les réussites sont célébrées (or, animations légères).
- **Le texte arabe est le héros** — toujours grand, lisible, magnifiquement rendu, au centre de l'attention.

À éviter : le vert fluo cliché, le style « mosquée stock photo », les dégradés criards, le surchargé.

---

## 3. Système de couleurs

### Palette retenue — « Espresso & Crème » (brun chaud + or sur crème)

Direction chaleureuse, terreuse et apaisante : brun espresso comme couleur primaire, or pour les récompenses, fond crème façon parchemin. Évoque le cuir des livres reliés, le bois, le calme. Distinctif et reposant pour de longues sessions de lecture.

**Mode clair**

| Rôle | Couleur | Hex |
|---|---|---|
| Primaire (boutons, actif, parcours) | Espresso | `#4A3526` |
| Primaire foncé (pressé, en-têtes) | Espresso sombre | `#2E2118` |
| Primaire clair (fonds teintés, sélection) | Tan pâle | `#EDE3D6` |
| Accent / récompense (or, premium, streak, certificats) | Or chaud | `#C99A3F` |
| Fond principal | Crème parchemin | `#F8F2E8` |
| Surface / cartes | Crème clair | `#FFFDF7` |
| Texte principal | Espresso profond | `#2E2118` |
| Texte secondaire | Brun-gris doux | `#7A6A58` |
| Succès (bonne réponse) | Vert doux | `#2E9E6B` |
| Erreur (mauvaise réponse, douce) | Corail | `#D9654B` |
| Avertissement | Ambre | `#E0A33E` |
| Flamme de streak | Orange chaud | `#E8843C` |

**Mode sombre** (important — beaucoup lisent le soir / la nuit)

| Rôle | Hex |
|---|---|
| Fond principal | `#1A140E` |
| Surface / cartes | `#241C14` |
| Primaire (caramel, pour rester visible sur fond sombre) | `#C9A36E` |
| Texte sur bouton primaire (sombre) | `#241C14` |
| Accent or | `#E0B85C` |
| Texte principal | `#ECE3D5` |
| Texte secondaire | `#A89880` |

**Notes :**
- En mode sombre, le brun primaire serait invisible sur fond foncé : le bouton principal passe donc à un **caramel clair `#C9A36E`** avec texte foncé dessus. L'identité chaude est conservée.
- Le vert n'apparaît **que** comme petit état de succès dans les quiz (jamais comme couleur de marque) — c'est volontaire et discret.
- L'or fait le travail de mise en valeur : étoiles, streak, premium, certificats.

---

## 4. Typographie

- **Texte arabe / coranique (le héros) :** une police conçue pour le Coran avec support correct des harakât (voyelles). Options gratuites : **KFGQPC Uthmanic Hafs** (script officiel du Coran), **Amiri Quran**, ou **Scheherazade New**. Toujours en grande taille, bien aérée.
- **Interface en français (titres + corps) :** un sans-serif chaleureux, rond et lisible — **Plus Jakarta Sans** ou **Poppins** (amical, parfait pour une app d'apprentissage). Alternative plus neutre : **Inter**.
- **Translittération latine :** même police que l'UI, en style légèrement atténué (texte secondaire).
- Deux graisses suffisent : régulier (400) et semi-gras (600) pour les titres et boutons.

---

## 5. Style des composants

- **Coins arrondis généreux** (rayon ~16px sur les cartes, ~12px sur les boutons) — chaleureux et amical.
- **Boutons** : pleins en espresso pour l'action principale (caramel en mode sombre), contour pour le secondaire. Grands, faciles à toucher.
- **Cartes** : surface claire, ombre très légère ou simple bordure fine, beaucoup de padding intérieur.
- **Barre de progression** : espresso (ou or) qui se remplit, fine et nette.
- **Étoiles de leçon** : or (⭐⭐⭐ maîtrise).
- **Icônes** : style outline, fines, modernes (pas de pictos religieux lourds).
- **Illustrations** : douces, géométriques, inspirées des motifs islamiques (arabesques, géométrie) en filigrane discret — jamais figuratives de personnes.
- **Animations** : subtiles. Célébration légère (confettis dorés discrets) à la fin d'un niveau.

---

## 6. Écrans à concevoir (MVP)

1. **Accueil / Bienvenue** — message rassurant, « Apprends à lire le Coran depuis zéro », bouton commencer.
2. **Inscription / Connexion** — simple, email + mot de passe.
3. **Parcours (écran principal)** — chemin vertical de niveaux et leçons façon Duolingo : leçons terminées (or/espresso), en cours (mise en avant), verrouillées (grisées). En haut : XP, flamme de streak, niveau actuel.
4. **Écran de leçon** — le texte arabe en grand au centre, translittération + sens en dessous, gros bouton « écouter » (audio), bouton « répéter ». Navigation précédent / suivant.
5. **Quiz / micro-test** — une question à la fois : reconnaître une lettre, associer un son, choisir le bon mot. Feedback immédiat doux (vert succès / corail erreur).
6. **Niveau complété** — écran de célébration, étoiles obtenues, XP gagné, (plus tard) certificat.
7. **Bibliothèque Coran** — liste des sourates (nom arabe + nom français + nombre de versets).
8. **Lecteur de sourate** — versets en arabe (grands), traduction FR dessous, audio par verset, mots déjà appris surlignés ; taper un mot → audio + sens.
9. **Profil** — XP total, plus longue série (streak), badges, niveaux validés, réglage du mode sombre.
10. **Paywall premium** — présentation douce de l'offre (l'apprentissage avancé + certificats), avec rappel que la lecture du Coran reste toujours gratuite. Mettre en avant l'option « à vie ».

---

## 7. Notes importantes

- **RTL** : le texte arabe se lit de droite à gauche — bien gérer l'alignement et le rendu des voyelles.
- **Accessibilité** : contrastes suffisants en clair ET sombre ; tailles de texte confortables (public pas toujours à l'aise avec la lecture).
- **Le Coran toujours gratuit** : ne jamais donner l'impression de vendre l'accès au texte sacré ; le premium ne concerne que l'outil d'apprentissage.
- **Ton des messages** : bienveillant et motivant (« Bravo, tu as appris ta première lettre ! »), jamais culpabilisant.

---

### Résumé en une phrase pour Claude Design
Une app d'apprentissage du Coran chaleureuse et apaisante, façon Duolingo, palette espresso (brun chaud) + or sur fond crème parchemin (avec mode sombre caramel pour la nuit), texte arabe coranique mis en valeur, coins arrondis, ton encourageant pour des débutants francophones.
