import { gzipSync } from 'node:zlib';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const rootDir = process.cwd();
const distDir = resolve(rootDir, 'dist');

const budgets = [
  {
    label: 'root ESM entry',
    file: 'index.js',
    maxGzipBytes: 30 * 1024,
  },
  {
    label: 'root CJS entry',
    file: 'index.cjs',
    maxGzipBytes: 30 * 1024,
  },
  {
    label: 'token ESM payload',
    file: 'tokens/generated/tokens.js',
    maxGzipBytes: 8 * 1024,
  },
  {
    label: 'token CJS payload',
    file: 'tokens/generated/tokens.cjs',
    maxGzipBytes: 8 * 1024,
  },
];

function formatKiB(bytes) {
  return `${(bytes / 1024).toFixed(2)} KiB`;
}

function getFileStats(relativePath) {
  const absolutePath = join(distDir, relativePath);
  const source = readFileSync(absolutePath);

  return {
    relativePath,
    rawBytes: source.length,
    gzipBytes: gzipSync(source).length,
  };
}

function collectComponentEntries() {
  const componentsDir = join(distDir, 'components');

  return readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const componentDir = join(componentsDir, entry.name);

      return readdirSync(componentDir)
        .filter((fileName) => fileName.endsWith('.js') || fileName.endsWith('.cjs'))
        .map((fileName) => relative(distDir, join(componentDir, fileName)).replace(/\\/g, '/'));
    })
    .sort();
}

function printResult(prefix, result, budgetBytes) {
  const status = result.gzipBytes <= budgetBytes ? 'PASS' : 'FAIL';
  console.log(
    `${prefix} ${status} ${result.relativePath} | raw ${formatKiB(result.rawBytes)} | gzip ${formatKiB(result.gzipBytes)} | budget ${formatKiB(budgetBytes)}`,
  );
}

const distStats = statSync(distDir, { throwIfNoEntry: false });

if (!distStats?.isDirectory()) {
  console.error('Bundle check failed: dist directory is missing. Run `npm run build` first.');
  process.exit(1);
}

let hasFailure = false;

console.log('Bundle budget report');

for (const budget of budgets) {
  const result = getFileStats(budget.file);
  printResult(`[${budget.label}]`, result, budget.maxGzipBytes);

  if (result.gzipBytes > budget.maxGzipBytes) {
    hasFailure = true;
  }
}

const componentBudgetBytes = 5 * 1024;

for (const componentEntry of collectComponentEntries()) {
  const result = getFileStats(componentEntry);
  printResult('[component]', result, componentBudgetBytes);

  if (result.gzipBytes > componentBudgetBytes) {
    hasFailure = true;
  }
}

if (hasFailure) {
  console.error(
    'Bundle budget check failed. One or more artifacts exceeded the configured gzip limits.',
  );
  process.exit(1);
}

console.log('Bundle budget check passed.');
