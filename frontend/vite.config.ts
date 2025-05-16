import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT, 10) : 5000,
  },
  plugins: [react()],
})
