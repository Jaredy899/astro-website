// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  build: {
    assets: '_assets'
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  },

  integrations: [mdx()]
});