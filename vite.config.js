import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glsl'],
  server: { port: 5173, host: true },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: { output: { manualChunks: { three: ['three'], gsap: ['gsap', '@gsap/react', 'lenis'] } } },
  },
})
