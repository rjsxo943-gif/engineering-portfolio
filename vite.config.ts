import { defineConfig } from 'vite';
export default defineConfig({
  base: process.env.PAGES_BASE || '/engineering-portfolio/',
  server: {fs: {deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/private_sources/**', '**/handoff/**', '**/*.zip']}},
});
