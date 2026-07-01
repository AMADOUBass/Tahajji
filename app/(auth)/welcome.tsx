import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import { AppText, ArabicText, Button, Logo, Screen } from '@/components/ui';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Screen contentStyle={{ flex: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xxl }}>
        <Animated.View entering={FadeIn.duration(600)}>
          <Logo size={96} />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(200).duration(600)} style={{ alignItems: 'center', gap: spacing.xs }}>
          <AppText variant="h2" color={colors.primary}>
            Tahajji
          </AppText>
          <ArabicText size="title" align="center" color={colors.gold}>تهجّي</ArabicText>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(350).duration(600)} style={{ alignItems: 'center', gap: spacing.lg }}>
          <AppText variant="h1" align="center">
            Apprends à lire{'\n'}le Coran, depuis zéro.
          </AppText>
          <AppText variant="body" tone="secondary" align="center" style={{ maxWidth: 290 }}>
            À ton rythme, pas à pas. Aucune connaissance préalable — on commence par la toute première lettre.
          </AppText>
          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm }}>
            <Feature icon="footsteps-outline" label="Depuis zéro" />
            <Feature icon="cloud-offline-outline" label="Hors-ligne" />
            <Feature icon="book-outline" label="Coran gratuit" />
          </View>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(600)} style={{ gap: spacing.xs }}>
        <Button label="Commencer" onPress={() => router.push('/(auth)/sign-up')} />
        <Button label="J'ai déjà un compte" variant="ghost" onPress={() => router.push('/(auth)/sign-in')} />
      </Animated.View>
    </Screen>
  );
}

function Feature({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: 6, width: 86 }}>
      <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <AppText variant="caption" tone="secondary" align="center">{label}</AppText>
    </View>
  );
}
