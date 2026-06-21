/**
 * <Confetti> — pluie de confettis dorés discrète pour les célébrations
 * (fin de leçon / niveau, brief §5). 100% Reanimated, aucune dépendance externe.
 * À poser en overlay absolu, pointerEvents="none".
 */
import { useEffect, useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const PALETTE = ['#C99A3F', '#E0B85C', '#FFFDF7', '#EDE3D6'];

interface ConfettiProps {
  count?: number;
}

export function Confetti({ count = 18 }: ConfettiProps) {
  const { width, height } = useWindowDimensions();
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {Array.from({ length: count }).map((_, i) => (
        <ConfettiPiece key={i} index={i} width={width} height={height} />
      ))}
    </View>
  );
}

function ConfettiPiece({ index, width, height }: { index: number; width: number; height: number }) {
  const progress = useSharedValue(0);

  const cfg = useMemo(() => {
    const startX = width / 2 + (Math.random() - 0.5) * 120;
    const driftX = (Math.random() - 0.5) * width * 0.7;
    const delay = Math.random() * 350;
    const duration = 1500 + Math.random() * 1100;
    const rotate = (Math.random() - 0.5) * 900;
    const size = 7 + Math.random() * 6;
    const color = PALETTE[index % PALETTE.length];
    const isCircle = Math.random() > 0.5;
    return { startX, driftX, delay, duration, rotate, size, color, isCircle };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    progress.value = withDelay(
      cfg.delay,
      withTiming(1, { duration: cfg.duration, easing: Easing.out(Easing.quad) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: cfg.startX + cfg.driftX * progress.value },
      { translateY: -30 + progress.value * (height + 60) },
      { rotate: `${cfg.rotate * progress.value}deg` },
    ],
    opacity: progress.value < 0.85 ? 1 : 1 - (progress.value - 0.85) / 0.15,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          width: cfg.size,
          height: cfg.size,
          backgroundColor: cfg.color,
          borderRadius: cfg.isCircle ? cfg.size / 2 : 2,
        },
        style,
      ]}
    />
  );
}
