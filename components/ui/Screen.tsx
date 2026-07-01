/**
 * <Screen> — conteneur d'écran : SafeArea + fond du thème.
 * `scroll` enveloppe le contenu dans un ScrollView.
 */
import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/useTheme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  /** Couleur de fond personnalisée (ex : écran de célébration en espresso). */
  background?: string;
  edges?: readonly Edge[];
  contentStyle?: StyleProp<ViewStyle>;
  /** Tirer pour rafraîchir (écrans `scroll` uniquement). */
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Remonte le contenu quand le clavier s'ouvre (formulaires). */
  keyboardAvoiding?: boolean;
}

export function Screen({
  children,
  scroll = false,
  background,
  edges = ['top', 'bottom'],
  contentStyle,
  onRefresh,
  refreshing,
  keyboardAvoiding,
}: ScreenProps) {
  const { colors } = useTheme();
  const bg = background ?? colors.bg;

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={contentStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={edges}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
