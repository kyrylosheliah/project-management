import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import UnoCSS from 'unocss/vite';

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT, 10) : 5000,
  },
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    UnoCSS(),
  ],
})
