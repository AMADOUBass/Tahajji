/**
 * <Button> — bouton tactile cohérent avec le thème.
 * Variantes : primary (espresso), gold (récompense/CTA), secondary (contour),
 * ghost (texte seul), success. Icône Ionicons optionnelle + léger « scale » au tap.
 */
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/ui/Text';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'gold' | 'secondary' | 'ghost' | 'success';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  fullWidth = true,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const bg: Record<ButtonVariant, string> = {
    primary: colors.primary,
    gold: colors.gold,
    success: colors.success,
    secondary: 'transparent',
    ghost: 'transparent',
  };
  const fg: Record<ButtonVariant, string> = {
    primary: colors.onPrimary,
    gold: '#2E2118',
    success: '#FFFFFF',
    secondary: colors.primary,
    ghost: colors.textSecondary,
  };
  const borderColor = variant === 'secondary' ? colors.border : 'transparent';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={() => {
        scale.value = withTiming(0.96, { duration: 90 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 130 });
      }}
      style={[
        styles.base,
        {
          backgroundColor: bg[variant],
          borderColor,
          borderWidth: variant === 'secondary' ? 1.5 : 0,
          opacity: disabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          paddingHorizontal: variant === 'ghost' ? spacing.md : spacing.xl,
        },
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg[variant]} />
      ) : (
        <View style={styles.content}>
          {icon ? <Ionicons name={icon} size={20} color={fg[variant]} /> : null}
          <AppText variant="button" color={fg[variant]}>
            {label}
          </AppText>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
