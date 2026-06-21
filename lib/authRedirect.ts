/**
 * Gestion du lien de confirmation e-mail (et, plus tard, OAuth) via deep link.
 *
 * Flux : signUp(emailRedirectTo) → Supabase envoie un e-mail → l'utilisateur clique
 * → l'app s'ouvre sur `authRedirectTo` avec un `code` (PKCE) → on l'échange contre
 * une session. Le layout racine écoute l'URL entrante et appelle createSessionFromUrl.
 */
import * as Linking from 'expo-linking';

import { supabase } from '@/lib/supabase';

// En build : tahajji://auth-callback. En Expo Go : exp://<host>/--/auth-callback.
export const authRedirectTo = Linking.createURL('auth-callback');

function parseParams(url: string): Record<string, string> {
  const out: Record<string, string> = {};
  const sep = url.search(/[?#]/);
  if (sep === -1) return out;
  for (const pair of url.slice(sep + 1).split('&')) {
    const [k, v] = pair.split('=');
    if (k) out[decodeURIComponent(k)] = decodeURIComponent(v ?? '');
  }
  return out;
}

/** Ouvre une session à partir d'une URL de redirection auth (no-op si non pertinente). */
export async function createSessionFromUrl(url: string): Promise<void> {
  const params = parseParams(url);
  if (params.error_description) throw new Error(params.error_description);

  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (error) throw error;
    return;
  }
  if (params.access_token && params.refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });
    if (error) throw error;
  }
}
