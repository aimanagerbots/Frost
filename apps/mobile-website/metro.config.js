const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// Set EXPO_ROUTER_APP_ROOT for monorepo compatibility
process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, 'app');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Only watch specific monorepo packages, not the entire root
config.watchFolders = [
  path.resolve(monorepoRoot, 'packages/types'),
  path.resolve(monorepoRoot, 'packages/tokens'),
  path.resolve(monorepoRoot, 'packages/ui'),
];

// Resolve packages from both project and monorepo root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Ensure project root is correctly set for expo-router
config.projectRoot = projectRoot;

module.exports = withNativeWind(config, { input: './src/global.css' });
