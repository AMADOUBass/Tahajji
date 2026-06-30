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
de **zéro** : alphabet → voyelles → allongements → tanwîn → règles de lecture → vrais
versets. Le parcours s'appuie sur la méthode **« La mine des novices » (RECI, Bamako,
avec l'autorisation de l'auteur)**, fusionnée avec la **Qaïda Nourania**.

> **Principe non négociable :** la lecture du Coran (texte, traduction, audio de
> récitation) reste **gratuite pour toujours**. Le premium ne concerne que le **cours**
> (apprentissage avancé, tajwîd, certificats).

## ✨ Fonctionnalités

- 🔐 **Auth** — e-mail + confirmation par **code OTP** (Supabase Auth + Resend) ; Google / Apple
- 🗺️ **Parcours** — 6 unités : alphabet · chiffres · voyelles brèves · madd · tanwîn · règles (tajwîd)
- 📝 **Leçons** — lettre/mot en arabe + audio + entraînement
- 🎓 **Examens de fin d'unité** — questions mélangées, **seuil 70 %** pour débloquer la suite
- ✅ **Quiz** avec feedback doux ; **cœurs** (examens uniquement, recharge 1 / 10 min, premium illimité)
- 🔥 **Progression** — XP & niveaux, **série** réelle (serveur), badges, étoiles
- 🔔 **Rappel quotidien** (notification locale)
- 📗 **Coran complet** (114 sourates) en lecture libre + **audio par verset** + lecteur de sourate
- 📚 **Histoires** — récits des prophètes, de l'islam, des compagnons, valeurs
- 📴 **Hors-ligne** — contenu en cache (SQLite), **progression synchronisée** au retour du réseau, **audio téléchargeable**
- 💎 **Premium** — modèle « cours » (voir ci-dessous), paywall + abstraction RevenueCat
- ⚖️ **Pages légales** in-app — À propos/crédits, Confidentialité, CGU

### Modèle freemium « cours »
| Gratuit | Premium |
|---|---|
| Alphabet + chiffres + **tout le Coran** | Voyelles, madd, tanwîn, **tajwîd** |
| Série, badges, examens de base | Certificats, cœurs ∞, histoires premium, hors-ligne, Pratique |

## 🎨 Identité visuelle

Palette **« Espresso & Crème »** : brun chaud + or sur fond crème parchemin, avec un
**mode sombre** caramel pour la lecture nocturne. Texte arabe en **Amiri Quran** ;
interface en **Plus Jakarta Sans**. Interface 100 % icônes (Ionicons), sans emoji.

## 🛠️ Stack technique

| Couche | Technologie |
|---|---|
| App mobile | **Expo SDK 54** (React Native 0.81), TypeScript strict |
| Navigation | **expo-router** (file-based) |
| Backend | **Supabase** — Auth + PostgreSQL (RLS) + Storage |
| Données serveur | **TanStack Query** (React Query) |
| État local | **Zustand** (persisté via AsyncStorage) |
| Hors-ligne | **React Query persisté dans SQLite** (`expo-sqlite/kv-store`) + **NetInfo** + cache audio (`expo-file-system`) |
| Audio | **expo-audio** (récitation everyayah ; sons de leçons générés en TTS) |
| Notifications | **expo-notifications** (rappel de série) |
| Animations | **react-native-reanimated** |
| Tests | **Jest** (jest-expo) + Testing Library |
| Abonnements | **RevenueCat** *(à brancher au dev build — voir `docs/revenuecat.md`)* |

> **Sécurité** — L'économie (XP, cœurs, premium, série) est **gérée côté serveur**
> (fonctions `SECURITY DEFINER` + privilèges par colonne) : non falsifiable par le
> client. Seule la **clé publishable** est dans l'app.

## 📁 Structure du projet

```
app/                  # écrans (expo-router)
  (auth)/             # welcome, sign-in, sign-up, verify-otp, forgot/reset-password
  (tabs)/             # index (parcours), quran, stories, profile
  lesson/[id]         # leçon · quiz/[lessonId] · level-complete/[id]
  surah/[id]          # lecteur de sourate · story/[id] · legal/[doc] · paywall
components/           # AuthForm + kit UI (components/ui) + OfflineBanner
lib/                  # supabase, queries, hearts, gamification, audio, audioCache,
                      # queryPersist (offline), purchases, notifications, theme, legalContent
store/                # stores Zustand (auth, reading, prefs, theme)
db/                   # migrations/ (0001→0006) + seeds (seed.sql, stories_seed.sql, import_quran_*, audio_*)
scripts/              # build_curriculum, build_quran_sql, build_audio_tts…
__tests__/            # tests unitaires (Jest)
docs/                 # SETUP (runbook), pipelines audio, validation, revenuecat
```

## 🚀 Démarrage

### Prérequis
- Node.js 18+ et npm
- L'app **Expo Go** (à jour) — **compatible SDK 54**
- Un projet **Supabase** (la base doit être initialisée — voir le runbook)

### Installation
```bash
npm install
```

### Variables d'environnement
Crée un fichier **`.env`** à la racine :
```
EXPO_PUBLIC_SUPABASE_URL=https://<projet>.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_...   # clé PUBLISHABLE uniquement (jamais service_role)
```

### Base de données
Suis le **runbook** [`docs/SETUP.md`](docs/SETUP.md) : migrations `0001→0006` puis seeds
(`seed.sql`, `import_quran_1..7.sql`, `audio_verses.sql`, `stories_seed.sql`), réglages Auth,
et (optionnel) audio des leçons.

### Lancer l'app
```bash
npx expo start --go -c
```
Scanne le QR avec Expo Go. Wi-Fi restreint (école/public) : ajoute `--tunnel`.
> Un **nouveau fichier de route** nécessite un redémarrage de Metro (pas juste `r`).

## 📜 Scripts

| Commande | Description |
|---|---|
| `npx expo start --go` | Serveur de dev (Expo Go) |
| `npm test` | Tests unitaires (Jest) |
| `npm run android` / `npm run ios` | Émulateur / simulateur |
| `npx tsc --noEmit` | Vérifie les types |
| `npx expo lint` | Lint (ESLint) |
| `node scripts/build_curriculum.mjs` | Régénère le curriculum (seed, manifeste audio, doc de validation) |

## 🧪 Tests

Socle **Jest (jest-expo)** en place. Tests **unitaires** sur la logique pure
(`__tests__/hearts.test.ts`, `gamification.test.ts`). Les tests **fonctionnels/composants**
seront ajoutés **après la montée de SDK** (RNTL 14 incompatible avec jest-expo 54 / React 19).

## 📌 État du projet

- ✅ **MVP fonctionnel** : auth sécurisée, curriculum 1→6 + examens, Coran complet + lecteur audio,
  cœurs/série/XP/badges, histoires, **hors-ligne complet**, pages légales, paywall + prépa RevenueCat.
- ⏳ **Avant publication** : enregistrer/valider l'audio des leçons (3 clips ع à refaire à la main),
  **validation religieuse** du contenu, crédit auteur + relecture juridique, logo, RevenueCat (dev build),
  montée au dernier SDK, soumission stores.

### Notes techniques
- On développe sur **SDK 54** (Expo Go App Store). **Avant Apple** : `npx expo install expo@latest --fix`.
- L'audio des leçons est généré en **TTS arabe (Fusha)** ; les versets utilisent un vrai récitateur.
- La **validation religieuse** du contenu (`docs/validation_contenu.md`) est un prérequis de lancement.

## 📄 Documentation

- [`docs/SETUP.md`](docs/SETUP.md) — installation, migrations/seeds, checklist de lancement
- [`docs/audio_pipeline.md`](docs/audio_pipeline.md) — brancher l'audio des leçons
- [`docs/revenuecat.md`](docs/revenuecat.md) — abonnements (dev build)
- [`AGENTS.md`](AGENTS.md) — guide de développement

---

<div align="center">
<sub>Projet en développement · Coran toujours gratuit, premium = le cours.</sub>
</div>
