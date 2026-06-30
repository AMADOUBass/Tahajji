import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText, ArabicText, Button, Card, ProgressBar, Screen } from '@/components/ui';
import { playAudioUrl, vowelVariants } from '@/lib/audio';
import { hapticLight } from '@/lib/haptics';
import { useLessonItems } from '@/lib/queries';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = Number(id);
  const router = useRouter();
  const { colors } = useTheme();

  const { data: items, isLoading } = useLessonItems(lessonId);
  const [index, setIndex] = useState(0);

  // Anti-spam : on ignore les appuis trop rapprochés (sinon les sons s'empilent).
  const lastPlayRef = useRef(0);
  const onListen = (url: string | null | undefined) => {
    const now = Date.now();
    if (now - lastPlayRef.current < 700) return;
    lastPlayRef.current = now;
    hapticLight();
    playAudioUrl(url);
  };

  if (isLoading || !items) {
    return (
      <Screen contentStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <AppText tone="secondary">Chargement…</AppText>
      </Screen>
    );
  }

  // Garde-fou : leçon sans items (mock partiel) → on file directement au quiz.
  const total = items.length || 1;
  const item = items[index];
  const variants = item ? vowelVariants(item.arabicText) : [];

  const goNext = () => {
    hapticLight();
    if (index < items.length - 1) {
      setIndex((i) => i + 1);
    } else {
      router.replace({ pathname: '/quiz/[lessonId]', params: { lessonId: String(lessonId) } });
    }
  };
  const goPrev = () => setIndex((i) => Math.max(0, i - 1));

  return (
    <Screen contentStyle={{ flex: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
      {/* Barre de progression de la leçon */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm }}>
        <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Fermer">
          <Ionicons name="close" size={24} color={colors.textSecondary} />
        </Pressable>
        <ProgressBar value={(index + 1) / total} style={{ flex: 1 }} />
        <AppText variant="label" tone="secondary">{index + 1}/{total}</AppText>
      </View>

      {item ? (
        <View style={{ flex: 1 }}>
          <AppText variant="overline" tone="gold" align="center" style={{ marginTop: spacing.lg }}>
            {item.itemType === 'letter' ? 'Nouvelle lettre' : item.itemType === 'word' ? 'Nouveau mot' : 'Verset'}
          </AppText>

          {/* Carte vedette (ré-anime à chaque nouvel item) */}
          <Animated.View key={index} entering={FadeIn.duration(350)}>
            <Card style={{ marginTop: spacing.lg, alignItems: 'center', paddingVertical: spacing.xl }}>
              <ArabicText size="hero" color={colors.primary}>{item.arabicText}</ArabicText>
              {item.transliteration ? (
                <AppText variant="h3" style={{ marginTop: spacing.sm }}>{item.transliteration}</AppText>
              ) : null}
              {item.translationFr ? (
                <AppText variant="body" tone="secondary" align="center" style={{ marginTop: spacing.xs }}>
                  {item.translationFr}
                </AppText>
              ) : null}
            </Card>
          </Animated.View>

          {/* Variantes vocalisées */}
          {item.itemType === 'letter' ? (
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
              {variants.map((v) => (
                <Card key={v.translit} style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.md }}>
                  <ArabicText size="title" align="center">{v.ar}</ArabicText>
                  <AppText variant="label" tone="secondary" style={{ marginTop: spacing.xs }}>{v.translit}</AppText>
                </Card>
              ))}
            </View>
          ) : null}

          {/* Audio */}
          <Button
            label="Écouter"
            icon="volume-high"
            disabled={!item.audioUrl}
            onPress={() => onListen(item.audioUrl)}
            style={{ marginTop: spacing.lg }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: spacing.sm }}>
            <Ionicons name={item.audioUrl ? 'repeat' : 'time-outline'} size={14} color={colors.textSecondary} />
            <AppText variant="caption" tone="secondary">
              {item.audioUrl ? 'Répète à voix haute après l’écoute' : 'Audio bientôt disponible'}
            </AppText>
          </View>
        </View>
      ) : null}

      {/* Navigation */}
      <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
        <Button label="Précédent" variant="secondary" disabled={index === 0} onPress={goPrev} style={{ flex: 1 }} />
        <Button
          label={index < items.length - 1 ? 'Suivant' : 'Au quiz'}
          variant="gold"
          onPress={goNext}
          style={{ flex: 1.4, borderRadius: radius.md }}
        />
      </View>
    </Screen>
  );
}
