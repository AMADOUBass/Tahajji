import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppText, Button, Screen } from '@/components/ui';
import { fonts, radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import { useAuthStore } from '@/store/auth';

/**
 * Saisie du code à 6 chiffres reçu par e-mail (confirmation d'inscription ou
 * réinitialisation de mot de passe) — sans deep link.
 */
export default function VerifyOtpScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string; type: 'signup' | 'recovery' }>();
  const email = params.email ?? '';
  const type = params.type === 'recovery' ? 'recovery' : 'signup';

  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const resendSignup = useAuthStore((s) => s.resendSignup);
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    setMessage(null);
    if (code.trim().length < 8) {
      setMessage('Entre le code à 8 chiffres reçu par e-mail.');
      return;
    }
    setLoading(true);
    const res = await verifyOtp(email, code.trim(), type);
    setLoading(false);
    if (res.error) {
      setMessage(res.error);
      return;
    }
    // Session ouverte. Inscription → l'app se monte seule ; recovery → nouveau mot de passe.
    if (type === 'recovery') {
      router.replace('/reset-password');
    }
  };

  const resend = async () => {
    setMessage(null);
    const res = type === 'recovery' ? await requestPasswordReset(email) : await resendSignup(email);
    setMessage(res.error ?? 'Nouveau code envoyé par e-mail.');
  };

  return (
    <Screen scroll contentStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl }}>
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
        <AppText variant="h2">Vérifie ton e-mail</AppText>
        <AppText variant="body" tone="secondary" style={{ marginTop: spacing.sm }}>
          On a envoyé un code à 8 chiffres à{' '}
          <AppText variant="bodyStrong">{email}</AppText>. Saisis-le ci-dessous.
        </AppText>
      </View>

      <TextInput
        value={code}
        onChangeText={(t) => setCode(t.replace(/[^0-9]/g, '').slice(0, 8))}
        placeholder="––––––––"
        placeholderTextColor={colors.textSecondary}
        keyboardType="number-pad"
        maxLength={8}
        style={{
          borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.surface,
          borderRadius: radius.md, height: 64, marginTop: spacing.xl,
          fontFamily: fonts.bold, fontSize: 24, color: colors.text,
          textAlign: 'center', letterSpacing: 6,
        }}
      />

      <Button label="Valider" onPress={submit} loading={loading} style={{ marginTop: spacing.xl }} />
      {message ? (
        <AppText variant="caption" tone="secondary" align="center" style={{ marginTop: spacing.md }}>
          {message}
        </AppText>
      ) : null}

      <Pressable onPress={resend} style={{ marginTop: spacing.lg }}>
        <AppText variant="bodyStrong" color={colors.primary} align="center">Renvoyer le code</AppText>
      </Pressable>
    </Screen>
  );
}
