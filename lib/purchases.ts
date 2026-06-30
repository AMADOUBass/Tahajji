/**
 * Achats Premium — couche d'abstraction.
 *
 * ⚠️ RevenueCat (`react-native-purchases`) nécessite un DEV BUILD (ne marche pas
 * dans Expo Go). Tant qu'on développe en Expo Go, on SIMULE l'achat via la
 * fonction serveur de dev `set_premium`, pour pouvoir tester tout le parcours.
 *
 * Au moment du dev build, suivre docs/revenuecat.md : installer le SDK, et
 * remplacer le corps de `purchase` / `restore` ci-dessous par les appels
 * RevenueCat. Le RESTE de l'app (paywall, déblocage) n'a PAS à changer : elle ne
 * dépend que de `usePurchases()`.
 *
 * En prod, `is_premium` sera mis à jour par le WEBHOOK RevenueCat (service_role),
 * pas par le client → la fonction de dev `set_premium` devra être SUPPRIMÉE.
 */
import { useSetPremium } from '@/lib/queries';

export type PlanId = 'monthly' | 'yearly' | 'lifetime';

// Identifiants de produits (à créer dans App Store Connect / Play Console puis
// à mapper dans RevenueCat). Gardés ici pour un seul endroit à modifier.
export const PRODUCTS: Record<PlanId, string> = {
  monthly: 'tahajji_premium_monthly',
  yearly: 'tahajji_premium_yearly',
  lifetime: 'tahajji_premium_lifetime',
};

/** Vrai uniquement en dev (Expo Go) : on simule alors l'achat. */
export const PURCHASES_SIMULATED = __DEV__;

export interface PurchasesApi {
  purchase: (plan: PlanId, onDone?: () => void) => void;
  restore: (onDone?: (restored: boolean) => void) => void;
  isProcessing: boolean;
  simulated: boolean;
}

export function usePurchases(): PurchasesApi {
  const setPremium = useSetPremium();

  const purchase: PurchasesApi['purchase'] = (_plan, onDone) => {
    // --- DEV (Expo Go) : simulation ---
    setPremium.mutate(true, { onSuccess: () => onDone?.() });

    // --- PROD (dev build) : à activer (voir docs/revenuecat.md) ---
    // const pkg = await getPackageForPlan(_plan);
    // const { customerInfo } = await Purchases.purchasePackage(pkg);
    // if (customerInfo.entitlements.active['premium']) onDone?.();
    // (le webhook RevenueCat met à jour is_premium côté serveur)
  };

  const restore: PurchasesApi['restore'] = (onDone) => {
    // DEV : rien à restaurer.
    onDone?.(false);
    // PROD : const info = await Purchases.restorePurchases();
    //        onDone?.(!!info.entitlements.active['premium']);
  };

  return { purchase, restore, isProcessing: setPremium.isPending, simulated: PURCHASES_SIMULATED };
}
