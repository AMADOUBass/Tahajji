/**
 * <StatPill> — petite pastille « icône + valeur » (streak, XP, vies)
 * affichée dans l'en-tête du Parcours (maquette 03).
 */
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { AppText } from '@/components/ui/Text';
import { spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

interface StatPillProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: string | number;
}

export function StatPill({ icon, iconColor, value }: StatPillProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs + 2,
        backgroundColor: colors.primaryLight,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 999,
      }}
    >
      <Ionicons name={icon} size={17} color={iconColor} />
      <AppText variant="bodyStrong">{value}</AppText>
    </View>
  );
}
