/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog, { PrerenderContentFile } from '@analogjs/platform';
import { imagetools } from 'vite-imagetools';

const SITE_HOST = 'https://marabelotti.github.io';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      static: true,
      content: {
        highlighter: 'prism',
      },
      prerender: {
        discover: false,
        routes: async () => [
          '/',
          '/blog',
          '/travels',
          '/research',
          '/404',
          {
            contentDir: '/src/content',
            transform: (file: PrerenderContentFile) => {
              if (file.extension !== 'md') return false;
              if (file.attributes['draft']) return false;
              const slug = file.attributes['slug'] || file.name;
              if (file.attributes['kind'] === 'post') return `/blog/${slug}`;
              if (file.attributes['kind'] === 'trip') return `/travels/${slug}`;
              return false;
            },
          },
        ],
        sitemap: {
          host: SITE_HOST,
        },
      },
    }),
    imagetools({
      defaultDirectives: (url) => {
        // Travel photos: emit a responsive webp srcset by default.
        if (url.searchParams.has('gallery')) {
          return new URLSearchParams({
            format: 'webp',
            quality: '72',
            w: '480;960;1600;2400',
            as: 'srcset',
          });
        }
        return new URLSearchParams();
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
}));
