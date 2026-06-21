import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText, Screen, StatPill } from '@/components/ui';
import { useLevelsWithProgress, useProfile } from '@/lib/queries';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import type { LessonWithProgress, LevelWithLessons } from '@/types/models';

// Décalage horizontal des nœuds pour le serpentin façon Duolingo.
const OFFSETS = [0, -52, -72, -44, 12, 40, 12, -44];

export default function ParcoursScreen() {
  const { colors } = useTheme();
  const { data: profile } = useProfile();
  const { data: levels, isLoading } = useLevelsWithProgress();

  return (
    <Screen>
      {/* En-tête : série, XP, vies */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: spacing.sm,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
        }}
      >
        <StatPill icon="flame" iconColor={colors.flame} value={profile?.streakCount ?? 0} />
        <StatPill icon="star" iconColor={colors.gold} value={profile?.xp ?? 0} />
        <StatPill icon="heart" iconColor={colors.coral} value={5} />
      </View>

      <Screen scroll contentStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl }} edges={[]}>
        {isLoading
          ? <AppText tone="secondary" align="center" style={{ marginTop: spacing.xxl }}>Chargement…</AppText>
          : levels.map((level) => <LevelSection key={level.id} level={level} />)}
      </Screen>
    </Screen>
  );
}

function LevelSection({ level }: { level: LevelWithLessons }) {
  const { colors } = useTheme();

  return (
    <View style={{ marginTop: spacing.xl }}>
      {/* Bannière d'unité */}
      <View
        style={{
          backgroundColor: colors.primaryContainer,
          borderRadius: radius.lg,
          padding: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1 }}>
          <AppText variant="overline" tone="gold">Unité {level.position}</AppText>
          <AppText variant="title" color={colors.onPrimaryContainer} style={{ marginTop: spacing.xs }}>
            {level.title}
          </AppText>
        </View>
        <Ionicons name={level.isPremium ? 'lock-closed' : 'book-outline'} size={22} color={colors.onPrimaryContainer} />
      </View>

      {/* Serpentin de nœuds */}
      <View style={{ alignItems: 'center', gap: spacing.xl, marginTop: spacing.xl }}>
        {level.lessons.map((lesson, i) => (
          <Animated.View key={lesson.id} entering={FadeInDown.delay(i * 70).springify().damping(14)}>
            <LessonNode lesson={lesson} offset={OFFSETS[i % OFFSETS.length]} premiumLevel={level.isPremium} />
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

function LessonNode({
  lesson,
  offset,
  premiumLevel,
}: {
  lesson: LessonWithProgress;
  offset: number;
  premiumLevel: boolean;
}) {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: profile } = useProfile();

  const locked = lesson.status === 'locked';
  const inProgress = lesson.status === 'in_progress';
  const completed = lesson.status === 'completed';

  // Halo pulsant pour le nœud en cours (façon « nodepulse » de la maquette).
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (inProgress) {
      pulse.value = withRepeat(withTiming(1, { duration: 1100 }), -1, false);
    }
  }, [inProgress, pulse]);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.35 }],
    opacity: 0.45 * (1 - pulse.value),
  }));

  const needsPremium = (lesson.isPremium || premiumLevel) && !profile?.isPremium;

  const onPress = () => {
    if (needsPremium) {
      router.push('/paywall');
      return;
    }
    if (!locked) {
      router.push({ pathname: '/lesson/[id]', params: { id: String(lesson.id) } });
    }
  };

  const size = inProgress ? 86 : completed ? 70 : 64;
  const bg = completed ? colors.primary : inProgress ? colors.gold : colors.locked;
  const shadow = completed ? colors.primaryDark : inProgress ? '#A87F2E' : 'rgba(0,0,0,0.08)';

  let icon: keyof typeof Ionicons.glyphMap = 'lock-closed';
  let iconColor = colors.lockedInk;
  if (completed) { icon = 'checkmark'; iconColor = colors.onPrimary; }
  else if (inProgress) { icon = 'star'; iconColor = '#FFFFFF'; }
  else if (needsPremium) { icon = 'lock-closed'; iconColor = colors.lockedInk; }

  return (
    <View style={{ transform: [{ translateX: offset }], alignItems: 'center' }}>
      {inProgress ? (
        <View
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1.5,
            borderColor: colors.gold,
            borderRadius: radius.md,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            marginBottom: spacing.sm,
          }}
        >
          <AppText variant="overline" color={colors.primary}>Commencer</AppText>
        </View>
      ) : null}

      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {inProgress ? (
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: colors.gold,
              },
              pulseStyle,
            ]}
          />
        ) : null}
        <Pressable
          onPress={onPress}
          style={({ pressed }) => ({
            width: size,
            height: size,
            borderRadius: lesson.lessonType === 'exam' ? radius.lg : size / 2,
            backgroundColor: bg,
            alignItems: 'center',
            justifyContent: 'center',
            // « ombre » solide façon Duolingo
            borderBottomWidth: 6,
            borderBottomColor: shadow,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Ionicons name={icon} size={size * 0.42} color={iconColor} />
        </Pressable>
      </View>

      {completed && lesson.stars > 0 ? (
        <View style={{ flexDirection: 'row', gap: 2, marginTop: spacing.xs }}>
          {Array.from({ length: 3 }).map((_, s) => (
            <Ionicons key={s} name="star" size={12} color={s < lesson.stars ? colors.gold : colors.locked} />
          ))}
        </View>
      ) : null}
    </View>
  );
}
