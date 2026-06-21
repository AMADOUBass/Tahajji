/**
 * Hook d'accès au thème résolu.
 * Combine la préférence utilisateur (store) avec le mode système (OS).
 */
import { useColorScheme } from 'react-native';

import { useThemeStore } from '@/store/theme';
import { buildTheme, type ColorScheme, type Theme } from '@/lib/theme';

export function useColorSchemeResolved(): ColorScheme {
  const system = useColorScheme();
  const preference = useThemeStore((s) => s.preference);
  if (preference === 'system') {
    return system === 'dark' ? 'dark' : 'light';
  }
  return preference;
}

export function useTheme(): Theme {
  return buildTheme(useColorSchemeResolved());
}
