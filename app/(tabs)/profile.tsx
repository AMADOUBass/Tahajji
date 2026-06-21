import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Switch, View } from 'react-native';

import { AppText, Card, Screen } from '@/components/ui';
import { useProfile, useProgress, useSetPremium } from '@/lib/queries';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';

export default function ProfileScreen() {
  const { colors, scheme } = useTheme();
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: progress } = useProgress();
  const setPremium = useSetPremium();
  const setPreference = useThemeStore((s) => s.setPreference);
  const signOut = useAuthStore((s) => s.signOut);

  const lessonsCompleted = (progress ?? []).filter((p) => p.status === 'completed').length;
  const displayName = profile?.displayName ?? 'Apprenant';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Screen scroll contentStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm }}>
        <AppText variant="h2">Profil</AppText>
        <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
      </View>

      {/* Identité */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.lg }}>
        <View style={{ width: 72, height: 72, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ position: 'absolute', width: 72, height: 72, backgroundColor: colors.primaryLight, borderRadius: 20 }} />
          <AppText variant="h2" color={colors.primary}>{initial}</AppText>
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="h3">{displayName}</AppText>
          <AppText variant="caption" tone="secondary" style={{ marginTop: 2 }}>Niveau débutant</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm, alignSelf: 'flex-start', backgroundColor: 'rgba(201,154,63,0.16)', paddingVertical: 4, paddingHorizontal: spacing.sm, borderRadius: 999 }}>
            <Ionicons name="star" size={12} color={colors.gold} />
            <AppText variant="caption" color={colors.gold}>Niveau {profile?.currentLevel ?? 1}</AppText>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl }}>
        <StatCard value={profile?.xp ?? 0} label="XP total" />
        <StatCard value={profile?.streakCount ?? 0} label="Série (jours)" color={colors.flame} />
        <StatCard value={lessonsCompleted} label="Leçons" />
      </View>

      {/* Premium / paywall */}
      <Pressable onPress={() => router.push('/paywall')} style={{ marginTop: spacing.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primaryContainer, borderRadius: radius.lg, padding: spacing.lg }}>
          <Ionicons name="diamond-outline" size={24} color={colors.gold} />
          <View style={{ flex: 1 }}>
            <AppText variant="title" color={colors.onPrimaryContainer}>{profile?.isPremium ? 'Premium actif' : 'Passer en Premium'}</AppText>
            <AppText variant="caption" color="rgba(255,253,247,0.7)">Apprentissage avancé & certificats</AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.onPrimaryContainer} />
        </View>
      </Pressable>

      {/* Réglages */}
      <AppText variant="title" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>Réglages</AppText>
      <Card padded={false} style={{ paddingHorizontal: spacing.lg }}>
        <SettingRow icon="moon-outline" label="Mode sombre" first>
          <Switch
            value={scheme === 'dark'}
            onValueChange={(v) => setPreference(v ? 'dark' : 'light')}
            trackColor={{ true: colors.primary, false: colors.locked }}
            thumbColor={colors.onPrimary}
          />
        </SettingRow>
        <SettingRow icon="diamond-outline" label="Premium (démo)">
          <Switch
            value={profile?.isPremium ?? false}
            onValueChange={(v) => setPremium.mutate(v)}
            trackColor={{ true: colors.gold, false: colors.locked }}
            thumbColor={colors.onPrimary}
          />
        </SettingRow>
        <Pressable onPress={signOut}>
          <SettingRow icon="log-out-outline" label="Se déconnecter">
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </SettingRow>
        </Pressable>
      </Card>
    </Screen>
  );
}

function StatCard({ value, label, color }: { value: number; label: string; color?: string }) {
  const { colors } = useTheme();
  return (
    <Card style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.lg }}>
      <AppText variant="h3" color={color ?? colors.text}>{value}</AppText>
      <AppText variant="caption" tone="secondary" align="center" style={{ marginTop: 2 }}>{label}</AppText>
    </Card>
  );
}

function SettingRow({
  icon,
  label,
  first,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        borderTopWidth: first ? 0 : 1,
        borderTopColor: colors.line,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Ionicons name={icon} size={20} color={colors.textSecondary} />
        <AppText variant="bodyStrong">{label}</AppText>
      </View>
      {children}
    </View>
  );
}
