import { Stack } from 'expo-router';

// Écran d'entrée du groupe d'authentification.
export const unstable_settings = {
  initialRouteName: 'welcome',
};

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
