import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import console from 'node:console';
import process from 'node:process';

const rootDir = process.cwd();
const tmpDir = resolve(rootDir, '.tmp-smoke');
const packDir = join(tmpDir, 'pack');
const consumerDir = join(tmpDir, 'consumer');
const viteBin = join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

function run(command, args, cwd) {
  const isWindowsNpm = process.platform === 'win32' && command === 'npm';
  const resolvedCommand = isWindowsNpm ? 'powershell.exe' : command;
  const resolvedArgs = isWindowsNpm ? ['-Command', `npm ${args.join(' ')}`] : args;
  const result = spawnSync(resolvedCommand, resolvedArgs, {
    cwd,
    encoding: 'utf8',
    stdio: 'pipe',
    shell: false,
  });

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n');
    throw new Error(`Command failed: ${command} ${args.join(' ')}\n${output}`);
  }

  return result.stdout.trim();
}

function ensureCleanDir(dir) {
  rmSync(dir, { force: true, recursive: true });
  mkdirSync(dir, { recursive: true });
}

function writeConsumerProject(tarballName) {
  writeFileSync(
    join(consumerDir, 'package.json'),
    JSON.stringify(
      {
        name: 'orbitui-smoke-consumer',
        private: true,
        type: 'module',
        dependencies: {
          '@jabir0/orbitui-react': `file:../pack/${tarballName}`,
        },
      },
      null,
      2,
    ),
  );

  writeFileSync(
    join(consumerDir, 'index.html'),
    '<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>',
  );

  mkdirSync(join(consumerDir, 'src'), { recursive: true });
  writeFileSync(
    join(consumerDir, 'src', 'main.jsx'),
    "import { createRoot } from 'react-dom/client';\nimport { Button } from '@jabir0/orbitui-react';\n\nfunction App() {\n  return (\n    <main>\n      <Button>Smoke Test</Button>\n    </main>\n  );\n}\n\ncreateRoot(document.getElementById('root')).render(<App />);\n",
  );
}

function verifyTreeShaking() {
  const assetsDir = join(consumerDir, 'dist', 'assets');
  const assetFiles = readdirSync(assetsDir).filter((fileName) => fileName.endsWith('.js'));
  const bundleSource = assetFiles
    .map((fileName) => readFileSync(join(assetsDir, fileName), 'utf8'))
    .join('\n');

  const unexpectedMarkers = ['Command palette', 'Data table', 'Deploy preview', 'Combobox'];
  const leakedMarkers = unexpectedMarkers.filter((marker) => bundleSource.includes(marker));

  if (!bundleSource.includes('Smoke Test')) {
    throw new Error('Smoke bundle did not include the expected application output.');
  }

  if (leakedMarkers.length > 0) {
    throw new Error(`Tree-shaking check failed. Unexpected markers found: ${leakedMarkers.join(', ')}`);
  }
}

if (!existsSync(join(rootDir, 'dist'))) {
  throw new Error('dist is missing. Run `npm run build` before the smoke test.');
}

ensureCleanDir(tmpDir);
mkdirSync(packDir, { recursive: true });
mkdirSync(consumerDir, { recursive: true });

for (const fileName of readdirSync(rootDir).filter((entry) => entry.endsWith('.tgz'))) {
  rmSync(join(rootDir, fileName), { force: true });
}

run('npm', ['pack'], rootDir);
const tarballName = readdirSync(rootDir).find((fileName) => fileName.endsWith('.tgz'));

if (!tarballName) {
  throw new Error('npm pack did not create a tarball.');
}

renameSync(join(rootDir, tarballName), join(packDir, tarballName));

writeConsumerProject(tarballName);
run('npm', ['install'], consumerDir);
run(process.execPath, [viteBin, 'build'], consumerDir);
verifyTreeShaking();

rmSync(tmpDir, { force: true, recursive: true });
console.log('Smoke package test passed.');


