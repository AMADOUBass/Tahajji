# Tahajji — Installation & lancement (runbook)

Guide unique pour installer la base, brancher les données et lancer l'app, **dans l'ordre**. Plus une **checklist de pré-lancement**.

---

## 1. Application (local)

```bash
npm install
```

Crée un fichier **`.env`** à la racine (gitignoré) :
```
EXPO_PUBLIC_SUPABASE_URL=https://tsfnpgecpeehzvjytpee.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_xxx   # clé PUBLISHABLE uniquement (jamais service_role)
```

Lancer :
```bash
npx expo start --go -c    # -c vide le cache (utile après ajout de routes/contenu)
```

> Un **nouveau fichier de route** (ex. un nouvel écran) nécessite un **redémarrage** de Metro (pas juste `r`), sinon « 404 unmatched route ».

---

## 2. Supabase — SQL Editor (dans cet ordre)

### a) Schéma (migrations) — une seule fois, dans l'ordre
1. `db/migrations/0001_init.sql` — tables + RLS + trigger profil
2. `db/migrations/0002_profile_fields.sql` — avatar_url, bio
3. `db/migrations/0003_secure_profile.sql` — **sécurité** : economie serveur (complete_lesson, set_premium)
4. `db/migrations/0004_streak.sql` — série côté serveur
5. `db/migrations/0005_hearts.sql` — cœurs (consume/refill, recharge 10 min)
6. `db/migrations/0006_stories.sql` — table des histoires

### b) Données (seeds) — ré-exécutables
- `db/seed.sql` — **curriculum** (6 unités, leçons, items, quiz, examens). ⚠️ truncate = reset progression (dev).
- `db/import_quran_1.sql` → `db/import_quran_7.sql` — **le Coran** (sourates + versets).
- `db/audio_verses.sql` — URLs audio des versets (everyayah, en ligne).
- `db/stories_seed.sql` — **récits** des Histoires (truncate + insert, 16 récits).

### Vérifs rapides
```sql
select count(*) from lessons;   -- 35
select count(*) from stories;   -- 16
select count(*) from surahs;    -- 114
```

---

## 3. Audio des leçons (optionnel, quand prêt)

1. Générer les clips (TTS) : voir `docs/audio_pipeline.md` + `scripts/build_audio_tts.mjs`.
2. Supabase → **Storage** → bucket **`audio`** (Public) → uploader `audio_out/items/` (chemin final `audio/items/{id}.mp3`).
3. SQL Editor → `db/audio_lessons.sql` (remplacer `<BASE>` par l'URL publique du bucket).
   - Le **ع isolé** (items 18, 46, 74) n'est pas activé (TTS échoue) → à enregistrer à la main puis décommenter le 2ᵉ `update`.

---

## 4. Réglages Auth (Dashboard Supabase → Authentication)

- **Confirm email** : activé (OTP). SMTP **Resend** branché (clé à NE PAS committer).
- **Passwords** : longueur min 8 + *leaked password protection* activée.
- **OTP** : durée d'expiration raisonnable (ex. 10 min).

---

## 5. Checklist de PRÉ-LANCEMENT

| Élément | État |
|---|---|
| ✅ Sécurité P0 (économie serveur non falsifiable) | fait |
| ✅ Curriculum 1→6 + examens (seuil 70 %) | fait |
| ✅ Coran complet + lecteur audio | fait |
| ✅ Cœurs, série, notifications, badges | fait |
| ✅ Mode hors-ligne (contenu + progression + audio) | fait |
| ✅ Pages légales (À propos, Confidentialité, CGU) | brouillons in-app |
| ✅ Onglet Histoires (16 récits) | fait, **à valider** |
| ✅ Audio leçons (TTS) | 177/180 (3 ع à enregistrer) |
| ⏳ **Validation religieuse** du contenu (`docs/validation_contenu.md`) | **bloquant** |
| ⏳ Crédit + accord écrit de l'auteur de la méthode (affiché) | à finaliser |
| ⏳ E-mail de contact réel (légal) + relecture juridique CGU/Confidentialité | à faire |
| ⏳ 3 clips ع (items 18/46/74) | à enregistrer |
| ⏳ Régénérer la clé ElevenLabs + clé Resend | **sécurité** |
| ⏳ Logo + icône + splash | à créer |
| ⏳ RevenueCat (vrai paiement) + retirer `set_premium` de dev | à faire |
| ⏳ Dev build EAS + App Attest/Play Integrity | à faire |
| ⏳ Montée au dernier SDK Expo (avant soumission Apple) | à faire |
| ⏳ Captures + descriptions stores | à faire |

---

## 6. Régénérer le contenu (scripts)

```bash
node scripts/build_curriculum.mjs   # → seed.sql, audio_manifest.csv, audio_lessons.sql, validation_contenu.md, audio_a_enregistrer.md
node scripts/build_quran_sql.mjs && node scripts/split_quran_sql.mjs   # → import_quran_*.sql
node scripts/build_audio_tts.mjs    # → audio_out/items/*.mp3 (TTS, clé ElevenLabs en env)
```
