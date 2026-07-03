# Tahajji — Checklist de test complète

Coche chaque point. Note les bugs (écran + ce qui se passe) pour correction.

---

## 0. Prérequis (Supabase + app)
- [ ] Migrations exécutées : `0001` → `0006`
- [ ] Seeds : `seed.sql` · `import_quran_1..7.sql` · `audio_verses.sql` · `stories_seed.sql`
- [ ] **`audio_lessons.sql` exécuté APRÈS `seed.sql`** (avec l'URL du bucket)
- [ ] Vérifs : `select count(*) from lessons;` = **35** · `stories;` = **16** · `surahs;` = **114**
- [ ] Dashboard Auth : « Confirm email » ON, mot de passe min 8
- [ ] `.env` avec l'URL + la clé **publishable**
- [ ] Lancé avec `npx expo start --go -c`

## 1. Authentification
- [ ] Accueil : logo, 3 atouts (depuis zéro / hors-ligne / Coran gratuit), boutons
- [ ] Inscription : e-mail + mdp (≥ 8) → **code OTP à 8 chiffres** reçu → entre dans l'app
- [ ] **Même e-mail à nouveau** → message rouge « un compte existe déjà »
- [ ] E-mail invalide / mdp < 8 → **erreurs en rouge** avec icône
- [ ] Le **clavier** ne cache pas les champs · touches « suivant » / « valider »
- [ ] Liens **« conditions »** / **« confidentialité »** cliquables (ouvrent les pages)
- [ ] Boutons **Google / Apple** → message « bientôt disponible »
- [ ] Connexion (compte existant) OK
- [ ] Mot de passe oublié → code → réinitialisation → reconnexion
- [ ] Déconnexion (Profil) → retour à l'accueil

## 2. Parcours
- [ ] En-tête : 🔥 série · ⭐ XP · ❤️ cœurs → tap ouvre l'explication
- [ ] Unités dans l'ordre : Alphabet(1) · Chiffres(2) · Voyelles brèves(3) · Madd(4) · Tanwîn(5) · Règles(6)
- [ ] **Gratuit** : Alphabet + Chiffres · **Premium** (cadenas) : Voyelles → Règles
- [ ] Nœuds : terminé (✓) · en cours (étoile + bulle « Commencer » qui pulse) · verrouillé
- [ ] Nœud **Examen** : carré + ruban + badge « EXAMEN », plus gros
- [ ] Tap sur unité premium (non premium) → **paywall**
- [ ] **Tirer vers le bas** → rafraîchit · skeleton au chargement

## 3. Leçon
- [ ] Ouvre une leçon → carte lettre (arabe géant + translit + description)
- [ ] Variantes voyelles (بَ بِ بُ) pour les lettres
- [ ] **« Écouter »** joue le son (petite vibration) — ou désactivé + « Audio bientôt » si pas de son
- [ ] Conseil « Répète à voix haute »
- [ ] Précédent / Suivant / « Au quiz »

## 4. Quiz
- [ ] Contenu **centré** dans l'écran
- [ ] En-tête : barre + compteur **« 3/8 »**
- [ ] Options **mélangées** (positions aléatoires par question)
- [ ] Bonne réponse → vert + **vibration** + « Bravo » + **info lettre** + bouton **« Réécouter le son »**
- [ ] Mauvaise réponse → **tremblement (shake)** + vibration + rouge + bonne réponse + info + Réécouter
- [ ] Après réponse : les autres options se **grisent / désactivent**
- [ ] Double-tap « Continuer » → ne saute pas de question
- [ ] **Reprise** : réponds à Q1 → **Retour** → rouvre → reprend à **Q2**
- [ ] Fin → écran de célébration (confettis, médaillon, étoiles, +XP) · « Partager »

## 5. Examen
- [ ] Nœud examen → **écran d'intro** (titre, nb questions, 70 %, cœurs en jeu) → « Commencer »
- [ ] Mauvaise réponse → **−1 cœur** (compteur baisse)
- [ ] Score **≥ 70 %** → « Unité validée » → **débloque l'unité suivante**
- [ ] Score **< 70 %** → « Presque ! Réessaie » → bouton « Réessayer »
- [ ] Cœurs à **0** → **fiche « Plus de cœurs »** (compte à rebours en direct + Réviser / Plus tard)
- [ ] « Réviser » → regagne un cœur

## 6. Cœurs
- [ ] Les **leçons** ne consomment PAS de cœur · seuls les **examens** oui
- [ ] Premium → **∞**
- [ ] Fiche « Plus de cœurs » : le compte à rebours **descend en direct**

## 7. Coran
- [ ] Liste des 114 sourates · **recherche** fonctionne
- [ ] Carte **« Reprendre / Commencer »** → se met à jour après lecture
- [ ] Ouvre une sourate → versets (arabe + traduction + n°)
- [ ] **« Écouter »** (pastille) par verset → état « En lecture »
- [ ] Barre du bas : play/pause (vibration) · progression · **temps / durée**
- [ ] Enchaînement **auto** verset par verset
- [ ] **Défilement automatique** vers le verset lu
- [ ] **Télécharger hors-ligne** (nuage) → passe à ✓ « disponible »
- [ ] Skeleton au chargement · erreur réseau → « Réessayer »

## 8. Histoires
- [ ] Liste par catégorie (Prophètes · Histoire · Compagnons · Valeurs) — **16 récits**
- [ ] Ouvre un récit → écran de lecture + bandeau **« en cours de validation »**
- [ ] Skeleton · erreur → Réessayer · tirer pour rafraîchir

## 9. Profil
- [ ] **Carte héros** : avatar cerclé d'or, nom, bio, « Niveau X », barre XP
- [ ] Stats à icônes : ⭐ XP · 🔥 Série · 🎓 Leçons
- [ ] Badges **« X/6 débloqués »**
- [ ] Carte Premium → paywall
- [ ] **Modifier** → nom + bio (compteur 160) → Enregistrer (vibration) · erreur si nom vide
- [ ] Réglages : **Mode sombre** · **Rappel quotidien** · **Heure du rappel** (fiche) · Premium démo · Déconnexion
- [ ] À propos & légal : À propos/crédits · Confidentialité · CGU (s'ouvrent)

## 10. Premium & paywall
- [ ] Paywall : avantages (texte pas coupé) · offres (Mensuel / À vie / Annuel) · essai 7 j · « Coran 100 % gratuit »
- [ ] **Restaurer** et **Conditions** cliquables
- [ ] Achat (démo) → premium → **unités premium débloquées** + cœurs ∞
- [ ] Toggle « Premium (démo) » ON/OFF

## 11. Notifications
- [ ] Rappel ON → demande la permission → programmé
- [ ] Changer l'**heure** → reprogramme (la fiche montre ✓ sur l'heure)

## 12. Hors-ligne
- [ ] Couper le réseau → **bandeau « Hors ligne »** en haut
- [ ] Contenu déjà consulté reste **lisible**
- [ ] Terminer une leçon hors-ligne → **débloque la suite** → se **synchronise** au retour du réseau
- [ ] Un audio téléchargé se **rejoue hors-ligne**

## 13. Thème
- [ ] **Mode sombre** → tous les écrans restent **lisibles** (contraste OK, texte doré visible)

## 14. Général
- [ ] Boutons **retour / fermer** partout
- [ ] **Aucun crash** · aucune page blanche
- [ ] Navigation fluide entre les onglets (icône pleine sur l'onglet actif)
