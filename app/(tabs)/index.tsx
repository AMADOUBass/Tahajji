import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText, InfoModal, ProgressBar, Screen, Skeleton, StatPill, type InfoRow } from '@/components/ui';
import { effectiveHearts, formatCountdown } from '@/lib/hearts';
import { useLevelsWithProgress, useProfile } from '@/lib/queries';
import { fonts, radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import type { LessonWithProgress, LevelWithLessons } from '@/types/models';

// Décalage horizontal des nœuds : serpentin doux organique (façon Duolingo).
const OFFSETS = [0, -48, -68, -40, 14, 40, 12, -42];

export default function ParcoursScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: levels, isLoading, isError, isFetching, refetch } = useLevelsWithProgress();
  const [infoVisible, setInfoVisible] = useState(false);

  const hearts = effectiveHearts(profile);
  const reviewLessonId = useMemo(() => {
    for (const lvl of levels) for (const l of lvl.lessons) if (l.status === 'completed') return l.id;
    return null;
  }, [levels]);

  const handleOutOfHearts = () => {
    Alert.alert(
      'Plus de cœurs ❤️',
      reviewLessonId
        ? `Révise une leçon pour regagner un cœur, ou attends ${formatCountdown(hearts.secondsToNext)}.`
        : `Tu regagnes un cœur dans ${formatCountdown(hearts.secondsToNext)}.`,
      reviewLessonId
        ? [
            { text: 'Plus tard', style: 'cancel' },
            { text: 'Réviser', onPress: () => router.push({ pathname: '/quiz/[lessonId]', params: { lessonId: String(reviewLessonId), review: '1' } }) },
          ]
        : [{ text: 'OK' }],
    );
  };

  const statRows: InfoRow[] = [
    { icon: 'flame', color: colors.flame, label: 'Série (streak)', description: 'Le nombre de jours d\'affilée où tu apprends. Reviens chaque jour pour ne pas la perdre !' },
    { icon: 'star', color: colors.gold, label: 'XP — points d\'expérience', description: 'Gagnés en terminant des leçons et des quiz. Ils font monter ton niveau.' },
    { icon: 'heart', color: colors.coral, label: 'Cœurs (vies)', description: 'Les leçons sont libres ; les cœurs ne servent qu\'aux examens (−1 par erreur). Rechargés (1 / 10 min) ou en révisant. Illimités en Premium.' },
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
        <StatPill icon="heart" iconColor={colors.coral} value={hearts.unlimited ? '∞' : hearts.count} onPress={() => setInfoVisible(true)} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor={colors.primary} colors={[colors.primary]} />
        }
      >
        {isLoading
          ? (
            <View style={{ marginTop: spacing.xl, gap: spacing.xl }}>
              <Skeleton height={92} radius={radius.lg} />
              <View style={{ alignItems: 'center', gap: spacing.xl, marginTop: spacing.md }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} width={72} height={72} radius={36} />
                ))}
              </View>
            </View>
          )
          : isError
          ? (
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
          )
          : levels.map((level) => (
              <LevelSection
                key={level.id}
                level={level}
                heartsCount={hearts.count}
                unlimited={hearts.unlimited}
                onOutOfHearts={handleOutOfHearts}
              />
            ))}
      </ScrollView>
    </Screen>
  );
}

function LevelSection({
  level,
  heartsCount,
  unlimited,
  onOutOfHearts,
}: {
  level: LevelWithLessons;
  heartsCount: number;
  unlimited: boolean;
  onOutOfHearts: () => void;
}) {
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

      {/* Serpentin de nœuds (zigzag doux) */}
      <View style={{ alignItems: 'center', gap: spacing.xl, marginTop: spacing.xl }}>
        {level.lessons.map((lesson, i) => (
          <Animated.View key={lesson.id} entering={FadeInDown.delay(i * 70).springify().damping(14)}>
            <LessonNode
              lesson={lesson}
              offset={OFFSETS[i % OFFSETS.length]}
              premiumLevel={level.isPremium}
              heartsCount={heartsCount}
              unlimited={unlimited}
              onOutOfHearts={onOutOfHearts}
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
  premiumLevel,
  heartsCount,
  unlimited,
  onOutOfHearts,
}: {
  lesson: LessonWithProgress;
  offset: number;
  premiumLevel: boolean;
  heartsCount: number;
  unlimited: boolean;
  onOutOfHearts: () => void;
}) {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: profile } = useProfile();

  const locked = lesson.status === 'locked';
  const inProgress = lesson.status === 'in_progress';
  const completed = lesson.status === 'completed';
  const isExam = lesson.lessonType === 'exam';

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
    if (locked) return;
    // Examen : cœurs requis + accès direct au quiz (pas d'écran d'apprentissage).
    if (lesson.lessonType === 'exam') {
      if (!unlimited && heartsCount <= 0) {
        onOutOfHearts();
        return;
      }
      router.push({ pathname: '/quiz/[lessonId]', params: { lessonId: String(lesson.id) } });
      return;
    }
    router.push({ pathname: '/lesson/[id]', params: { id: String(lesson.id) } });
  };

  // L'examen est un « checkpoint » de fin d'unité → nœud plus imposant.
  const size = isExam
    ? (inProgress ? 96 : completed ? 82 : 76)
    : (inProgress ? 86 : completed ? 70 : 64);
  const bg = completed ? colors.primary : inProgress ? colors.gold : colors.locked;
  const shadow = completed ? colors.primaryDark : inProgress ? '#A87F2E' : 'rgba(0,0,0,0.08)';

  let icon: keyof typeof Ionicons.glyphMap = 'lock-closed';
  let iconColor = colors.lockedInk;
  if (completed) { icon = 'checkmark'; iconColor = colors.onPrimary; }
  else if (needsPremium) { icon = 'lock-closed'; iconColor = colors.lockedInk; }
  else if (isExam && !locked) { icon = 'ribbon'; iconColor = '#FFFFFF'; }
  else if (inProgress) { icon = 'star'; iconColor = '#FFFFFF'; }

  return (
    <View style={{ transform: [{ translateX: offset }], alignItems: 'center' }}>
      {/* Bulle « Commencer » au-dessus de l'étape active */}
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
            // « ombre » solide = effet 3D
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
        numberOfLines={1}
        color={locked && !inProgress ? colors.lockedInk : colors.text}
        style={{ marginTop: spacing.xs, width: 160, fontFamily: fonts.semibold, fontSize: 11.5 }}
      >
        {lesson.title}
      </AppText>
      {isExam ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2, backgroundColor: 'rgba(201,154,63,0.16)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.sm }}>
          <Ionicons name="ribbon" size={11} color={colors.gold} />
          <AppText variant="caption" color={colors.gold} style={{ fontSize: 10, fontFamily: fonts.semibold, letterSpacing: 0.5 }}>EXAMEN</AppText>
        </View>
      ) : null}
      {needsPremium ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
          <Ionicons name="diamond" size={10} color={colors.gold} />
          <AppText variant="caption" color={colors.gold} style={{ fontSize: 10 }}>Premium</AppText>
        </View>
      ) : null}
    </View>
  );
}
