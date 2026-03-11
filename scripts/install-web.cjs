const { spawnSync } = require('child_process');
const path = require('path');

const appDir = path.join(__dirname, '..', 'dashdarkx-v1.0.0 (1)');

function run(command) {
  const result = spawnSync(command, {
    cwd: appDir,
    stdio: 'inherit',
    shell: true,
  });

  if (result.error) {
    throw result.error;
  }

  return result.status ?? 1;
}

const ciStatus = run('npm ci');

if (ciStatus === 0) {
  process.exit(0);
}

console.warn('npm ci failed in the nested app; retrying with npm install.');
process.exit(run('npm install'));
