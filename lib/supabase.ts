/**
 * Client Supabase (Auth + PostgreSQL + Storage).
 * Les clés viennent de variables d'environnement publiques Expo (cf. .env).
 * La session est persistée via AsyncStorage et rafraîchie automatiquement.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

import type { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
// Accepte les deux conventions de nommage (ANON_KEY ou KEY).
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Erreur explicite plutôt qu'un échec réseau obscur plus tard.
  throw new Error(
    'Variables manquantes : EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Copie .env.example vers .env et renseigne tes clés Supabase.',
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // On gère les liens (confirmation e-mail) manuellement via deep link.
    detectSessionInUrl: false,
    // PKCE : recommandé en natif (le lien renvoie un `code` à échanger).
    flowType: 'pkce',
  },
});
