import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText, InfoModal, ProgressBar, Screen, StatPill, type InfoRow } from '@/components/ui';
import { useLevelsWithProgress, useProfile } from '@/lib/queries';
import { fonts, radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import type { LessonWithProgress, LevelWithLessons } from '@/types/models';

// Décalage horizontal des nœuds : serpentin doux qui reste proche de la ligne centrale.
const OFFSETS = [0, -28, 28, -22, 22, -28, 28, -22];
const ROW_H = 150; // distance verticale entre les centres de deux nœuds
const NODE_AREA = 88; // hauteur de la zone du nœud (nœud centré → centre à 44)
const NODE_CY = NODE_AREA / 2;

export default function ParcoursScreen() {
  const { colors } = useTheme();
  const { data: profile } = useProfile();
  const { data: levels, isLoading } = useLevelsWithProgress();
  const [infoVisible, setInfoVisible] = useState(false);

  const statRows: InfoRow[] = [
    { icon: 'flame', color: colors.flame, label: 'Série (streak)', description: 'Le nombre de jours d\'affilée où tu apprends. Reviens chaque jour pour ne pas la perdre !' },
    { icon: 'star', color: colors.gold, label: 'XP — points d\'expérience', description: 'Gagnés en terminant des leçons et des quiz. Ils font monter ton niveau.' },
    { icon: 'heart', color: colors.coral, label: 'Cœurs (vies)', description: 'Tes essais pendant un quiz : tu en perds un à chaque mauvaise réponse.' },
    { icon: 'star', color: colors.gold, label: 'Étoiles des leçons', description: 'La note de chaque leçon, de 1 à 3 : ⭐ terminé · ⭐⭐ bien · ⭐⭐⭐ maîtrise.' },
  ];

  return (
    <Screen>
      <InfoModal visible={infoVisible} onClose={() => setInfoVisible(false)} title="Comment ça marche ?" rows={statRows} />

      {/* En-tête : série, XP, vies (tap → explication) */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: spacing.sm,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
        }}
      >
        <StatPill icon="flame" iconColor={colors.flame} value={profile?.streakCount ?? 0} onPress={() => setInfoVisible(true)} />
        <StatPill icon="star" iconColor={colors.gold} value={profile?.xp ?? 0} onPress={() => setInfoVisible(true)} />
        <StatPill icon="heart" iconColor={colors.coral} value={5} onPress={() => setInfoVisible(true)} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading
          ? <AppText tone="secondary" align="center" style={{ marginTop: spacing.xxl }}>Chargement…</AppText>
          : levels.map((level) => <LevelSection key={level.id} level={level} />)}
      </ScrollView>
    </Screen>
  );
}

function LevelSection({ level }: { level: LevelWithLessons }) {
  const { colors } = useTheme();
  const total = level.lessons.length;
  const done = level.lessons.filter((l) => l.status === 'completed').length;

  return (
    <View style={{ marginTop: spacing.xl }}>
      {/* Bannière d'unité */}
      <View
        style={{
          backgroundColor: colors.primaryContainer,
          borderRadius: radius.lg,
          padding: spacing.lg,
          gap: spacing.md,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <AppText variant="overline" tone="gold">Unité {level.position}</AppText>
            <AppText variant="title" color={colors.onPrimaryContainer} style={{ marginTop: spacing.xs }}>
              {level.title}
            </AppText>
            {level.description ? (
              <AppText variant="caption" color="rgba(255,253,247,0.7)" style={{ marginTop: 2 }}>
                {level.description}
              </AppText>
            ) : null}
          </View>
          <Ionicons name={level.isPremium ? 'lock-closed' : 'book-outline'} size={22} color={colors.onPrimaryContainer} />
        </View>
        {/* Avancement de l'unité */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <ProgressBar value={total ? done / total : 0} height={6} trackColor="rgba(255,255,255,0.18)" style={{ flex: 1 }} />
          <AppText variant="caption" color="rgba(255,253,247,0.85)">{done}/{total}</AppText>
        </View>
      </View>

      {/* Serpentin de nœuds reliés par des segments (chemin qui suit la courbe) */}
      <View style={{ marginTop: spacing.xl }}>
        {level.lessons.map((lesson, i) => (
          <Animated.View key={lesson.id} entering={FadeInDown.delay(i * 70).springify().damping(14)}>
            <LessonNode
              lesson={lesson}
              offset={OFFSETS[i % OFFSETS.length]}
              nextOffset={i < level.lessons.length - 1 ? OFFSETS[(i + 1) % OFFSETS.length] : null}
              premiumLevel={level.isPremium}
            />
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

function LessonNode({
  lesson,
  offset,
  nextOffset,
  premiumLevel,
}: {
  lesson: LessonWithProgress;
  offset: number;
  nextOffset: number | null;
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

  // Segment reliant ce nœud au suivant (suit la courbe du serpentin).
  let connector = null;
  if (nextOffset !== null) {
    const dx = nextOffset - offset;
    const len = Math.hypot(dx, ROW_H);
    const angle = (Math.atan2(ROW_H, dx) * 180) / Math.PI;
    connector = (
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: NODE_CY + ROW_H / 2 - 2,
          left: '50%',
          marginLeft: (offset + nextOffset) / 2 - len / 2,
          width: len,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.primaryLight,
          transform: [{ rotate: `${angle}deg` }],
        }}
      />
    );
  }

  return (
    <View style={{ height: ROW_H }}>
      {connector}
      <View style={{ alignItems: 'center', transform: [{ translateX: offset }] }}>
        <View style={{ height: NODE_AREA, alignItems: 'center', justifyContent: 'center' }}>
          {inProgress ? (
            <Animated.View
              pointerEvents="none"
              style={[
                { position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: colors.gold },
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

        <AppText
          variant="caption"
          align="center"
          numberOfLines={2}
          color={locked && !inProgress ? colors.lockedInk : colors.text}
          style={{ marginTop: spacing.xs, width: 116, fontFamily: fonts.semibold }}
        >
          {lesson.title}
        </AppText>
        {needsPremium ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
            <Ionicons name="diamond" size={10} color={colors.gold} />
            <AppText variant="caption" color={colors.gold} style={{ fontSize: 10 }}>Premium</AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
}
