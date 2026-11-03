import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { contentLinks } from './src/plugins/content-links.mjs';

const base = '/ProteomIQonWebSite';

export default defineConfig({
  site: 'https://paulineHans.github.io',
  base,
  integrations: [react()],
  markdown: {
    processor: satteri({
      hastPlugins: [contentLinks({ base, contentDir: fileURLToPath(new URL('./src/content', import.meta.url)) })],
    }),
  },
  vite: { plugins: [tailwindcss()] },
});