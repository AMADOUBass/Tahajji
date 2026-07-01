import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { AppText, Button, Screen } from '@/components/ui';
import { fonts, radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import { useAuthStore } from '@/store/auth';

/**
 * Écran de définition d'un nouveau mot de passe, atteint après le clic sur le
 * lien « mot de passe oublié » (événement PASSWORD_RECOVERY).
 */
export default function ResetPasswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const updatePassword = useAuthStore((s) => s.updatePassword);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    setMessage(null);
    if (password.length < 8) {
      setMessage('Le mot de passe doit faire au moins 8 caractères.');
      return;
    }
    if (password !== confirm) {
      setMessage('Les deux mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    const res = await updatePassword(password);
    setLoading(false);
    if (res.error) {
      setMessage(res.error);
      return;
    }
    router.replace('/');
  };

  const inputStyle = {
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface,
    borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 54,
    fontFamily: fonts.medium, fontSize: 15, color: colors.text,
  };

  return (
    <Screen scroll keyboardAvoiding contentStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl }}>
      <View style={{ marginTop: spacing.xxl }}>
        <AppText variant="h2">Nouveau mot de passe</AppText>
        <AppText variant="body" tone="secondary" style={{ marginTop: spacing.sm }}>
          Choisis un nouveau mot de passe pour ton compte.
        </AppText>
      </View>

      <View style={{ gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ gap: spacing.sm }}>
          <AppText variant="label" tone="secondary">Nouveau mot de passe</AppText>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" placeholder="••••••••" placeholderTextColor={colors.textSecondary} style={inputStyle} />
        </View>
        <View style={{ gap: spacing.sm }}>
          <AppText variant="label" tone="secondary">Confirme le mot de passe</AppText>
          <TextInput value={confirm} onChangeText={setConfirm} secureTextEntry autoCapitalize="none" placeholder="••••••••" placeholderTextColor={colors.textSecondary} style={inputStyle} />
        </View>
      </View>

      <Button label="Enregistrer" onPress={submit} loading={loading} style={{ marginTop: spacing.xl }} />
      {message ? (
        <AppText variant="caption" tone="secondary" align="center" style={{ marginTop: spacing.md }}>{message}</AppText>
      ) : null}
    </Screen>
  );
}
