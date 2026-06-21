<div align="center">

# Tahajji · تهجّي

**Apprendre à lire le Coran depuis zéro — pour les francophones débutants.**

Une application mobile d'apprentissage, façon Duolingo, qui amène un débutant total
(qui ne connaît aucune lettre arabe) à lire le Coran, étape par étape, en français,
hors-ligne.

Expo (React Native) · TypeScript · Supabase

</div>

---

## 📖 À propos

La plupart des apps de Coran supposent que tu sais **déjà** lire l'arabe. Tahajji part
de **zéro** : alphabet → lettres connectées → voyelles → syllabes → lecture de vrais
versets. Le parcours est structuré sur la **Qaïda Nourania** (méthode d'apprentissage
éprouvée).

> **Principe non négociable :** la lecture du Coran (texte, traduction, audio de
> récitation) reste **gratuite pour toujours**. Le premium ne concerne que l'outil
> pédagogique (apprentissage avancé, certificats, suivi).

## ✨ Fonctionnalités (périmètre MVP)

- 🔐 **Authentification** — email + mot de passe (Supabase Auth), + connexion Google / Apple
- 🗺️ **Parcours d'apprentissage** — niveaux 1 à 4 (alphabet → syllabes), façon Duolingo
- 📝 **Leçons interactives** — lettre/mot en arabe + audio + exercice
- ✅ **Quiz** après chaque leçon (reconnaissance, choix multiple) avec feedback doux
- 🔥 **Progression** — XP, série (streak), statut des leçons, étoiles
- 📗 **Bibliothèque Coran** en lecture libre (Juz 'Amma) avec audio par verset
- 📴 **Mode hors-ligne** — leçons et audio mis en cache localement
- 💎 **Premium** (placeholder) — un niveau payant pour câbler la logique d'abonnement

**Hors périmètre MVP :** IA de prononciation, tableau de bord parent/enseignant,
licences institutionnelles, certificats PDF, fonctionnalités sociales.

## 🎨 Identité visuelle

Palette **« Espresso & Crème »** : brun chaud + or sur fond crème parchemin, avec un
**mode sombre** caramel pour la lecture nocturne. Le texte arabe est mis en valeur via
la police coranique **Amiri Quran** ; l'interface utilise **Plus Jakarta Sans**.

## 🛠️ Stack technique

| Couche | Technologie |
|---|---|
| App mobile | **Expo SDK 54** (React Native 0.81), TypeScript strict |
| Navigation | **expo-router** (file-based) |
| Backend | **Supabase** (Auth + PostgreSQL + Storage) |
| Données serveur | **TanStack Query** (React Query) |
| État local | **Zustand** (persisté via AsyncStorage) |
| Hors-ligne | **expo-sqlite** + **expo-file-system** |
| Audio | **expo-audio** |
| Notifications | **expo-notifications** (rappels de série) |
| Animations | **react-native-reanimated** |
| Abonnements | **RevenueCat** *(post-MVP — nécessite un dev build EAS)* |

## 📁 Structure du projet

```
app/                  # écrans (expo-router)
  (auth)/             # welcome, sign-in, sign-up
  (tabs)/             # parcours (index), quran, practice, profile
  lesson/[id]         # écran de leçon
  quiz/[lessonId]     # quiz
  level-complete/[id] # célébration de fin
  surah/[id]          # lecteur de sourate
  paywall             # offre premium
components/           # AuthForm + kit UI réutilisable (components/ui)
lib/                  # supabase, queries (React Query), audio, theme, fonts, mock
store/                # stores Zustand (auth, game, theme)
types/                # types domaine + types BD
docs/                 # spec produit + brief de design
design/               # maquettes haute-fidélité
```

## 🚀 Démarrage

### Prérequis
- Node.js 18+ et npm
- L'app **Expo Go** (à jour) sur ton téléphone — **compatible SDK 54**

### Installation
```bash
npm install
```

### Variables d'environnement
Copie le modèle puis renseigne tes clés Supabase :
```bash
cp .env.example .env
```
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```
> ℹ️ L'UI fonctionne actuellement sur des **données mock** : tu peux lancer et explorer
> toute l'app **sans** configurer Supabase. Les clés ne seront requises qu'à
> l'intégration backend.

### Lancer l'app
```bash
npx expo start --go
```
Puis scanne le QR code avec Expo Go (iOS : appareil photo · Android : Expo Go).
Si le Wi-Fi bloque la connexion (réseaux d'école/publics) : `npx expo start --go --tunnel`.

## 📜 Scripts

| Commande | Description |
|---|---|
| `npx expo start --go` | Démarre le serveur de dev (Expo Go) |
| `npm run android` / `npm run ios` | Lance sur émulateur/simulateur |
| `npx tsc --noEmit` | Vérifie les types (TypeScript strict) |
| `npx expo-doctor` | Vérifie la santé des dépendances |
| `npx expo lint` | Lint |

## 📌 État du projet

- ✅ **UI complète** des 10 écrans du MVP, branchée sur des **données mock typées**
  comme la future base Supabase (approche *UI-first* → swap backend sans réécrire l'UI).
- ⏳ **À venir** : intégration Supabase (migration SQL, seed, génération des types,
  auth réelle), audio réel, cache hors-ligne, puis monétisation (RevenueCat).

### Notes techniques
- On développe sur **SDK 54** car l'Expo Go de l'App Store le supporte. **Avant la
  publication sur Apple**, monter au dernier SDK (`npx expo install expo@latest --fix`).
- L'audio pédagogique (centaines de clips récités) et la **validation religieuse** du
  contenu sont le vrai défi du projet — à planifier en parallèle du code.

## 📄 Documentation

- [`docs/Spec_App_Apprendre_le_Coran.md`](docs/Spec_App_Apprendre_le_Coran.md) — spec produit
- [`docs/UI_Design_Brief.md`](docs/UI_Design_Brief.md) — brief de design
- [`AGENTS.md`](AGENTS.md) — guide de développement (schéma BD, conventions, roadmap)

---

<div align="center">
<sub>Projet en développement · Coran toujours gratuit, premium = outil pédagogique uniquement.</sub>
</div>
