import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppText, ArabicText, ProgressBar, Screen } from '@/components/ui';
import { playAudioUrl } from '@/lib/audio';
import { mockSurahs } from '@/lib/mock';
import { useVerses } from '@/lib/queries';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import type { Verse } from '@/types/models';

export default function SurahScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahId = Number(id);
  const router = useRouter();
  const { colors } = useTheme();

  const surah = mockSurahs.find((s) => s.id === surahId);
  const { data: verses, isLoading } = useVerses(surahId);

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
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <AppText variant="title">{surah?.nameFr ?? 'Sourate'}</AppText>
          <AppText variant="caption" tone="secondary">{surah ? `${surah.verseCount} versets` : ''}</AppText>
        </View>
        <Ionicons name="list" size={22} color={colors.textSecondary} />
      </View>

      <Screen scroll edges={[]} contentStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120 }}>
        {/* Ornement basmala */}
        <View style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
          <ArabicText size="title" color={colors.gold} align="center">۞</ArabicText>
        </View>

        {isLoading
          ? <AppText tone="secondary" align="center">Chargement…</AppText>
          : verses!.map((v, i) => <VerseRow key={v.id} verse={v} last={i === verses!.length - 1} />)}
      </Screen>

      {/* Lecteur audio */}
      <View
        style={{
          position: 'absolute',
          left: spacing.lg,
          right: spacing.lg,
          bottom: spacing.xl,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          backgroundColor: colors.primaryContainer,
          borderRadius: radius.lg,
          padding: spacing.md,
        }}
      >
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="play" size={20} color="#2E2118" />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="label" color={colors.onPrimaryContainer}>Récitation · verset 1</AppText>
          <ProgressBar value={0.25} height={4} trackColor="rgba(255,255,255,0.2)" style={{ marginTop: spacing.sm }} />
        </View>
        <AppText variant="caption" color="rgba(255,253,247,0.7)">0:14</AppText>
      </View>
    </Screen>
  );
}

function VerseRow({ verse, last }: { verse: Verse; last: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={{ paddingVertical: spacing.lg, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.line }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
        <View style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
          <AppText variant="caption" color={colors.gold}>{verse.number}</AppText>
        </View>
        <Pressable onPress={() => playAudioUrl(verse.audioUrl)} hitSlop={8}>
          <Ionicons name="volume-medium-outline" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>
      <ArabicText size="body" align="right" style={{ lineHeight: 60 }}>{verse.arabicText}</ArabicText>
      {verse.translationFr ? (
        <AppText variant="caption" tone="secondary" style={{ marginTop: spacing.sm, lineHeight: 20 }}>
          {verse.translationFr}
        </AppText>
      ) : null}
    </View>
  );
}
