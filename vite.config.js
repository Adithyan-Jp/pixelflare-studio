import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This file is required for Vercel to understand how to build your React app
export default defineConfig({
  plugins: [react()],
  define: {
    // Ensures global environment variables are handled correctly
    'process.env': {}
  }
})
