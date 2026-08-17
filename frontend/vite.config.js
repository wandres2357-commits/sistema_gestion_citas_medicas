// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // --- OPCIONALES útiles ---
  // base: '/sgcm/', // <— si vas a desplegar en subcarpeta (GitHub Pages, etc.)
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
})
