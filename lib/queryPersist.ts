/**
 * Cache hors-ligne — persistance du cache React Query dans SQLite.
 *
 * On réutilise `expo-sqlite/kv-store` (API compatible AsyncStorage, mais adossée
 * à SQLite → PAS de limite de taille comme AsyncStorage sur Android). Tout le
 * contenu déjà chargé en ligne (parcours, leçons, quiz, sourates, versets) reste
 * lisible sans réseau : au démarrage, le cache est restauré depuis le disque.
 *
 * Source de vérité = serveur. À chaque retour du réseau, React Query rafraîchit
 * en arrière-plan ; tant qu'on est hors-ligne, les données en cache s'affichent.
 */
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import Storage from 'expo-sqlite/kv-store';

// 14 jours : durée de conservation hors-ligne du contenu.
export const OFFLINE_MAX_AGE = 1000 * 60 * 60 * 24 * 14;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      // gcTime ≥ maxAge sinon les requêtes ne sont pas restaurées au démarrage.
      gcTime: OFFLINE_MAX_AGE,
      retry: 2,
      refetchOnReconnect: true,
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: {
    getItem: (key) => Storage.getItem(key),
    setItem: (key, value) => Storage.setItem(key, value),
    removeItem: (key) => Storage.removeItem(key),
  },
  key: 'TAHAJJI_RQ_CACHE',
  throttleTime: 1000,
});
