// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Garante que qualquer pacote resolva SEMPRE a mesma instância de react e jsx-runtime
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  react: path.resolve(__dirname, 'node_modules/react'),
  'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime.js'),
};

module.exports = config;
