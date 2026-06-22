import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { createSessionFromUrl } from '@/lib/authRedirect';
import { appFonts } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { useAuthStore } from '@/store/auth';

// Garde le splash visible tant que les polices ne sont pas prêtes.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(appFonts);
  const theme = useTheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const initializing = useAuthStore((s) => s.initializing);
  const init = useAuthStore((s) => s.init);

  // Initialise la session Supabase une seule fois.
  useEffect(() => init(), [init]);

  // Lien de confirmation e-mail (deep link) → ouvre la session.
  const url = Linking.useURL();
  useEffect(() => {
    if (url) {
      createSessionFromUrl(url).catch(() => {
        /* lien non lié à l'auth : ignoré */
      });
    }
  }, [url]);

  const ready = (fontsLoaded || !!fontError) && !initializing;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      {/*
        Garde de route déclarative (patron expo-router) : selon `isAuthenticated`,
        seul l'un des deux groupes est monté ; expo-router redirige tout seul vers
        le groupe disponible. Aucune navigation impérative au démarrage.
      */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="lesson/[id]" />
          <Stack.Screen name="quiz/[lessonId]" />
          {/* Célébration : révélation en fondu plutôt qu'un glissé. */}
          <Stack.Screen name="level-complete/[id]" options={{ animation: 'fade', gestureEnabled: false }} />
          <Stack.Screen name="surah/[id]" />
          <Stack.Screen name="profile/edit" options={{ presentation: 'modal' }} />
          <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        </Stack.Protected>
      </Stack>
    </QueryClientProvider>
  );
}
