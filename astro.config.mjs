// @ts-check
import { defineConfig } from 'astro/config';

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

  redirects: {
    // Setup script redirects
    '/win': 'https://raw.githubusercontent.com/Jaredy899/win/main/first-setup.ps1',
    '/mac': 'https://raw.githubusercontent.com/Jaredy899/mac/main/setup.sh',
    '/linux': 'https://raw.githubusercontent.com/Jaredy899/linux/refs/heads/main/linux.sh',
    '/debian': 'https://raw.githubusercontent.com/Jaredy899/linux/refs/heads/main/config_changes/preseed.cfg',
    '/os': 'https://raw.githubusercontent.com/Jaredy899/osutil/refs/heads/main/install.sh',
    '/winos': 'https://raw.githubusercontent.com/Jaredy899/osutil/refs/heads/main/install-windows.ps1',
  },

  integrations: []
});