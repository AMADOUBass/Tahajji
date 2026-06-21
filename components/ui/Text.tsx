/**
 * <AppText> — texte d'interface (français). Centralise police + tailles + couleur
 * de thème pour ne jamais réécrire `fontFamily`/hex dans les écrans.
 * (Pour l'arabe, utiliser <ArabicText> à la place.)
 */
import { type ReactNode } from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { fonts } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'body'
  | 'bodyStrong'
  | 'label'
  | 'caption'
  | 'overline'
  | 'button';

type TextTone = 'default' | 'secondary' | 'gold' | 'onPrimary' | 'success' | 'inherit';

interface AppTextProps {
  children: ReactNode;
  variant?: TextVariant;
  tone?: TextTone;
  color?: string;
  align?: TextStyle['textAlign'];
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}

const VARIANTS: Record<TextVariant, TextStyle> = {
  h1: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, letterSpacing: -0.5 },
  h2: { fontFamily: fonts.extrabold, fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
  h3: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26 },
  title: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  overline: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, letterSpacing: 1.4, textTransform: 'uppercase' },
  button: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 20 },
};

export function AppText({
  children,
  variant = 'body',
  tone = 'default',
  color,
  align,
  numberOfLines,
  style,
}: AppTextProps) {
  const { colors } = useTheme();

  const toneColor: Record<TextTone, string | undefined> = {
    default: colors.text,
    secondary: colors.textSecondary,
    gold: colors.gold,
    onPrimary: colors.onPrimary,
    success: colors.success,
    inherit: undefined,
  };

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[VARIANTS[variant], { color: color ?? toneColor[tone] }, align ? { textAlign: align } : null, style]}
    >
      {children}
    </Text>
  );
}

export const textStyles = StyleSheet.create({});
