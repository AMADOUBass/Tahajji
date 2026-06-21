import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText, ArabicText, ProgressBar, Screen } from '@/components/ui';
import { useSurahs } from '@/lib/queries';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import type { Surah } from '@/types/models';

export default function QuranScreen() {
  const { colors } = useTheme();
  const { data: surahs, isLoading } = useSurahs();

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

      {/* Recherche (visuelle) */}
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
          paddingVertical: spacing.md,
          marginTop: spacing.md,
        }}
      >
        <Ionicons name="search" size={19} color={colors.textSecondary} />
        <AppText variant="body" tone="secondary">Rechercher une sourate</AppText>
      </View>

      {/* Reprendre */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          backgroundColor: colors.primaryContainer,
          borderRadius: radius.lg,
          padding: spacing.lg,
          marginTop: spacing.lg,
        }}
      >
        <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: 'rgba(201,154,63,0.25)', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="bookmark" size={22} color={colors.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="overline" tone="gold">Reprendre</AppText>
          <AppText variant="title" color={colors.onPrimaryContainer} style={{ marginTop: 2 }}>Al-Fatiha · verset 5</AppText>
          <ProgressBar value={0.62} height={5} trackColor="rgba(255,255,255,0.18)" style={{ marginTop: spacing.sm }} />
        </View>
      </View>

      {/* Liste des sourates */}
      <View style={{ marginTop: spacing.lg }}>
        {isLoading
          ? <AppText tone="secondary" align="center" style={{ marginTop: spacing.xl }}>Chargement…</AppText>
          : surahs!.map((s, i) => (
              <Animated.View key={s.id} entering={FadeInDown.delay(i * 50).springify().damping(16)}>
                <SurahRow surah={s} last={i === surahs!.length - 1} />
              </Animated.View>
            ))}
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
