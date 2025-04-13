import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/meow-call/', // MUST match repo name exactly
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true // Helps debug path issues
  }
})
