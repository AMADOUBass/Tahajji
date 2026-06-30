/**
 * <Skeleton> — placeholder de chargement avec un léger « battement » (pulse).
 * <SkeletonRows> — quelques lignes façon liste, pour les écrans de données.
 */
import { useEffect } from 'react';
import { View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { radius as theme, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

export function Skeleton({
  width = '100%',
  height = 16,
  radius = theme.sm,
  style,
}: {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const pulse = useSharedValue(0.4);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(0.9, { duration: 800, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [pulse]);

  const anim = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return <Animated.View style={[{ width, height, borderRadius: radius, backgroundColor: colors.locked }, anim, style]} />;
}

/** Lignes de liste (icône + 2 lignes de texte) pour les écrans de contenu. */
export function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <View style={{ gap: spacing.lg, marginTop: spacing.lg }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Skeleton width={46} height={46} radius={12} />
          <View style={{ flex: 1, gap: spacing.sm }}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="40%" height={11} />
          </View>
        </View>
      ))}
    </View>
  );
}
