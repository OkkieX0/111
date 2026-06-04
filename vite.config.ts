import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 2000, // Replace 3000 with your preferred port number
    strictPort: true, // Prevents Vite from automatically picking another port if 3000 is busy
  },

})
