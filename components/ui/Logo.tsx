/**
 * <Logo> — marque Tahajji (étoile à 8 branches + lettre calligraphiée en or).
 * Affiche le vrai logo (assets/images/splash-icon.png, transparent).
 */
import { Image } from 'react-native';

interface LogoProps {
  size?: number;
}

export function Logo({ size = 70 }: LogoProps) {
  return (
    <Image
      source={require('../../assets/images/splash-icon.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
      accessibilityLabel="Logo Tahajji"
    />
  );
}
