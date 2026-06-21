/**
 * <ArabicText> — UNIQUE point d'entrée pour afficher du texte arabe (AGENTS.md §4).
 * Gère la police coranique (Amiri Quran), le sens RTL, et une hauteur de ligne
 * généreuse pour ne pas rogner les harakât (voyelles) ni le chadda/tanwîn.
 *
 * Ne JAMAIS afficher d'arabe via un <Text> brut.
 */
import { type ReactNode } from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { fonts } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

type ArabicSize = 'hero' | 'title' | 'body' | 'inline';

interface ArabicTextProps {
  children: ReactNode;
  /** Échelle d'affichage. 'hero' = lettre/mot vedette au centre d'une leçon. */
  size?: ArabicSize;
  /** Alignement. Par défaut centré pour le héros, à droite sinon (RTL). */
  align?: TextStyle['textAlign'];
  /** Surcharge de couleur (défaut : texte principal du thème). */
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

// Tailles pensées pour la lisibilité des débutants (brief §2, §4).
// lineHeight large (~1.7×) = marge pour les signes vocaliques au-dessus/dessous.
const SIZES: Record<ArabicSize, { fontSize: number; lineHeight: number }> = {
  hero: { fontSize: 88, lineHeight: 150 },
  title: { fontSize: 40, lineHeight: 70 },
  body: { fontSize: 30, lineHeight: 54 },
  inline: { fontSize: 22, lineHeight: 40 },
};

export function ArabicText({
  children,
  size = 'body',
  align,
  color,
  style,
  numberOfLines,
}: ArabicTextProps) {
  const theme = useTheme();
  const dims = SIZES[size];
  const resolvedAlign = align ?? (size === 'hero' || size === 'title' ? 'center' : 'right');

  return (
    <Text
      numberOfLines={numberOfLines}
      // RTL explicite : indépendant du sens global de l'app (I18nManager).
      style={[
        styles.base,
        {
          fontFamily: fonts.arabic,
          color: color ?? theme.colors.text,
          fontSize: dims.fontSize,
          lineHeight: dims.lineHeight,
          textAlign: resolvedAlign,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    writingDirection: 'rtl',
    // Laisse la place aux harakât ; évite tout rognage vertical sur Android.
    includeFontPadding: true,
    textAlignVertical: 'center',
  },
});
