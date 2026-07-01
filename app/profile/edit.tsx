import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppText, Button, Screen } from '@/components/ui';
import { hapticSuccess } from '@/lib/haptics';
import { useProfile, useUpdateProfile } from '@/lib/queries';
import { fonts, radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    setError(null);
    if (!displayName.trim()) {
      setError('Le nom ne peut pas être vide.');
      return;
    }
    updateProfile.mutate(
      { displayName: displayName.trim(), bio: bio.trim() || null },
      {
        onSuccess: () => { hapticSuccess(); router.back(); },
        onError: (e) => setError(e instanceof Error ? e.message : 'Erreur'),
      },
    );
  };

  const fieldStyle = {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 15,
  };

  const initial = (displayName || 'A').charAt(0).toUpperCase();

  return (
    <Screen scroll keyboardAvoiding contentStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl }}>
      {/* En-tête */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm }}>
        <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Retour">
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="h3">Modifier le profil</AppText>
      </View>

      {/* Avatar (initiale pour l'instant ; photo plus tard via Storage) */}
      <View style={{ alignItems: 'center', marginTop: spacing.lg, gap: spacing.sm }}>
        <View style={{ width: 88, height: 88, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ position: 'absolute', width: 88, height: 88, backgroundColor: colors.primaryLight, borderRadius: 24 }} />
          <AppText variant="h1" color={colors.primary}>{initial}</AppText>
        </View>
        <AppText variant="caption" tone="secondary">Photo de profil bientôt disponible</AppText>
      </View>

      {/* Champs */}
      <View style={{ gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ gap: spacing.sm }}>
          <AppText variant="label" tone="secondary">Nom affiché</AppText>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Ton nom"
            placeholderTextColor={colors.textSecondary}
            style={[fieldStyle, { height: 54 }]}
            maxLength={40}
          />
        </View>

        <View style={{ gap: spacing.sm }}>
          <AppText variant="label" tone="secondary">Bio</AppText>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Quelques mots sur toi (optionnel)"
            placeholderTextColor={colors.textSecondary}
            style={[fieldStyle, { height: 110, paddingTop: spacing.md, textAlignVertical: 'top' }]}
            multiline
            maxLength={160}
          />
          <AppText variant="caption" tone="secondary" align="right">{bio.length}/160</AppText>
        </View>
      </View>

      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md }}>
          <Ionicons name="alert-circle" size={15} color={colors.coral} />
          <AppText variant="caption" color={colors.coral} style={{ flexShrink: 1 }}>{error}</AppText>
        </View>
      ) : null}

      <Button label="Enregistrer" onPress={save} loading={updateProfile.isPending} style={{ marginTop: spacing.xl }} />
    </Screen>
  );
}
