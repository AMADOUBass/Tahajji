import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, Switch, View } from 'react-native';

import { AppText, Card, ProgressBar, Screen } from '@/components/ui';
import { computeBadges, levelFromXp } from '@/lib/gamification';
import { cancelDailyReminder, ensureNotificationPermission, scheduleDailyReminder } from '@/lib/notifications';
import { useProfile, useProgress, useSetPremium } from '@/lib/queries';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import { useAuthStore } from '@/store/auth';
import { usePrefsStore } from '@/store/prefs';
import { useThemeStore } from '@/store/theme';

export default function ProfileScreen() {
  const { colors, scheme } = useTheme();
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: progress } = useProgress();
  const setPremium = useSetPremium();
  const setPreference = useThemeStore((s) => s.setPreference);
  const signOut = useAuthStore((s) => s.signOut);
  const remindersEnabled = usePrefsStore((s) => s.remindersEnabled);
  const reminderHour = usePrefsStore((s) => s.reminderHour);
  const setRemindersEnabled = usePrefsStore((s) => s.setRemindersEnabled);

  const toggleReminders = async (value: boolean) => {
    if (value) {
      const ok = await ensureNotificationPermission();
      if (!ok) {
        Alert.alert('Notifications désactivées', 'Autorise les notifications dans les réglages du téléphone pour recevoir le rappel quotidien.');
        return;
      }
      await scheduleDailyReminder(reminderHour);
      setRemindersEnabled(true);
    } else {
      await cancelDailyReminder();
      setRemindersEnabled(false);
    }
  };

  const lessonsCompleted = (progress ?? []).filter((p) => p.status === 'completed').length;
  const displayName = profile?.displayName ?? 'Apprenant';
  const initial = displayName.charAt(0).toUpperCase();
  const xp = profile?.xp ?? 0;
  const { level, xpInLevel, xpForLevel, progress: levelProgress } = levelFromXp(xp);
  const badges = computeBadges({ xp, streak: profile?.streakCount ?? 0, completedCount: lessonsCompleted, level });
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <Screen scroll contentStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm }}>
        <AppText variant="h2">Profil</AppText>
        <Pressable
          onPress={() => router.push('/profile/edit')}
          hitSlop={10}
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, opacity: pressed ? 0.6 : 1 })}
        >
          <Ionicons name="create-outline" size={20} color={colors.primary} />
          <AppText variant="bodyStrong" color={colors.primary}>Modifier</AppText>
        </Pressable>
      </View>

      {/* Carte héros : identité + niveau + progression */}
      <View style={{ backgroundColor: colors.primaryContainer, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
          <View style={{ width: 76, height: 76, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 2, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
            <AppText variant="h2" color={colors.gold}>{initial}</AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="h3" color={colors.onPrimaryContainer}>{displayName}</AppText>
            <AppText variant="caption" color="rgba(255,253,247,0.7)" numberOfLines={1} style={{ marginTop: 2 }}>
              {profile?.bio?.trim() ? profile.bio : 'Niveau débutant'}
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm, alignSelf: 'flex-start', backgroundColor: 'rgba(201,154,63,0.28)', paddingVertical: 4, paddingHorizontal: spacing.sm, borderRadius: 999 }}>
              <Ionicons name="star" size={12} color={colors.gold} />
              <AppText variant="caption" color={colors.gold}>Niveau {level}</AppText>
            </View>
          </View>
        </View>
        {/* Progression vers le niveau suivant */}
        <View style={{ marginTop: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
            <AppText variant="caption" color="rgba(255,253,247,0.7)">Prochain niveau</AppText>
            <AppText variant="caption" color="rgba(255,253,247,0.85)">{xpInLevel}/{xpForLevel} XP</AppText>
          </View>
          <ProgressBar value={levelProgress} height={8} trackColor="rgba(255,255,255,0.18)" />
        </View>
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
        <StatCard icon="star" value={xp} label="XP total" color={colors.gold} />
        <StatCard icon="flame" value={profile?.streakCount ?? 0} label="Série (jours)" color={colors.flame} />
        <StatCard icon="school" value={lessonsCompleted} label="Leçons" color={colors.primary} />
      </View>

      {/* Badges */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xl, marginBottom: spacing.md }}>
        <AppText variant="title">Badges</AppText>
        <AppText variant="caption" tone="secondary">{earnedCount}/{badges.length} débloqués</AppText>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        {badges.map((b) => (
          <View key={b.id} style={{ alignItems: 'center', width: 88, gap: 6 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: b.earned ? colors.gold : colors.locked,
              }}
            >
              <Ionicons name={b.icon} size={26} color={b.earned ? '#fff' : colors.lockedInk} />
            </View>
            <AppText variant="caption" tone={b.earned ? 'default' : 'secondary'} align="center">{b.label}</AppText>
          </View>
        ))}
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
        <SettingRow icon="notifications-outline" label="Rappel quotidien">
          <Switch
            value={remindersEnabled}
            onValueChange={toggleReminders}
            trackColor={{ true: colors.primary, false: colors.locked }}
            thumbColor={colors.onPrimary}
          />
        </SettingRow>
        {/* Toggle de DEV uniquement (jamais en production) : simule le premium. */}
        {__DEV__ ? (
          <SettingRow icon="diamond-outline" label="Premium (démo)">
            <Switch
              value={profile?.isPremium ?? false}
              onValueChange={(v) => setPremium.mutate(v)}
              trackColor={{ true: colors.gold, false: colors.locked }}
              thumbColor={colors.onPrimary}
            />
          </SettingRow>
        ) : null}
        <Pressable onPress={signOut}>
          <SettingRow icon="log-out-outline" label="Se déconnecter">
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </SettingRow>
        </Pressable>
      </Card>

      {/* À propos & légal */}
      <AppText variant="title" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>À propos & légal</AppText>
      <Card padded={false} style={{ paddingHorizontal: spacing.lg }}>
        <Pressable onPress={() => router.push('/legal/about')}>
          <SettingRow icon="information-circle-outline" label="À propos & crédits" first>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </SettingRow>
        </Pressable>
        <Pressable onPress={() => router.push('/legal/privacy')}>
          <SettingRow icon="lock-closed-outline" label="Confidentialité">
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </SettingRow>
        </Pressable>
        <Pressable onPress={() => router.push('/legal/terms')}>
          <SettingRow icon="document-text-outline" label="Conditions d’utilisation">
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </SettingRow>
        </Pressable>
      </Card>
    </Screen>
  );
}

function StatCard({ icon, value, label, color }: { icon: keyof typeof Ionicons.glyphMap; value: number; label: string; color?: string }) {
  const { colors } = useTheme();
  return (
    <Card style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.lg, gap: 4 }}>
      <Ionicons name={icon} size={18} color={color ?? colors.primary} />
      <AppText variant="h3" color={color ?? colors.text}>{value}</AppText>
      <AppText variant="caption" tone="secondary" align="center">{label}</AppText>
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
