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
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

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
    // L'app mobile n'utilise pas les redirections d'URL pour la session.
    detectSessionInUrl: false,
  },
});
