import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppText, Button, Screen } from '@/components/ui';
import { fonts, radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import { useAuthStore } from '@/store/auth';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    setMessage(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage('Entre une adresse e-mail valide.');
      return;
    }
    setLoading(true);
    const res = await requestPasswordReset(email.trim());
    setLoading(false);
    if (res.error) {
      setMessage(res.error);
    } else {
      setSent(true);
      // Code de réinitialisation envoyé → saisie du code (pas de deep link).
      router.push({ pathname: '/(auth)/verify-otp', params: { email: email.trim(), type: 'recovery' } });
    }
  };

  return (
    <Screen scroll keyboardAvoiding contentStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl }}>
      <Pressable
        onPress={() => router.back()}
        style={{
          width: 40, height: 40, borderRadius: radius.md, borderWidth: 1,
          borderColor: colors.border, backgroundColor: colors.surface,
          alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm,
        }}
      >
        <Ionicons name="chevron-back" size={22} color={colors.text} />
      </Pressable>

      <View style={{ marginTop: spacing.xl }}>
        <AppText variant="h2">Mot de passe oublié</AppText>
        <AppText variant="body" tone="secondary" style={{ marginTop: spacing.sm }}>
          Entre ton e-mail : on t’envoie un lien pour choisir un nouveau mot de passe.
        </AppText>
      </View>

      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        <AppText variant="label" tone="secondary">Adresse e-mail</AppText>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="toi@exemple.com"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          style={{
            borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface,
            borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 54,
            fontFamily: fonts.medium, fontSize: 15, color: colors.text,
          }}
        />
      </View>

      <Button
        label={sent ? 'Renvoyer le lien' : 'Envoyer le lien'}
        onPress={submit}
        loading={loading}
        style={{ marginTop: spacing.xl }}
      />
      {message ? (
        <AppText variant="caption" tone="secondary" align="center" style={{ marginTop: spacing.md }}>
          {message}
        </AppText>
      ) : null}
    </Screen>
  );
}
