# Brancher RevenueCat (au moment du dev build)

RevenueCat gère les abonnements **par-dessus l'App Store (StoreKit) et Google Play
Billing** : l'argent passe par Apple/Google (commission 15–30 %), RevenueCat gère
achats, reçus, renouvellements et « entitlements ». **Impossible à tester dans
Expo Go** → il faut un **dev build EAS**.

Tant qu'on est en Expo Go, l'app **simule** l'achat (`lib/purchases.ts`, via la
fonction de dev `set_premium`). Voici comment passer au vrai paiement.

## 1. Comptes & produits
1. **App Store Connect** : créer les abonnements + l'achat unique :
   - `tahajji_premium_monthly` (abo, avec **essai gratuit 7 j** si voulu)
   - `tahajji_premium_yearly` (abo)
   - `tahajji_premium_lifetime` (non-consommable)
2. **Google Play Console** : créer les mêmes produits.
3. **RevenueCat** : projet → ajouter les apps iOS/Android → mapper les produits →
   créer un **entitlement « premium »** + une **offering** « default » contenant
   les 3 packages.

## 2. Installer le SDK (dans le dev build)
```bash
npx expo install react-native-purchases
```
Ajouter la clé API RevenueCat (publique, par plateforme) en variable d'env
`EXPO_PUBLIC_RC_IOS` / `EXPO_PUBLIC_RC_ANDROID`.

## 3. Initialiser (dans app/_layout.tsx, après le montage)
```ts
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

Purchases.configure({
  apiKey: Platform.select({
    ios: process.env.EXPO_PUBLIC_RC_IOS!,
    android: process.env.EXPO_PUBLIC_RC_ANDROID!,
  })!,
  appUserID: userId, // l'id Supabase de l'utilisateur (pour relier au webhook)
});
```

## 4. Remplacer le corps de `lib/purchases.ts`
- `purchase(plan)` → `Purchases.getOfferings()` puis `Purchases.purchasePackage(pkg)`.
- `restore()` → `Purchases.restorePurchases()`.
- Vérifier `customerInfo.entitlements.active['premium']`.

## 5. Webhook → Supabase (source de vérité)
- RevenueCat → **Webhook** vers une **Edge Function Supabase** qui met à jour
  `profiles.is_premium` avec la clé **service_role** (jamais dans l'app).
- ⚠️ **SUPPRIMER** la fonction de dev `set_premium` (migration 0003) : en prod,
  seul le webhook doit pouvoir changer `is_premium`.
- Retirer aussi le toggle « Premium (démo) » du profil (déjà masqué hors `__DEV__`).

## 6. Tester
- Dev build + comptes **sandbox** (TestFlight / testeurs internes Play).
- Acheter, restaurer, vérifier le déblocage des unités premium et `is_premium` en base.

## Récap des points à NE PAS oublier avant publication
- [ ] Produits créés (App Store + Play) et mappés dans RevenueCat
- [ ] `react-native-purchases` installé + `Purchases.configure` avec `appUserID = userId`
- [ ] `lib/purchases.ts` branché sur le vrai SDK
- [ ] Webhook RevenueCat → Edge Function → `is_premium`
- [ ] Fonction de dev `set_premium` **supprimée**
- [ ] Prix réels confirmés (CAD) + essai gratuit configuré
