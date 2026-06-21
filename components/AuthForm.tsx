/**
 * Formulaire d'authentification (maquette 02), réutilisé par sign-up et sign-in.
 * UI uniquement pour l'instant : « Continuer » entre dans l'app.
 * À l'intégration : brancher supabase.auth.signUp / signInWithPassword.
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppText, Button, Screen } from '@/components/ui';
import { fonts, radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';
import { useAuthStore } from '@/store/auth';

interface AuthFormProps {
  mode: 'sign-up' | 'sign-in';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<'email' | 'password' | null>(null);
  const signIn = useAuthStore((s) => s.signIn);

  const isSignUp = mode === 'sign-up';

  const fieldStyle = (name: 'email' | 'password') => ({
    borderWidth: 1.5,
    borderColor: focused === name ? colors.primary : colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 54,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  });

  // UI-first : on marque la session active ; le groupe protégé du layout
  // monte automatiquement l'app (aucune navigation impérative nécessaire).
  const submit = () => signIn();

  return (
    <Screen scroll contentStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl }}>
      <Pressable
        onPress={() => router.back()}
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: spacing.sm,
        }}
      >
        <Ionicons name="chevron-back" size={22} color={colors.text} />
      </Pressable>

      <View style={{ marginTop: spacing.xl }}>
        <AppText variant="h2">{isSignUp ? 'Crée ton compte' : 'Bon retour'}</AppText>
        <AppText variant="body" tone="secondary" style={{ marginTop: spacing.sm }}>
          {isSignUp
            ? 'Sauvegarde ta progression, ta série et tes leçons.'
            : 'Reprends là où tu t\'es arrêté.'}
        </AppText>
      </View>

      <View style={{ gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ gap: spacing.sm }}>
          <AppText variant="label" tone="secondary">Adresse e-mail</AppText>
          <View style={fieldStyle('email')}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              placeholder="toi@exemple.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={{ flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.text }}
            />
          </View>
        </View>

        <View style={{ gap: spacing.sm }}>
          <AppText variant="label" tone="secondary">Mot de passe</AppText>
          <View style={fieldStyle('password')}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={{ flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.text }}
            />
            <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={10}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      </View>

      <Button label="Continuer" onPress={submit} style={{ marginTop: spacing.xl }} />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.xl }}>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        <AppText variant="caption" tone="secondary">ou</AppText>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
      </View>

      <View style={{ gap: spacing.md }}>
        <SocialButton provider="google" label="Continuer avec Google" />
        <SocialButton provider="apple" label="Continuer avec Apple" />
      </View>

      <AppText variant="caption" tone="secondary" align="center" style={{ marginTop: spacing.xl }}>
        En continuant, tu acceptes nos conditions et notre politique de confidentialité.
      </AppText>

      <Pressable onPress={() => router.replace(isSignUp ? '/(auth)/sign-in' : '/(auth)/sign-up')} style={{ marginTop: spacing.lg }}>
        <AppText variant="bodyStrong" tone="secondary" align="center">
          {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? Créer un compte'}
        </AppText>
      </Pressable>
    </Screen>
  );
}

// Boutons « marque » : Apple = noir + logo blanc ; Google = blanc + G bleu Google.
// (Couleurs officielles. Voir note : à finaliser selon les guidelines Apple/Google
// au moment de brancher le vrai OAuth — hors périmètre MVP.)
function SocialButton({ provider, label }: { provider: 'google' | 'apple'; label: string }) {
  const isApple = provider === 'apple';
  const bg = isApple ? '#000000' : '#FFFFFF';
  const fg = isApple ? '#FFFFFF' : '#1F1F1F';
  const iconColor = isApple ? '#FFFFFF' : '#4285F4';
  const borderColor = isApple ? '#000000' : '#DADCE0';

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: bg,
        borderWidth: 1.5,
        borderColor,
        borderRadius: radius.md,
        height: 52,
      }}
    >
      <Ionicons name={isApple ? 'logo-apple' : 'logo-google'} size={20} color={iconColor} />
      <AppText variant="bodyStrong" color={fg}>{label}</AppText>
    </Pressable>
  );
}
