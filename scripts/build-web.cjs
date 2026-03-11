const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const appDir = path.join(rootDir, 'dashdarkx-v1.0.0 (1)');
const appDistDir = path.join(appDir, 'dist');
const rootDistDir = path.join(rootDir, 'dist');

const buildResult = spawnSync('npm run build', {
  cwd: appDir,
  stdio: 'inherit',
  shell: true,
});

if (buildResult.error) {
  throw buildResult.error;
}

if (buildResult.status !== 0) {
  process.exit(buildResult.status ?? 1);
}

fs.rmSync(rootDistDir, { recursive: true, force: true });
fs.cpSync(appDistDir, rootDistDir, { recursive: true });
