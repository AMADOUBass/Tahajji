import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Share, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

import { AppText, Button, Confetti, Screen } from '@/components/ui';
import { hapticError, hapticSuccess } from '@/lib/haptics';
import { useLessons } from '@/lib/queries';
import { spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

export default function LevelCompleteScreen() {
  const params = useLocalSearchParams<{ id: string; stars?: string; xp?: string; accuracy?: string; exam?: string; passed?: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const lessonId = Number(params.id);
  const stars = Number(params.stars ?? 3);
  const xp = Number(params.xp ?? 50);
  const accuracy = Number(params.accuracy ?? 100);
  const isExam = params.exam === '1';
  const passed = params.passed !== '0';
  const failed = isExam && !passed;

  // Vibration de réussite (ou d'échec) à l'arrivée sur l'écran.
  useEffect(() => {
    if (failed) hapticError();
    else hapticSuccess();
  }, [failed]);

  const { data: lessons } = useLessons();
  const lesson = lessons?.find((l) => l.id === lessonId);
  const isLastOfLevel =
    !!lesson && !lessons?.some((l) => l.levelId === lesson.levelId && l.position === lesson.position + 1);

  const onPrimary = colors.onPrimaryContainer;

  // --- Examen échoué : on invite à réessayer (l'unité reste verrouillée) ---
  if (failed) {
    return (
      <Screen background={colors.primaryContainer} contentStyle={{ flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.xl }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}>
          <Animated.View
            entering={ZoomIn.springify().damping(12)}
            style={{ width: 128, height: 128, borderRadius: 64, backgroundColor: 'rgba(217,101,75,0.18)', alignItems: 'center', justifyContent: 'center' }}
          >
            <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="refresh" size={52} color="#fff" />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(150)} style={{ alignItems: 'center', gap: spacing.lg, alignSelf: 'stretch' }}>
            <AppText variant="overline" color={colors.coral}>Examen non validé</AppText>
            <AppText variant="h2" color={onPrimary} align="center">Presque ! Réessaie</AppText>
            <AppText variant="body" color="rgba(255,253,247,0.85)" align="center">
              Il te faut au moins 70 % pour valider l’unité. Tu y es presque !
            </AppText>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)} style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg, alignSelf: 'stretch' }}>
            <StatBox value={`${accuracy}%`} label="Ton score" highlight={colors.coral} />
            <StatBox value="70%" label="Objectif" highlight={onPrimary} />
          </Animated.View>
        </View>

        <Button label="Réessayer l’examen" variant="gold" onPress={() => router.replace({ pathname: '/quiz/[lessonId]', params: { lessonId: String(lessonId) } })} />
        <Pressable style={{ marginTop: spacing.md, paddingVertical: spacing.sm }} onPress={() => router.replace('/')}>
          <AppText variant="bodyStrong" align="center" color="rgba(255,253,247,0.8)">Plus tard</AppText>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen background={colors.primaryContainer} contentStyle={{ flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.xl }}>
      <Confetti />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}>
        {/* Médaillon */}
        <Animated.View
          entering={ZoomIn.springify().damping(12)}
          style={{
            width: 128,
            height: 128,
            borderRadius: 64,
            backgroundColor: 'rgba(201,154,63,0.18)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={isExam ? 'ribbon' : 'star'} size={52} color="#fff" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(150)} style={{ alignItems: 'center', gap: spacing.lg }}>
          <AppText variant="overline" tone="gold">
            {isExam ? 'Examen réussi' : isLastOfLevel ? `Niveau ${lesson?.levelId} terminé` : 'Leçon terminée'}
          </AppText>
          <AppText variant="h2" color={onPrimary} align="center">
            {isExam ? 'Unité validée, bravo !' : isLastOfLevel ? 'Bravo, niveau bouclé !' : 'Bien joué, continue !'}
          </AppText>
        </Animated.View>

        {/* Étoiles */}
        <Animated.View entering={ZoomIn.delay(350).springify()} style={{ flexDirection: 'row', gap: spacing.sm }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Ionicons
              key={i}
              name="star"
              size={i === 1 ? 50 : 42}
              color={i < stars ? colors.gold : 'rgba(255,255,255,0.25)'}
              style={{ marginTop: i === 1 ? -8 : 0 }}
            />
          ))}
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInUp.delay(500)} style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg, alignSelf: 'stretch' }}>
          <StatBox value={`+${xp}`} label="XP gagné" highlight={colors.gold} />
          <StatBox value={`${accuracy}%`} label="Précision" highlight={onPrimary} />
          <StatBox value={`${stars}/3`} label="Étoiles" highlight={onPrimary} />
        </Animated.View>
      </View>

      <Button label="Continuer" variant="gold" onPress={() => router.replace('/')} />
      <Pressable
        style={{ marginTop: spacing.md, paddingVertical: spacing.sm }}
        onPress={() => Share.share({ message: 'J’apprends à lire le Coran, pas à pas, avec Tahajji.' }).catch(() => {})}
      >
        <AppText variant="bodyStrong" align="center" color="rgba(255,253,247,0.8)">Partager ma réussite</AppText>
      </Pressable>
    </Screen>
  );
}

function StatBox({ value, label, highlight }: { value: string; label: string; highlight: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingVertical: spacing.lg, alignItems: 'center' }}>
      <AppText variant="h3" color={highlight}>{value}</AppText>
      <AppText variant="caption" color="rgba(255,253,247,0.7)" style={{ marginTop: spacing.xs }}>{label}</AppText>
    </View>
  );
}
