/**
 * <InfoModal> — petite fiche d'explication (ex. signification des stats).
 * Overlay sombre + carte centrée, fermable au tap dehors ou via le bouton.
 */
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { radius, spacing } from '@/lib/theme';
import { useTheme } from '@/lib/useTheme';

export interface InfoRow {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  description: string;
}

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  rows: InfoRow[];
}

export function InfoModal({ visible, onClose, title, rows }: InfoModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}
      >
        {/* stopPropagation : un tap sur la carte ne ferme pas */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 380, backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.lg }}
        >
          <AppText variant="h3">{title}</AppText>

          <View style={{ gap: spacing.lg }}>
            {rows.map((row) => (
              <View key={row.label} style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
                <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={row.icon} size={20} color={row.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyStrong">{row.label}</AppText>
                  <AppText variant="caption" tone="secondary" style={{ marginTop: 2, lineHeight: 18 }}>
                    {row.description}
                  </AppText>
                </View>
              </View>
            ))}
          </View>

          <Button label="J'ai compris" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
