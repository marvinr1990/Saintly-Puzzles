import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Saintly-Puzzles/',
  server: {
    hmr: {
      overlay: false  // Disable the HMR error overlay
    }
  }
})
