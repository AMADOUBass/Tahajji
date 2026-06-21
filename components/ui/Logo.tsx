/**
 * <Logo> — marque Tahajji : deux carrés arrondis superposés (dont un pivoté 45°)
 * en or, avec un point central. Reproduit le logo des maquettes sans SVG.
 */
import { View } from 'react-native';

import { useTheme } from '@/lib/useTheme';

interface LogoProps {
  size?: number;
}

export function Logo({ size = 70 }: LogoProps) {
  const { colors } = useTheme();
  const border = Math.max(2.5, size * 0.043);
  const dot = size * 0.23;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderWidth: border,
          borderColor: colors.gold,
          borderRadius: size * 0.18,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderWidth: border,
          borderColor: colors.gold,
          borderRadius: size * 0.18,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: colors.primary }} />
    </View>
  );
}
