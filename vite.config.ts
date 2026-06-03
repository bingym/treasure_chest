import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  optimizeDeps: {
    include: ['react18-json-view'],
  },
  server: {
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('sonner') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('crypto-js') || id.includes('qrcode')) {
              return 'utils-vendor';
            }
            if (id.includes('exifr')) {
              return 'exif-vendor';
            }
            if (id.includes('sql-formatter')) {
              return 'sql-formatter-vendor';
            }
            if (id.includes('react18-json-view')) {
              return 'json-viewer-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
          // Route-based code splitting
          if (id.includes('/src/components/JsonViewer')) {
            return 'json-viewer';
          }
          if (id.includes('/src/pages/tool/')) {
            return 'tool-pages';
          }
          if (id.includes('/src/pages/reference/')) {
            return 'reference-pages';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})