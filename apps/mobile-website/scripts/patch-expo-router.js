const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const routerDir = path.resolve(projectRoot, 'node_modules/expo-router');
const appDir = path.resolve(projectRoot, 'app');

// Calculate relative path from expo-router package to our app/ directory
const relativePath = path.relative(routerDir, appDir).split(path.sep).join('/');
console.log(`App root relative to expo-router: ${relativePath}`);

// Patch _ctx.web.js — write the entire file to ensure correctness
const webCtx = path.join(routerDir, '_ctx.web.js');
if (fs.existsSync(webCtx)) {
  const original = fs.readFileSync(webCtx, 'utf8');
  // Extract the regex from the original file
  const regexMatch = original.match(/\/\^.*\$\//);
  const regex = regexMatch ? regexMatch[0] : `/^(?:\\.\\/\)(?!(?:(?:(?:.*\\+api)|(?:\\+middleware)|(?:\\+(html|native-intent))))\\.[tj]sx?$).*(?:\\.android|\\.ios|\\.native)?\\.[tj]sx?$/`;

  fs.writeFileSync(webCtx, `export const ctx = require.context(
  '${relativePath}',
  true,
  ${regex},
  'sync'
);
`);
  console.log('Patched _ctx.web.js');
}

// Patch _ctx.js
const nativeCtx = path.join(routerDir, '_ctx.js');
if (fs.existsSync(nativeCtx)) {
  const original = fs.readFileSync(nativeCtx, 'utf8');
  const regexMatch = original.match(/\/\^.*\$\//);
  const regex = regexMatch ? regexMatch[0] : `/^(?:\\.\\/\)(?!(?:(?:(?:.*\\+api)|(?:\\+html)))\\.[tj]sx?$).*\\.[tj]sx?$/`;

  fs.writeFileSync(nativeCtx, `export const ctx = require.context(
  '${relativePath}',
  true,
  ${regex}
);
`);
  console.log('Patched _ctx.js');
}
