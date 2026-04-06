/* global console, process, URL */

import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const hookDirectory = '.husky';
const internalDirectory = path.join(hookDirectory, '_');
const hookNames = [
  'pre-commit',
  'pre-merge-commit',
  'prepare-commit-msg',
  'commit-msg',
  'post-commit',
  'applypatch-msg',
  'pre-applypatch',
  'post-applypatch',
  'pre-rebase',
  'post-rewrite',
  'post-checkout',
  'post-merge',
  'pre-push',
  'pre-auto-gc',
];

function resolveGitExecutable() {
  const candidates = [
    'git',
    'C:/Program Files/Git/cmd/git.exe',
    'C:/Program Files/Git/bin/git.exe',
  ];

  for (const candidate of candidates) {
    const result = spawnSync(candidate, ['--version'], { stdio: 'ignore' });

    if (result.status === 0) {
      return candidate;
    }
  }

  return null;
}

if (process.env.HUSKY === '0' || !existsSync('.git')) {
  process.exit(0);
}

const gitExecutable = resolveGitExecutable();

if (!gitExecutable) {
  console.log('git command not found');
  process.exit(1);
}

const configResult = spawnSync(gitExecutable, ['config', 'core.hooksPath', `${hookDirectory}/_`], {
  stdio: 'inherit',
});

if (configResult.status !== 0) {
  process.exit(configResult.status ?? 1);
}

rmSync(path.join(internalDirectory, 'husky.sh'), { force: true });
mkdirSync(internalDirectory, { recursive: true });
writeFileSync(path.join(internalDirectory, '.gitignore'), '*');
copyFileSync(
  new URL('../node_modules/husky/husky', import.meta.url),
  path.join(internalDirectory, 'h'),
);

for (const hookName of hookNames) {
  writeFileSync(
    path.join(internalDirectory, hookName),
    '#!/usr/bin/env sh\n. "$(dirname "$0")/h"\n',
    {
      mode: 0o755,
    },
  );
}

writeFileSync(path.join(internalDirectory, 'husky.sh'), 'echo "husky - DEPRECATED\\n"\n');
