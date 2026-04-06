import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, 'src');
const srcEntry = resolve(srcDir, 'index.js');

function isExternal(id) {
  return (
    !id.startsWith('.') &&
    !id.startsWith('/') &&
    !id.startsWith('src/') &&
    !/^[A-Za-z]:[\\/]/.test(id)
  );
}

function preserveModulePath(filePath) {
  const relativePath = relative(srcDir, filePath);
  const extension = extname(relativePath);

  return relativePath.slice(0, -extension.length).replace(/\\/g, '/');
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    copyPublicDir: false,
    cssCodeSplit: true,
    lib: {
      entry: srcEntry,
      name: 'OrbitUI',
    },
    rollupOptions: {
      external: isExternal,
      output: [
        {
          format: 'es',
          dir: 'dist',
          entryFileNames: (chunkInfo) => `${preserveModulePath(chunkInfo.facadeModuleId)}.js`,
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: 'assets/[name][extname]',
          exports: 'named',
          preserveModules: true,
          preserveModulesRoot: 'src',
        },
        {
          format: 'cjs',
          dir: 'dist',
          entryFileNames: (chunkInfo) => `${preserveModulePath(chunkInfo.facadeModuleId)}.cjs`,
          chunkFileNames: 'chunks/[name]-[hash].cjs',
          assetFileNames: 'assets/[name][extname]',
          exports: 'named',
          interop: 'auto',
          preserveModules: true,
          preserveModulesRoot: 'src',
        },
      ],
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
});
