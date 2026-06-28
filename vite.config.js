import { defineConfig } from 'vite';

// base relative ('./') => fonctionne aussi bien sur jgrewis.github.io (page racine)
// que sur une project page type jgrewis.github.io/siteCV/.
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
});
