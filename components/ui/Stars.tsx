/**
 * <Stars> — note en étoiles d'or (0 à 3) d'une leçon (brief §5).
 */
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useTheme } from '@/lib/useTheme';

interface StarsProps {
  count: number;
  total?: number;
  size?: number;
}

export function Stars({ count, total = 3, size = 16 }: StarsProps) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {Array.from({ length: total }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < count ? 'star' : 'star-outline'}
          size={size}
          color={i < count ? colors.gold : colors.lockedInk}
        />
      ))}
    </View>
  );
}
