// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  build: {
    assets: '_assets'
  },
  redirects: {
    '/debian': {
      status: 301,
      destination: 'https://raw.githubusercontent.com/Jaredy899/linux/refs/heads/main/config_changes/preseed.cfg'
    },
    '/linux': {
      status: 301,
      destination: 'https://raw.githubusercontent.com/Jaredy899/linux/refs/heads/main/linux.sh'
    },
    '/win': {
      status: 301,
      destination: 'https://raw.githubusercontent.com/Jaredy899/win/main/first-setup.ps1'
    },
    '/mac': {
      status: 301,
      destination: 'https://raw.githubusercontent.com/Jaredy899/mac/main/setup.sh'
    }
  }
});
