import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { AppText, Screen } from '@/components/ui';
import { spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

// Hors périmètre MVP (exercices de pratique) — placeholder pour l'onglet.
export default function PracticeScreen() {
  const { colors } = useTheme();
  return (
    <Screen contentStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg }}>
      <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="disc-outline" size={40} color={colors.primary} />
      </View>
      <AppText variant="h3" align="center">Pratique</AppText>
      <AppText variant="body" tone="secondary" align="center" style={{ maxWidth: 280 }}>
        Les exercices de pratique sur de vrais versets arriveront bientôt. En attendant, continue ton parcours !
      </AppText>
    </Screen>
  );
}
