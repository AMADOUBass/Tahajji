// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    // Dossiers non source : build, maquettes/assets de design, audio généré.
    ignores: ["dist/*", "design/**", "audio_out/**", ".expo/**"],
  },
  {
    // Scripts Node (outils de build) : globals Node.
    files: ["scripts/**/*.{js,mjs}"],
    languageOptions: {
      globals: {
        Buffer: "readonly",
        process: "readonly",
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        URL: "readonly",
        __dirname: "readonly",
      },
    },
  }
]);
