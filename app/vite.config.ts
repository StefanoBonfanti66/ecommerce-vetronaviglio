import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('supabase')) return 'vendor-supabase'
            if (id.includes('tiptap')) return 'vendor-tiptap'
            if (id.includes('paypal')) return 'vendor-paypal'
            if (id.includes('react')) return 'vendor-react'
            return 'vendor'
          }
        },
      },
    },
  },
})
