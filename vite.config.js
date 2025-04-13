import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/meow-call/', // MUST match your repo name
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
