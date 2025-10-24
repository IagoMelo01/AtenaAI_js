const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.resolver = {
  ...(config.resolver || {}),
  extraNodeModules: {
    ...(config.resolver?.extraNodeModules || {}),
    react: path.resolve(projectRoot, 'node_modules/react'),
    'react/jsx-runtime': path.resolve(projectRoot, 'node_modules/react/jsx-runtime.js'),
    'react/jsx-dev-runtime': path.resolve(projectRoot, 'node_modules/react/jsx-dev-runtime.js'),
  },
};

module.exports = config;
