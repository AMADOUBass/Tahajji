/**
 * Thème central de Tahajji — palette « Espresso & Crème ».
 * Source : docs/UI_Design_Brief.md §3-5.
 *
 * Règle (AGENTS.md §4) : jamais de hex en dur dans les composants.
 * Toute couleur passe par `useTheme()` → `theme.colors.*`.
 */

export type ColorScheme = 'light' | 'dark';

export interface Palette {
  /** Action principale (boutons, parcours actif). Caramel en sombre. */
  primary: string;
  /** Pressé / en-têtes. */
  primaryDark: string;
  /** Fonds teintés, sélection. */
  primaryLight: string;
  /** Texte posé sur un fond `primary`. */
  onPrimary: string;
  /**
   * Fond de « conteneur » primaire (bannières, cartes mises en avant, célébration).
   * Reste FONCÉ dans les deux thèmes — contrairement à `primary` qui devient
   * caramel clair en sombre — pour que l'accent or reste lisible par-dessus.
   */
  primaryContainer: string;
  /** Texte/contenu posé sur `primaryContainer` (toujours clair). */
  onPrimaryContainer: string;
  /** Or : récompenses, premium, streak, certificats, étoiles. */
  gold: string;
  /** Fond principal de l'écran (crème parchemin). */
  bg: string;
  /** Surfaces / cartes. */
  surface: string;
  /** Texte principal. */
  text: string;
  /** Texte secondaire / translittération. */
  textSecondary: string;
  /** Bonne réponse (discret, jamais couleur de marque). */
  success: string;
  /** Mauvaise réponse, douce. */
  coral: string;
  /** Avertissement. */
  amber: string;
  /** Flamme de streak. */
  flame: string;
  /** Bordure de carte. */
  border: string;
  /** Filet / séparateur fin. */
  line: string;
  /** Fond d'une leçon verrouillée. */
  locked: string;
  /** Texte sur élément verrouillé. */
  lockedInk: string;
}

const light: Palette = {
  primary: '#4A3526',
  primaryDark: '#2E2118',
  primaryLight: '#EDE3D6',
  onPrimary: '#FFFDF7',
  primaryContainer: '#4A3526',
  onPrimaryContainer: '#FFFDF7',
  gold: '#C99A3F',
  bg: '#F8F2E8',
  surface: '#FFFDF7',
  text: '#2E2118',
  textSecondary: '#7A6A58',
  success: '#2E9E6B',
  coral: '#D9654B',
  amber: '#E0A33E',
  flame: '#E8843C',
  border: 'rgba(74,53,38,0.12)',
  line: 'rgba(74,53,38,0.08)',
  locked: '#DDD3C3',
  lockedInk: '#B4A691',
};

const dark: Palette = {
  // En sombre, le brun primaire serait invisible : on passe au caramel clair.
  primary: '#C9A36E',
  primaryDark: '#C9A36E',
  primaryLight: '#33271B',
  onPrimary: '#241C14',
  // Conteneur foncé en sombre : l'or reste lisible par-dessus.
  primaryContainer: '#2A2017',
  onPrimaryContainer: '#ECE3D5',
  gold: '#E0B85C',
  bg: '#1A140E',
  surface: '#241C14',
  text: '#ECE3D5',
  textSecondary: '#A89880',
  success: '#3DB57E',
  coral: '#E07B62',
  amber: '#E0A33E',
  flame: '#E8843C',
  border: 'rgba(236,227,213,0.13)',
  line: 'rgba(236,227,213,0.07)',
  locked: '#2A2117',
  lockedInk: '#6B5C49',
};

export const palettes: Record<ColorScheme, Palette> = { light, dark };

/** Espacements (échelle 4px). */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Rayons d'arrondi (brief §5 : cartes ~16, boutons ~12). */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/**
 * Familles de police (clés enregistrées dans `useFonts`, cf. lib/fonts.ts).
 * - UI française : Plus Jakarta Sans.
 * - Arabe coranique (le héros) : Amiri Quran — via <ArabicText> uniquement.
 */
export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
  arabic: 'AmiriQuran_400Regular',
} as const;

export interface Theme {
  scheme: ColorScheme;
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  fonts: typeof fonts;
}

export function buildTheme(scheme: ColorScheme): Theme {
  return { scheme, colors: palettes[scheme], spacing, radius, fonts };
}
