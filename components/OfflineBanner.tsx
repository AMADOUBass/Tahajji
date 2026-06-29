/**
 * Bandeau « Hors ligne » — informe l'utilisateur quand le réseau est coupé.
 * Le contenu déjà enregistré (cache SQLite) reste consultable ; la progression
 * faite hors-ligne est synchronisée au retour du réseau.
 */
import { Ionicons } from '@expo/vector-icons';
import { onlineManager } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';

export function OfflineBanner() {
  const [online, setOnline] = useState(onlineManager.isOnline());
  const insets = useSafeAreaInsets();

  useEffect(() => onlineManager.subscribe(() => setOnline(onlineManager.isOnline())), []);

  if (online) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#4A3526',
        paddingTop: insets.top,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 5 }}>
        <Ionicons name="cloud-offline" size={13} color="#FFFDF7" />
        <AppText variant="caption" color="#FFFDF7">Hors ligne — contenu enregistré disponible</AppText>
      </View>
    </View>
  );
}
