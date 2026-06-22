import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown } from 'react-native-reanimated';

import { AppText, ArabicText, Button, ProgressBar, Screen } from '@/components/ui';
import { playAudioUrl } from '@/lib/audio';
import { useCompleteLesson, useQuizQuestions } from '@/lib/queries';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

const XP_PER_LESSON = 50;

export default function QuizScreen() {
  const { lessonId: lessonIdParam } = useLocalSearchParams<{ lessonId: string }>();
  const lessonId = Number(lessonIdParam);
  const router = useRouter();
  const { colors } = useTheme();

  const { data: questions, isLoading } = useQuizQuestions(lessonId);
  const completeLesson = useCompleteLesson();

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [hearts, setHearts] = useState(5);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const question = questions[qIndex];
  const answered = selected !== null;
  const isCorrect = selected === question.correctAnswer;

  function onSelect(option: string) {
    if (answered) return;
    setSelected(option);
    if (option === question.correctAnswer) {
      setCorrectCount((c) => c + 1);
    } else {
      setHearts((h) => Math.max(0, h - 1));
    }
  }

  function onContinue() {
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
    completeLesson.mutate({ lessonId, stars, xpGained: XP_PER_LESSON });
    const accuracy = questions!.length ? Math.round((correctCount / questions!.length) * 100) : 100;
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
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </Pressable>
          <ProgressBar value={(qIndex + 1) / questions.length} color={colors.success} style={{ flex: 1 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="heart" size={18} color={colors.coral} />
            <AppText variant="label">{hearts}</AppText>
          </View>
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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xl }}>
          {shuffledOptions.map((option) => {
            const isAnswer = option === question.correctAnswer;
            const isPicked = option === selected;
            let borderColor = colors.border;
            let borderWidth = 1;
            if (answered && isAnswer) { borderColor = colors.success; borderWidth = 2.5; }
            else if (answered && isPicked && !isAnswer) { borderColor = colors.coral; borderWidth = 2.5; }

            return (
              <Pressable
                key={option}
                onPress={() => onSelect(option)}
                style={{
                  width: '47%',
                  flexGrow: 1,
                  backgroundColor: colors.surface,
                  borderColor,
                  borderWidth,
                  borderRadius: radius.lg,
                  paddingVertical: spacing.xl,
                  alignItems: 'center',
                  justifyContent: 'center',
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
        </View>
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
              <AppText variant="caption" tone="secondary">
                La bonne réponse : {question.correctAnswer}
              </AppText>
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
