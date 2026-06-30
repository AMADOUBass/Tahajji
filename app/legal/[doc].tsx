import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppText, Screen } from '@/components/ui';
import { LEGAL } from '@/lib/legalContent';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

export default function LegalScreen() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const content = LEGAL[doc as keyof typeof LEGAL];

  if (!content) {
    return (
      <Screen contentStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <AppText tone="secondary">Page introuvable.</AppText>
      </Screen>
    );
  }

  return (
    <Screen contentStyle={{ flex: 1 }}>
      {/* En-tête */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.line,
        }}
      >
        <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Retour">
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="title" style={{ flex: 1 }}>{content.title}</AppText>
      </View>

      <Screen scroll edges={[]} contentStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl }}>
        <AppText variant="caption" tone="secondary" style={{ marginTop: spacing.md }}>
          Dernière mise à jour : {content.updated}
        </AppText>

        {content.disclaimer ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
              backgroundColor: 'rgba(201,154,63,0.14)',
              borderRadius: radius.md,
              padding: spacing.md,
              marginTop: spacing.md,
            }}
          >
            <Ionicons name="information-circle-outline" size={18} color={colors.gold} />
            <AppText variant="caption" color={colors.gold} style={{ flex: 1 }}>{content.disclaimer}</AppText>
          </View>
        ) : null}

        {content.sections.map((s, i) => (
          <View key={i} style={{ marginTop: spacing.xl }}>
            {s.heading ? (
              <AppText variant="bodyStrong" style={{ marginBottom: spacing.sm }}>{s.heading}</AppText>
            ) : null}
            <AppText variant="body" tone="secondary" style={{ lineHeight: 22 }}>{s.body}</AppText>
          </View>
        ))}
      </Screen>
    </Screen>
  );
}
