import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Brotli compression for modern browsers
    compression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024 }),
    // Gzip fallback for older browsers
    compression({ algorithm: 'gzip', ext: '.gz', threshold: 1024 }),
  ],

  server: {
    port: 5173,
  },

  build: {
    // ── Security: no source maps in production ──────────────────────────────
    sourcemap: false,

    // ── Minification via esbuild (built-in, fast, no extra dep) ────────────
    minify: 'esbuild',

    // ── CSS minification ────────────────────────────────────────────────────
    cssMinify: true,

    // ── Strip console.* and debugger statements from production build ───────
    // (esbuild handles this natively — no extra plugin needed)
    target: 'es2015',

    // ── Skip reporting compressed size (speeds up build) ───────────────────
    reportCompressedSize: false,

    // ── Suppress chunk size warning until 1 MB ──────────────────────────────
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // ── Content-hashed asset filenames ────────────────────────────────
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',

        // ── Manual chunk splitting for better caching ─────────────────────
        manualChunks: {
          // Core React runtime — changes rarely
          vendor: ['react', 'react-dom'],
          // Router — changes rarely
          router: ['react-router-dom'],
          // Animation library — heavy, rarely changes
          motion: ['framer-motion'],
          // Icon library — changes with icon additions only
          icons: ['lucide-react'],
          // HTTP client
          http: ['axios'],
        },
      },
    },
  },

  // ── esbuild transform options ─────────────────────────────────────────────
  esbuild: {
    // Drop all console.* calls and debugger statements in production
    drop: ['console', 'debugger'],
    // Remove legal comments from output
    legalComments: 'none',
  },
})

