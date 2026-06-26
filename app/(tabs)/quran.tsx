import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText, ArabicText, ProgressBar, Screen } from '@/components/ui';
import { useSurahs } from '@/lib/queries';
import { fonts, radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import { useReadingStore } from '@/store/reading';
import type { Surah } from '@/types/models';

export default function QuranScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: surahs, isLoading, isError, refetch } = useSurahs();
  const [query, setQuery] = useState('');

  // Carte « Reprendre » : dernière lecture mémorisée (ou démarrage Al-Fatiha).
  const { lastSurahId, lastSurahName, lastVerse } = useReadingStore();
  const hasResume = lastSurahId !== null;
  const resumeId = lastSurahId ?? 1;
  const resumeSurah = surahs?.find((s) => s.id === resumeId);
  const resumeProgress = resumeSurah ? Math.min(1, lastVerse / resumeSurah.verseCount) : 0;

  const filtered = useMemo(() => {
    if (!surahs) return [];
    const q = query.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        s.nameFr.toLowerCase().includes(q) ||
        s.nameAr.includes(q) ||
        String(s.number).includes(q),
    );
  }, [surahs, query]);

  return (
    <Screen scroll contentStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl }}>
      {/* Titre + badge gratuit */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm }}>
        <AppText variant="h2">Le Coran</AppText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs + 1,
            backgroundColor: 'rgba(46,158,107,0.14)',
            paddingVertical: spacing.xs + 2,
            paddingHorizontal: spacing.md,
            borderRadius: 999,
          }}
        >
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
          <AppText variant="caption" color={colors.success}>Gratuit</AppText>
        </View>
      </View>

      {/* Recherche fonctionnelle */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: 4,
          marginTop: spacing.md,
        }}
      >
        <Ionicons name="search" size={19} color={colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher une sourate"
          placeholderTextColor={colors.textSecondary}
          style={{ flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text, paddingVertical: spacing.md }}
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery('')} hitSlop={10}>
            <Ionicons name="close-circle" size={19} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      {/* Reprendre / Commencer (selon la dernière lecture) */}
      <Pressable
        onPress={() => router.push({ pathname: '/surah/[id]', params: { id: String(resumeId) } })}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          backgroundColor: colors.primaryContainer,
          borderRadius: radius.lg,
          padding: spacing.lg,
          marginTop: spacing.lg,
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: 'rgba(201,154,63,0.25)', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={hasResume ? 'bookmark' : 'play'} size={22} color={colors.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="overline" tone="gold">{hasResume ? 'Reprendre' : 'Commencer'}</AppText>
          <AppText variant="title" color={colors.onPrimaryContainer} style={{ marginTop: 2 }}>
            {hasResume ? `${lastSurahName} · verset ${lastVerse}` : (resumeSurah?.nameFr ?? 'Al-Fatiha')}
          </AppText>
          {hasResume ? (
            <ProgressBar value={resumeProgress} height={5} trackColor="rgba(255,255,255,0.18)" style={{ marginTop: spacing.sm }} />
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.onPrimaryContainer} />
      </Pressable>

      {/* Liste des sourates (filtrée) */}
      <View style={{ marginTop: spacing.lg }}>
        {isLoading ? (
          <AppText tone="secondary" align="center" style={{ marginTop: spacing.xl }}>Chargement…</AppText>
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
        ) : filtered.length === 0 ? (
          <AppText tone="secondary" align="center" style={{ marginTop: spacing.xl }}>
            Aucune sourate pour « {query} ».
          </AppText>
        ) : (
          filtered.map((s, i) => (
            <Animated.View key={s.id} entering={FadeInDown.delay(Math.min(i, 8) * 40).springify().damping(16)}>
              <SurahRow surah={s} last={i === filtered.length - 1} />
            </Animated.View>
          ))
        )}
      </View>
    </Screen>
  );
}

function SurahRow({ surah, last }: { surah: Surah; last: boolean }) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/surah/[id]', params: { id: String(surah.id) } })}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.line,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      {/* Numéro en losange */}
      <View style={{ width: 42, height: 42, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ position: 'absolute', width: 36, height: 36, backgroundColor: colors.primaryLight, borderRadius: 9, transform: [{ rotate: '45deg' }] }} />
        <AppText variant="label" color={colors.primary}>{surah.number}</AppText>
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="title">{surah.nameFr}</AppText>
        <AppText variant="caption" tone="secondary" style={{ marginTop: 1 }}>{surah.verseCount} versets</AppText>
      </View>
      <ArabicText size="inline" color={colors.primary}>{surah.nameAr}</ArabicText>
    </Pressable>
  );
}
