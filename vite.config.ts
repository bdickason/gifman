import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GIFS_JSON = path.resolve(__dirname, 'data/gifs.json')

function gifsApiMiddleware(
  req: { method?: string; url?: string },
  res: {
    statusCode: number
    setHeader: (name: string, value: string) => void
    end: (body?: string) => void
  },
  next: () => void,
) {
  const pathname = req.url?.split('?')[0] ?? ''
  if (req.method !== 'GET') {
    next()
    return
  }
  if (pathname === '/api/gifs') {
    try {
      const raw = fs.readFileSync(GIFS_JSON, 'utf8')
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(raw)
    } catch (err) {
      console.error('[vite][gifman-gifs-api] /api/gifs read failed:', err)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Failed to read gifs.json' }))
    }
    return
  }
  next()
}

/** Serves `data/gifs.json` at GET /api/gifs without a separate HTTP server. */
function gifmanGifsApiPlugin(): Plugin {
  return {
    name: 'gifman-gifs-api',
    configureServer(server) {
      server.middlewares.use(gifsApiMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(gifsApiMiddleware)
    },
  }
}

export default defineConfig({
  plugins: [react(), gifmanGifsApiPlugin()],
  server: {
    host: true,
    port: 5174,
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
