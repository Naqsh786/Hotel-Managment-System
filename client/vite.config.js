import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react-router-dom"]
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:7000",
        changeOrigin: true,
        secure: false
      }
    }
  }
})