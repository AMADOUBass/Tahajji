import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText, Screen, SkeletonRows } from '@/components/ui';
import { useStories } from '@/lib/queries';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import type { Story } from '@/types/models';

const CATEGORIES: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  prophetes: { label: 'Prophètes', icon: 'people-outline' },
  femmes: { label: 'Femmes de l’islam', icon: 'flower-outline' },
  compagnons: { label: 'Compagnons', icon: 'people-circle-outline' },
  histoire: { label: 'Histoire de l’islam', icon: 'time-outline' },
  valeurs: { label: 'Valeurs', icon: 'heart-outline' },
};

export default function StoriesScreen() {
  const { colors } = useTheme();
  const { data: stories, isLoading, isError, isFetching, refetch } = useStories();

  // Regroupe par catégorie en gardant l'ordre (déjà trié par position).
  const groups = useMemo(() => {
    const map = new Map<string, Story[]>();
    for (const s of stories ?? []) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return [...map.entries()];
  }, [stories]);

  return (
    <Screen scroll onRefresh={refetch} refreshing={isFetching && !isLoading} contentStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl }}>
      <AppText variant="h2" style={{ marginTop: spacing.sm }}>Histoires</AppText>
      <AppText variant="body" tone="secondary" style={{ marginTop: spacing.xs }}>
        Les récits des prophètes et de l’islam, pour apprendre en s’inspirant.
      </AppText>

      {isLoading ? (
        <SkeletonRows count={6} />
      ) : isError ? (
        <View style={{ alignItems: 'center', gap: spacing.md, marginTop: spacing.xxl }}>
          <Ionicons name="cloud-offline-outline" size={40} color={colors.textSecondary} />
          <AppText tone="secondary" align="center">Connexion impossible.{'\n'}Vérifie ta connexion internet.</AppText>
          <Pressable
            onPress={() => refetch()}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primaryLight, borderRadius: radius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.xl }}
          >
            <Ionicons name="refresh" size={18} color={colors.primary} />
            <AppText variant="bodyStrong" color={colors.primary}>Réessayer</AppText>
          </Pressable>
        </View>
      ) : groups.length === 0 ? (
        <AppText tone="secondary" align="center" style={{ marginTop: spacing.xxl }}>Bientôt des histoires ici.</AppText>
      ) : (
        groups.map(([cat, items]) => (
          <View key={cat} style={{ marginTop: spacing.xl }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md }}>
              <Ionicons name={CATEGORIES[cat]?.icon ?? 'book-outline'} size={18} color={colors.primary} />
              <AppText variant="title">{CATEGORIES[cat]?.label ?? cat}</AppText>
            </View>
            {items.map((s, i) => (
              <StoryRow key={s.id} story={s} index={i} />
            ))}
          </View>
        ))
      )}
    </Screen>
  );
}

function StoryRow({ story, index }: { story: Story; index: number }) {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 50).springify().damping(16)}>
      <Pressable
        onPress={() => router.push({ pathname: '/story/[id]', params: { id: String(story.id) } })}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: spacing.md,
          marginBottom: spacing.sm,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={(story.icon as keyof typeof Ionicons.glyphMap) ?? 'book-outline'} size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="title" numberOfLines={2}>{story.title}</AppText>
          {story.summary ? (
            <AppText variant="caption" tone="secondary" numberOfLines={2} style={{ marginTop: 2 }}>{story.summary}</AppText>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </Pressable>
    </Animated.View>
  );
}
