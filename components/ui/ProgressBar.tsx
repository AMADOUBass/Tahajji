/**
 * <ProgressBar> — barre de progression fine (brief §5). Couleur or par défaut.
 */
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/lib/useTheme';

interface ProgressBarProps {
  /** Avancement de 0 à 1. */
  value: number;
  color?: string;
  trackColor?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({ value, color, trackColor, height = 11, style }: ProgressBarProps) {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View
      style={[
        { height, borderRadius: 999, backgroundColor: trackColor ?? colors.primaryLight, overflow: 'hidden' },
        style,
      ]}
    >
      <View style={{ width: `${clamped * 100}%`, height: '100%', borderRadius: 999, backgroundColor: color ?? colors.gold }} />
    </View>
  );
}
