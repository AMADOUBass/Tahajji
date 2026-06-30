// Config Babel explicite (nécessaire pour Jest). Identique au défaut Expo.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
