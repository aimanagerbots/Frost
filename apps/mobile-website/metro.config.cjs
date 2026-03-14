const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Set EXPO_ROUTER_APP_ROOT for monorepo compatibility
process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, 'app');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch shared packages
config.watchFolders = [
  path.resolve(monorepoRoot, 'packages'),
];

// Resolve packages: local first, then root (hoisted)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Prevent Metro from scanning other apps
config.resolver.blockList = [
  /apps[\\/]app[\\/].*/,
  /apps[\\/]website[\\/].*/,
  /apps[\\/]portal[\\/].*/,
  /apps[\\/]api[\\/].*/,
  /\.next[\\/].*/,
  /\.git[\\/].*/,
  /Frost-Vault[\\/].*/,
];

config.projectRoot = projectRoot;

module.exports = config;
