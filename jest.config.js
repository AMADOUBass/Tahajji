module.exports = {
  preset: 'jest-expo',
  // Résout l'alias @/ comme dans tsconfig.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Modules ESM de node_modules à transpiler (en plus du défaut jest-expo).
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@tanstack/.*|@react-native-community/.*|react-native-reanimated|react-native-safe-area-context))',
  ],
};
