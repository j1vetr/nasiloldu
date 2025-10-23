#!/usr/bin/env node

/**
 * Production SSR Build Script
 * Builds both client and server bundles for SSR
 */

import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function buildSSR() {
  console.log('🚀 Building Production SSR...\n');

  try {
    // Step 1: Build client bundle (with entry-client.tsx)
    console.log('📦 Building client bundle...');
    await build({
      root: path.resolve(rootDir, 'client'),
      build: {
        outDir: path.resolve(rootDir, 'dist/public'),
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
          input: {
            main: path.resolve(rootDir, 'client/index.html'),
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(rootDir, 'client/src'),
          '@shared': path.resolve(rootDir, 'shared'),
          '@assets': path.resolve(rootDir, 'attached_assets'),
        },
      },
    });
    console.log('✅ Client bundle built\n');

    // Step 2: Build server bundle (entry-server.tsx)
    console.log('📦 Building server bundle...');
    await build({
      root: path.resolve(rootDir, 'client'),
      build: {
        ssr: true,
        outDir: path.resolve(rootDir, 'dist/server'),
        emptyOutDir: true,
        rollupOptions: {
          input: path.resolve(rootDir, 'client/src/entry-server.tsx'),
          output: {
            format: 'es',
            entryFileNames: 'entry-server.js',
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(rootDir, 'client/src'),
          '@shared': path.resolve(rootDir, 'shared'),
          '@assets': path.resolve(rootDir, 'attached_assets'),
        },
      },
      ssr: {
        noExternal: ['wouter', '@tanstack/react-query'],
      },
    });
    console.log('✅ Server bundle built\n');

    console.log('🎉 Production SSR build complete!');
    console.log('📁 Client bundle: dist/public');
    console.log('📁 Server bundle: dist/server');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildSSR();
