import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { AppText, ArabicText, Button, ProgressBar, Screen } from '@/components/ui';
import { playAudioUrl } from '@/lib/audio';
import { hapticError, hapticSuccess } from '@/lib/haptics';
import { MAX_HEARTS, effectiveHearts } from '@/lib/hearts';
import { playCorrectSound, playWrongSound } from '@/lib/sounds';
import { useCompleteLesson, useConsumeHeart, useLessons, useProfile, useQuizQuestions, useRefillHearts } from '@/lib/queries';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

const XP_PER_LESSON = 50;
const PASS_THRESHOLD = 70; // % minimum pour valider un examen

export default function QuizScreen() {
  const { lessonId: lessonIdParam, review } = useLocalSearchParams<{ lessonId: string; review?: string }>();
  const lessonId = Number(lessonIdParam);
  const isReview = review === '1';
  const router = useRouter();
  const { colors } = useTheme();

  const { data: questions, isLoading } = useQuizQuestions(lessonId);
  const { data: profile } = useProfile();
  const { data: lessons } = useLessons();
  const completeLesson = useCompleteLesson();
  const consumeHeart = useConsumeHeart();
  const refillHearts = useRefillHearts();
  const unlimited = profile?.isPremium ?? false;

  // Les cœurs ne servent qu'aux EXAMENS (les leçons d'apprentissage sont libres).
  const lesson = lessons?.find((l) => l.id === lessonId);
  const isExam = lesson?.lessonType === 'exam';
  const heartsActive = isExam && !isReview && !unlimited;

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  // Écran d'intro avant un examen (« Commencer l'examen »).
  const [started, setStarted] = useState(false);

  // Cœurs : initialisés depuis le serveur (avec recharge), décrément optimiste.
  const [heartsLeft, setHeartsLeft] = useState(MAX_HEARTS);
  const seededRef = useRef(false);
  // Verrou anti double-tap sur « Continuer » (évite de sauter une question).
  const advancingRef = useRef(false);
  // Tremblement de la grille d'options sur mauvaise réponse.
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));
  useEffect(() => {
    if (!seededRef.current && profile) {
      seededRef.current = true;
      setHeartsLeft(effectiveHearts(profile).count);
    }
  }, [profile]);

  // Mélange les réponses (positions aléatoires) — stable tant qu'on est sur la
  // même question, re-mélangé à la question suivante / à chaque nouvelle tentative.
  const shuffledOptions = useMemo(() => {
    const opts = questions?.[qIndex]?.options;
    if (!opts) return [];
    const a = [...opts];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, [questions, qIndex]);

  // Leçon sans quiz (mock partiel) : on valide directement et on célèbre.
  useEffect(() => {
    if (!isLoading && questions && questions.length === 0) {
      finish(3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, questions]);

  if (isLoading || !questions) {
    return (
      <Screen contentStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <AppText tone="secondary">Chargement…</AppText>
      </Screen>
    );
  }

  if (questions.length === 0) return null;

  // Écran d'introduction de l'examen (avant la 1re question).
  if (isExam && !isReview && !started) {
    return (
      <Screen contentStyle={{ flex: 1, paddingHorizontal: spacing.lg }}>
        <View style={{ flexDirection: 'row', paddingVertical: spacing.sm }}>
          <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Fermer">
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
          <View style={{ width: 96, height: 96, borderRadius: 28, backgroundColor: 'rgba(201,154,63,0.16)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="ribbon" size={46} color={colors.gold} />
          </View>
          <AppText variant="overline" tone="gold" style={{ marginTop: spacing.sm }}>Examen de fin d’unité</AppText>
          <AppText variant="h2" align="center">{lesson?.title ?? 'Examen'}</AppText>
          <View style={{ gap: spacing.md, alignSelf: 'stretch', marginTop: spacing.lg, paddingHorizontal: spacing.md }}>
            <ExamFact icon="help-circle-outline" color={colors.primary} text={`${questions.length} questions, mélangées sur toute l’unité`} />
            <ExamFact icon="ribbon-outline" color={colors.gold} text={`${PASS_THRESHOLD}% de bonnes réponses pour valider`} />
            {heartsActive ? <ExamFact icon="heart" color={colors.coral} text="Tes cœurs sont en jeu (−1 par erreur)" /> : null}
          </View>
        </View>
        <Button label="Commencer l’examen" variant="gold" onPress={() => setStarted(true)} style={{ marginBottom: spacing.xl }} />
      </Screen>
    );
  }

  const question = questions[qIndex];
  const answered = selected !== null;
  const isCorrect = selected === question.correctAnswer;

  function onSelect(option: string) {
    if (answered) return;
    advancingRef.current = false;
    setSelected(option);
    if (option === question.correctAnswer) {
      setCorrectCount((c) => c + 1);
      hapticSuccess();
      playCorrectSound();
    } else {
      hapticError();
      playWrongSound();
      shake.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
      if (heartsActive) {
        // Perte d'un cœur (examens uniquement) — côté serveur + décrément à l'écran.
        setHeartsLeft((h) => Math.max(0, h - 1));
        consumeHeart.mutate();
      }
    }
  }

  function onContinue() {
    if (advancingRef.current) return;
    advancingRef.current = true;
    if (qIndex < questions!.length - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
    } else {
      const finalCorrect = correctCount;
      const stars = finalCorrect >= questions!.length ? 3 : finalCorrect >= questions!.length - 1 ? 2 : 1;
      finish(stars);
    }
  }

  function finish(stars: number) {
    // Mode révision : on regagne un cœur, sans recompléter la leçon.
    if (isReview) {
      refillHearts.mutate(1, { onSuccess: () => router.replace('/') });
      return;
    }
    const accuracy = questions!.length ? Math.round((correctCount / questions!.length) * 100) : 100;

    // Examen : il faut ≥ 70 % pour valider l'unité (sinon échec, à refaire).
    if (isExam) {
      const passed = accuracy >= PASS_THRESHOLD;
      if (passed) completeLesson.mutate({ lessonId, stars });
      router.replace({
        pathname: '/level-complete/[id]',
        params: {
          id: String(lessonId),
          stars: String(passed ? stars : 0),
          xp: String(passed ? XP_PER_LESSON : 0),
          accuracy: String(accuracy),
          exam: '1',
          passed: passed ? '1' : '0',
        },
      });
      return;
    }

    completeLesson.mutate({ lessonId, stars });
    router.replace({
      pathname: '/level-complete/[id]',
      params: { id: String(lessonId), stars: String(stars), xp: String(XP_PER_LESSON), accuracy: String(accuracy) },
    });
  }

  return (
    <Screen contentStyle={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: spacing.lg }}>
        {/* En-tête : progression + vies */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm }}>
          <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Fermer">
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </Pressable>
          <ProgressBar value={(qIndex + 1) / questions.length} color={colors.success} style={{ flex: 1 }} />
          <AppText variant="label" tone="secondary">{qIndex + 1}/{questions.length}</AppText>
          {heartsActive ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="heart" size={18} color={colors.coral} />
              <AppText variant="label">{heartsLeft}</AppText>
            </View>
          ) : null}
        </View>

        {/* Énoncé (ré-anime à chaque question) */}
        <Animated.View key={qIndex} entering={FadeIn.duration(300)}>
          <AppText variant="h3" style={{ marginTop: spacing.xl }}>{question.prompt}</AppText>
        </Animated.View>

        {question.audioUrl ? (
          <Pressable
            onPress={() => playAudioUrl(question.audioUrl)}
            style={{
              alignSelf: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
              backgroundColor: colors.primaryLight,
              borderRadius: radius.md,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
              marginTop: spacing.lg,
            }}
          >
            <Ionicons name="volume-high" size={20} color={colors.primary} />
            <AppText variant="bodyStrong" color={colors.primary}>Réécouter le son</AppText>
          </Pressable>
        ) : null}

        {/* Options */}
        <Animated.View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xl }, shakeStyle]}>
          {shuffledOptions.map((option) => {
            const isAnswer = option === question.correctAnswer;
            const isPicked = option === selected;
            const dim = answered && !isAnswer && !isPicked;
            let borderColor = colors.border;
            let borderWidth = 1;
            if (answered && isAnswer) { borderColor = colors.success; borderWidth = 2.5; }
            else if (answered && isPicked && !isAnswer) { borderColor = colors.coral; borderWidth = 2.5; }

            return (
              <Pressable
                key={option}
                onPress={() => onSelect(option)}
                disabled={answered}
                accessibilityRole="button"
                style={{
                  width: '47%',
                  flexGrow: 1,
                  minHeight: 76,
                  backgroundColor: colors.surface,
                  borderColor,
                  borderWidth,
                  borderRadius: radius.lg,
                  paddingVertical: spacing.lg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: dim ? 0.45 : 1,
                }}
              >
                <ArabicText size="title" align="center">{option}</ArabicText>
                {answered && isAnswer ? (
                  <View style={badgeStyle(colors.success)}>
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  </View>
                ) : null}
                {answered && isPicked && !isAnswer ? (
                  <View style={badgeStyle(colors.coral)}>
                    <Ionicons name="close" size={14} color="#fff" />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </Animated.View>
      </View>

      {/* Panneau de feedback */}
      {answered ? (
        <Animated.View
          entering={FadeInDown.duration(260).easing(Easing.out(Easing.cubic))}
          style={{
            backgroundColor: isCorrect ? 'rgba(46,158,107,0.14)' : 'rgba(217,101,75,0.14)',
            borderTopWidth: 1,
            borderTopColor: isCorrect ? 'rgba(46,158,107,0.3)' : 'rgba(217,101,75,0.3)',
            padding: spacing.lg,
            paddingBottom: spacing.xxl,
            gap: spacing.md,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isCorrect ? colors.success : colors.coral,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={isCorrect ? 'checkmark' : 'close'} size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="title" color={isCorrect ? colors.success : colors.coral}>
                {isCorrect ? "Bravo, c'est ça !" : 'Presque ! Continue.'}
              </AppText>
              {!isCorrect ? (
                <AppText variant="caption" tone="secondary">
                  La bonne réponse : {question.correctAnswer}
                </AppText>
              ) : null}
            </View>
          </View>
          <Button
            label="Continuer"
            variant={isCorrect ? 'success' : 'primary'}
            onPress={onContinue}
          />
        </Animated.View>
      ) : null}
    </Screen>
  );
}

function ExamFact({ icon, text, color }: { icon: keyof typeof Ionicons.glyphMap; text: string; color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
      <Ionicons name={icon} size={20} color={color} />
      <AppText variant="body" style={{ flex: 1 }}>{text}</AppText>
    </View>
  );
}

function badgeStyle(bg: string) {
  return {
    position: 'absolute' as const,
    top: 9,
    right: 9,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: bg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
}
