import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, ArabicText, ProgressBar, Screen } from '@/components/ui';
import { cacheAudioBatch, cachedAudioUri, cachedCount } from '@/lib/audioCache';
import { useSurahs, useVerses } from '@/lib/queries';
import { fonts, radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import { useReadingStore } from '@/store/reading';
import type { Verse } from '@/types/models';

const fmt = (s: number) => {
  if (!s || Number.isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export default function SurahScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahId = Number(id);
  const router = useRouter();
  const { colors } = useTheme();

  const { data: surahs } = useSurahs();
  const surah = surahs?.find((s) => s.id === surahId);
  const { data: verses, isLoading, isError, refetch } = useVerses(surahId);

  const player = useAudioPlayer(undefined);
  const status = useAudioPlayerStatus(player);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const currentIndexRef = useRef<number | null>(null);
  const finishHandledRef = useRef(false);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Mémorise la dernière lecture (carte « Reprendre » du Coran).
  const setLastRead = useReadingStore((s) => s.setLastRead);
  const lastSurahId = useReadingStore((s) => s.lastSurahId);
  useEffect(() => {
    if (surah && lastSurahId !== surahId) setLastRead(surahId, surah.nameFr, 1);
  }, [surah, surahId, lastSurahId, setLastRead]);

  // Lecture même en mode silencieux (iOS).
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const playVerse = useCallback(
    (index: number) => {
      const v = verses?.[index];
      if (!v?.audioUrl) return;
      setCurrentIndex(index);
      setLastRead(surahId, surah?.nameFr ?? `Sourate ${surahId}`, v.number);
      // Fichier local s'il a été téléchargé, sinon streaming.
      player.replace({ uri: cachedAudioUri(v.audioUrl) ?? v.audioUrl });
      player.play();
    },
    [verses, player, surahId, surah, setLastRead],
  );

  // Téléchargement hors-ligne des récitations de la sourate.
  const verseUrls = useMemo(() => (verses ?? []).map((v) => v.audioUrl), [verses]);
  const [dlState, setDlState] = useState<'idle' | 'downloading' | 'done'>('idle');
  const [dlPct, setDlPct] = useState(0);
  useEffect(() => {
    const total = verseUrls.filter(Boolean).length;
    if (total > 0 && cachedCount(verseUrls) >= total) setDlState('done');
  }, [verseUrls]);

  const onDownload = async () => {
    if (dlState === 'downloading' || dlState === 'done') return;
    setDlState('downloading');
    setDlPct(0);
    await cacheAudioBatch(verseUrls, (d, t) => setDlPct(t ? Math.round((d / t) * 100) : 0));
    setDlState('done');
  };

  const togglePlay = () => {
    if (currentIndex === null) {
      playVerse(0);
      return;
    }
    if (status.playing) player.pause();
    else player.play();
  };

  // Enchaînement automatique au verset suivant (une seule fois par fin).
  useEffect(() => {
    if (!status.didJustFinish) {
      finishHandledRef.current = false;
      return;
    }
    if (finishHandledRef.current) return;
    finishHandledRef.current = true;

    const idx = currentIndexRef.current;
    if (idx === null || !verses) return;
    const next = idx + 1;
    if (next < verses.length && verses[next]?.audioUrl) playVerse(next);
    else setCurrentIndex(null);
  }, [status.didJustFinish, verses, playVerse]);

  const hasAudio = !!verses?.some((v) => v.audioUrl);
  const progress = status.duration ? status.currentTime / status.duration : 0;
  const currentNumber = currentIndex !== null && verses ? verses[currentIndex]?.number : null;

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
        <View style={{ flex: 1, alignItems: 'center' }}>
          <AppText variant="title">{surah?.nameFr ?? 'Sourate'}</AppText>
          <AppText variant="caption" tone="secondary">{surah ? `${surah.verseCount} versets` : ''}</AppText>
        </View>
        {/* Téléchargement hors-ligne */}
        {hasAudio ? (
          <Pressable onPress={onDownload} hitSlop={8} disabled={dlState !== 'idle'}>
            {dlState === 'done' ? (
              <Ionicons name="cloud-done" size={22} color={colors.success} />
            ) : dlState === 'downloading' ? (
              <AppText variant="caption" color={colors.primary}>{dlPct}%</AppText>
            ) : (
              <Ionicons name="cloud-download-outline" size={22} color={colors.textSecondary} />
            )}
          </Pressable>
        ) : (
          <View style={{ width: 22 }} />
        )}
      </View>

      <Screen scroll edges={[]} contentStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 130 }}>
        {/* Ornement basmala */}
        <View style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
          <ArabicText size="title" color={colors.gold} align="center">۞</ArabicText>
        </View>

        {isLoading ? (
          <AppText tone="secondary" align="center">Chargement…</AppText>
        ) : isError ? (
          <View style={{ alignItems: 'center', gap: spacing.md, marginTop: spacing.xl }}>
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
        ) : (
          verses!.map((v, i) => (
            <VerseRow
              key={v.id}
              verse={v}
              last={i === verses!.length - 1}
              isCurrent={currentIndex === i}
              playing={currentIndex === i && status.playing}
              onPlay={() => playVerse(i)}
            />
          ))
        )}
      </Screen>

      {/* Lecteur audio */}
      {hasAudio ? (
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
          <Pressable
            onPress={togglePlay}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name={status.playing ? 'pause' : 'play'} size={20} color="#2E2118" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <AppText variant="label" color={colors.onPrimaryContainer}>
              {currentNumber ? `Récitation · verset ${currentNumber}` : 'Écouter la sourate'}
            </AppText>
            <ProgressBar value={progress} height={4} trackColor="rgba(255,255,255,0.2)" style={{ marginTop: spacing.sm }} />
          </View>
          <AppText variant="caption" color="rgba(255,253,247,0.7)">{fmt(status.currentTime)}</AppText>
        </View>
      ) : null}
    </Screen>
  );
}

function VerseRow({
  verse,
  last,
  isCurrent,
  playing,
  onPlay,
}: {
  verse: Verse;
  last: boolean;
  isCurrent: boolean;
  playing: boolean;
  onPlay: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        paddingVertical: spacing.lg,
        paddingHorizontal: isCurrent ? spacing.md : 0,
        marginHorizontal: isCurrent ? -spacing.md : 0,
        borderRadius: isCurrent ? radius.md : 0,
        backgroundColor: isCurrent ? 'rgba(201,154,63,0.10)' : 'transparent',
        borderBottomWidth: last || isCurrent ? 0 : 1,
        borderBottomColor: colors.line,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
        <View style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
          <AppText variant="caption" color={colors.gold}>{verse.number}</AppText>
        </View>
        {/* Bouton « Écouter » bien visible */}
        <Pressable
          onPress={onPlay}
          hitSlop={8}
          disabled={!verse.audioUrl}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: isCurrent ? colors.gold : colors.primaryLight,
            borderRadius: 999,
            paddingVertical: 7,
            paddingHorizontal: 14,
            opacity: verse.audioUrl ? 1 : 0.4,
          }}
        >
          <Ionicons name={playing ? 'pause' : 'play'} size={15} color={isCurrent ? '#2E2118' : colors.primary} />
          <AppText variant="caption" color={isCurrent ? '#2E2118' : colors.primary} style={{ fontFamily: fonts.semibold }}>
            {playing ? 'En lecture' : 'Écouter'}
          </AppText>
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
