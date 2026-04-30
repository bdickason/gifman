import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    open: false, // Auto-open browser
    fs: {
      // Allow serving files from parent directories
      allow: ['..']
    },
    // Same WebSocket port as HTTP server — avoids failures when dev server picks
    // another port (5176+) or when a fixed HMR port (e.g. 5174) is already in use.
    hmr: {
      overlay: true,
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
