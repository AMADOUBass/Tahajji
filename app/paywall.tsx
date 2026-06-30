import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { AppText, Button, Screen } from '@/components/ui';
import { usePurchases, type PlanId } from '@/lib/purchases';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

type Plan = PlanId;

const FEATURES = [
  'Tout le parcours : voyelles, madd, tanwîn & tajwîd',
  'Certificats de fin de niveau',
  'Cœurs illimités',
  'Histoires premium',
  'Hors-ligne & sans publicité',
];

// Prix en dollars canadiens (CAD) — placeholders, à ajuster.
const PLANS: { id: Plan; label: string; price: string; note: string; badge?: string }[] = [
  { id: 'monthly', label: 'Mensuel', price: '6,99 $', note: '/mois' },
  { id: 'lifetime', label: 'À vie', price: '99,99 $', note: 'paiement unique', badge: 'MEILLEURE OFFRE' },
  { id: 'yearly', label: 'Annuel', price: '54,99 $', note: '/an' },
];

export default function PaywallScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { purchase, restore, isProcessing, simulated } = usePurchases();
  const [selected, setSelected] = useState<Plan>('lifetime');

  const onBuy = () => purchase(selected, () => router.back());
  const onRestore = () =>
    restore((restored) =>
      restored
        ? router.back()
        : Alert.alert('Restauration', 'Aucun achat à restaurer pour ce compte.'),
    );

  return (
    <Screen scroll contentStyle={{ flexGrow: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }}>
      <View style={{ alignItems: 'flex-end', marginTop: spacing.sm }}>
        <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Fermer">
          <Ionicons name="close" size={24} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* En-tête */}
      <View style={{ alignItems: 'center', marginTop: spacing.xs }}>
        <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: 'rgba(201,154,63,0.16)', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="diamond" size={32} color={colors.gold} />
        </View>
        <AppText variant="h2" align="center" style={{ marginTop: spacing.lg }}>Va plus loin avec Premium</AppText>
        <AppText variant="body" tone="secondary" align="center" style={{ marginTop: spacing.sm }}>
          Débloque l’apprentissage avancé et tes certificats.
        </AppText>
      </View>

      {/* Avantages */}
      <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
        {FEATURES.map((f) => (
          <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(201,154,63,0.18)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="checkmark" size={13} color={colors.gold} />
            </View>
            <AppText variant="body" style={{ flex: 1 }}>{f}</AppText>
          </View>
        ))}
      </View>

      {/* Offres */}
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl }}>
        {PLANS.map((plan) => {
          const active = selected === plan.id;
          return (
            <Pressable
              key={plan.id}
              onPress={() => setSelected(plan.id)}
              style={{
                flex: plan.badge ? 1.15 : 1,
                backgroundColor: colors.surface,
                borderColor: active ? colors.gold : colors.border,
                borderWidth: active ? 2.5 : 1.5,
                borderRadius: radius.md,
                paddingVertical: spacing.lg,
                paddingHorizontal: spacing.sm,
                alignItems: 'center',
              }}
            >
              {plan.badge ? (
                <View style={{ position: 'absolute', top: -10, backgroundColor: colors.gold, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: 999 }}>
                  <AppText variant="caption" color="#2E2118" style={{ fontSize: 9 }}>{plan.badge}</AppText>
                </View>
              ) : null}
              <AppText variant="caption" tone="secondary">{plan.label}</AppText>
              <AppText variant="h3" style={{ marginTop: spacing.xs }}>{plan.price}</AppText>
              <AppText variant="caption" color={plan.badge ? colors.gold : colors.textSecondary} align="center">{plan.note}</AppText>
            </Pressable>
          );
        })}
      </View>

      {/* Rappel : Coran gratuit */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.lg, backgroundColor: 'rgba(46,158,107,0.12)', borderRadius: radius.md, padding: spacing.md }}>
        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        <AppText variant="caption" style={{ flex: 1, lineHeight: 18 }}>
          La lecture du Coran reste <AppText variant="caption" color={colors.success}>100% gratuite</AppText>, pour toujours.
        </AppText>
      </View>

      <View style={{ flex: 1 }} />

      <Button
        label={
          isProcessing
            ? 'Patiente…'
            : selected === 'lifetime'
              ? 'Choisir « À vie » — 99,99 $'
              : selected === 'yearly'
                ? 'Commencer l’essai gratuit — Annuel'
                : 'Commencer l’essai gratuit — Mensuel'
        }
        variant="gold"
        onPress={onBuy}
        disabled={isProcessing}
        style={{ marginTop: spacing.xl }}
      />
      <AppText variant="caption" tone="secondary" align="center" style={{ marginTop: spacing.sm }}>
        {selected === 'lifetime'
          ? 'Paiement unique. Prix en dollars canadiens (CAD).'
          : '7 jours d’essai gratuit, puis facturation. Résiliable à tout moment. Prix en CAD.'}
        {simulated ? ' · (mode démo : achat simulé)' : ''}
      </AppText>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, marginTop: spacing.md }}>
        <Pressable onPress={onRestore} hitSlop={8}>
          <AppText variant="caption" color={colors.primary}>Restaurer mes achats</AppText>
        </Pressable>
        <Pressable onPress={() => router.push('/legal/terms')} hitSlop={8}>
          <AppText variant="caption" color={colors.primary}>Conditions</AppText>
        </Pressable>
      </View>
    </Screen>
  );
}
