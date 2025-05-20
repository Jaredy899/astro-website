// @ts-check
import { defineConfig } from 'astro/config';
import { addCodeCopyButton } from './src/lib/rehype-add-code-copy-button.js';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  build: {
    assets: '_assets'
  },
  markdown: {
    rehypePlugins: [
      addCodeCopyButton
    ],
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
