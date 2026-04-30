import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true,
    host: true,
    port: 5173,
    open: false, // Auto-open browser
    fs: {
      // Allow serving files from parent directories
      allow: ['..']
    },
    // Force reload on file changes
    hmr: {
      overlay: true,
      port: 5174,
      host: 'localhost'
    },
    // Watch for file changes
    watch: {
      usePolling: true,
      interval: 100,
      followSymlinks: false,
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**']
    },
    // Force file watching
    force: true,
    // Disable caching for development
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  // Ensure public directory is served correctly
  publicDir: 'public',
  // Add some debugging
  define: {
    __DEV__: true
  },
  // Development optimizations
  optimizeDeps: {
    force: true
  },
  // Configure for both SPA and static file serving
  appType: 'spa',
  // Handle fallback routing for static files
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})
