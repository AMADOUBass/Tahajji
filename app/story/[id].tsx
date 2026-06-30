import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppText, Screen } from '@/components/ui';
import { useStories } from '@/lib/queries';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const { data: stories } = useStories();
  const story = stories?.find((s) => s.id === Number(id));

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
        <AppText variant="title" numberOfLines={1} style={{ flex: 1 }}>{story?.title ?? 'Histoire'}</AppText>
      </View>

      <Screen scroll edges={[]} contentStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl }}>
        {!story ? (
          <AppText tone="secondary" style={{ marginTop: spacing.xl }}>Histoire introuvable.</AppText>
        ) : (
          <>
            {/* Illustration (icône — jamais de représentation des prophètes) */}
            <View style={{ alignItems: 'center', marginVertical: spacing.lg }}>
              <View style={{ width: 96, height: 96, borderRadius: 28, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={(story.icon as keyof typeof Ionicons.glyphMap) ?? 'book-outline'} size={44} color={colors.primary} />
              </View>
            </View>

            <AppText variant="h2" align="center">{story.title}</AppText>

            {!story.isValidated ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.sm,
                  backgroundColor: 'rgba(201,154,63,0.14)',
                  borderRadius: radius.md,
                  padding: spacing.md,
                  marginTop: spacing.lg,
                }}
              >
                <Ionicons name="information-circle-outline" size={16} color={colors.gold} />
                <AppText variant="caption" color={colors.gold} style={{ flex: 1 }}>
                  Récit en cours de validation par une autorité religieuse.
                </AppText>
              </View>
            ) : null}

            {story.content.split('\n\n').map((para, i) => (
              <AppText key={i} variant="body" style={{ marginTop: spacing.lg, lineHeight: 24 }}>
                {para.trim()}
              </AppText>
            ))}
          </>
        )}
      </Screen>
    </Screen>
  );
}
