// metro.config.js
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const modulesRoot = path.join(projectRoot, 'node_modules');

const config = getDefaultConfig(projectRoot);

// Garante que qualquer pacote resolva SEMPRE a mesma instância do React e runtimes JSX
// utilizados pelo aplicativo, mesmo em builds de produção.
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  react: path.join(modulesRoot, 'react'),
  'react/jsx-runtime': path.join(modulesRoot, 'react/jsx-runtime.js'),
  'react/jsx-dev-runtime': path.join(modulesRoot, 'react/jsx-dev-runtime.js'),
};

module.exports = config;
