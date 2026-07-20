// vite.config.js
import { defineConfig } from "file:///D:/web/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/web/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import compression from "file:///D:/web/frontend/node_modules/vite-plugin-compression/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    // Brotli compression for modern browsers
    compression({ algorithm: "brotliCompress", ext: ".br", threshold: 1024 }),
    // Gzip fallback for older browsers
    compression({ algorithm: "gzip", ext: ".gz", threshold: 1024 })
  ],
  server: {
    port: 5173
  },
  build: {
    // ── Security: no source maps in production ──────────────────────────────
    sourcemap: false,
    // ── Minification via esbuild (built-in, fast, no extra dep) ────────────
    minify: "esbuild",
    // ── CSS minification ────────────────────────────────────────────────────
    cssMinify: true,
    // ── Strip console.* and debugger statements from production build ───────
    // (esbuild handles this natively — no extra plugin needed)
    target: "es2015",
    // ── Skip reporting compressed size (speeds up build) ───────────────────
    reportCompressedSize: false,
    // ── Suppress chunk size warning until 1 MB ──────────────────────────────
    chunkSizeWarningLimit: 1e3,
    rollupOptions: {
      output: {
        // ── Content-hashed asset filenames ────────────────────────────────
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        // ── Manual chunk splitting for better caching ─────────────────────
        manualChunks: {
          // Core React runtime — changes rarely
          vendor: ["react", "react-dom"],
          // Router — changes rarely
          router: ["react-router-dom"],
          // Animation library — heavy, rarely changes
          motion: ["framer-motion"],
          // Icon library — changes with icon additions only
          icons: ["lucide-react"],
          // HTTP client
          http: ["axios"]
        }
      }
    }
  },
  // ── esbuild transform options ─────────────────────────────────────────────
  esbuild: {
    // Drop all console.* calls and debugger statements in production
    drop: ["console", "debugger"],
    // Remove legal comments from output
    legalComments: "none"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3ZWJcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHdlYlxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovd2ViL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBjb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbidcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIC8vIEJyb3RsaSBjb21wcmVzc2lvbiBmb3IgbW9kZXJuIGJyb3dzZXJzXG4gICAgY29tcHJlc3Npb24oeyBhbGdvcml0aG06ICdicm90bGlDb21wcmVzcycsIGV4dDogJy5icicsIHRocmVzaG9sZDogMTAyNCB9KSxcbiAgICAvLyBHemlwIGZhbGxiYWNrIGZvciBvbGRlciBicm93c2Vyc1xuICAgIGNvbXByZXNzaW9uKHsgYWxnb3JpdGhtOiAnZ3ppcCcsIGV4dDogJy5neicsIHRocmVzaG9sZDogMTAyNCB9KSxcbiAgXSxcblxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTczLFxuICB9LFxuXG4gIGJ1aWxkOiB7XG4gICAgLy8gXHUyNTAwXHUyNTAwIFNlY3VyaXR5OiBubyBzb3VyY2UgbWFwcyBpbiBwcm9kdWN0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTWluaWZpY2F0aW9uIHZpYSBlc2J1aWxkIChidWlsdC1pbiwgZmFzdCwgbm8gZXh0cmEgZGVwKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBDU1MgbWluaWZpY2F0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNzc01pbmlmeTogdHJ1ZSxcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBTdHJpcCBjb25zb2xlLiogYW5kIGRlYnVnZ2VyIHN0YXRlbWVudHMgZnJvbSBwcm9kdWN0aW9uIGJ1aWxkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIC8vIChlc2J1aWxkIGhhbmRsZXMgdGhpcyBuYXRpdmVseSBcdTIwMTQgbm8gZXh0cmEgcGx1Z2luIG5lZWRlZClcbiAgICB0YXJnZXQ6ICdlczIwMTUnLFxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFNraXAgcmVwb3J0aW5nIGNvbXByZXNzZWQgc2l6ZSAoc3BlZWRzIHVwIGJ1aWxkKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2UsXG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgU3VwcHJlc3MgY2h1bmsgc2l6ZSB3YXJuaW5nIHVudGlsIDEgTUIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIC8vIFx1MjUwMFx1MjUwMCBDb250ZW50LWhhc2hlZCBhc3NldCBmaWxlbmFtZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5bZXh0XScsXG5cbiAgICAgICAgLy8gXHUyNTAwXHUyNTAwIE1hbnVhbCBjaHVuayBzcGxpdHRpbmcgZm9yIGJldHRlciBjYWNoaW5nIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAvLyBDb3JlIFJlYWN0IHJ1bnRpbWUgXHUyMDE0IGNoYW5nZXMgcmFyZWx5XG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgIC8vIFJvdXRlciBcdTIwMTQgY2hhbmdlcyByYXJlbHlcbiAgICAgICAgICByb3V0ZXI6IFsncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgIC8vIEFuaW1hdGlvbiBsaWJyYXJ5IFx1MjAxNCBoZWF2eSwgcmFyZWx5IGNoYW5nZXNcbiAgICAgICAgICBtb3Rpb246IFsnZnJhbWVyLW1vdGlvbiddLFxuICAgICAgICAgIC8vIEljb24gbGlicmFyeSBcdTIwMTQgY2hhbmdlcyB3aXRoIGljb24gYWRkaXRpb25zIG9ubHlcbiAgICAgICAgICBpY29uczogWydsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgICAvLyBIVFRQIGNsaWVudFxuICAgICAgICAgIGh0dHA6IFsnYXhpb3MnXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICAvLyBcdTI1MDBcdTI1MDAgZXNidWlsZCB0cmFuc2Zvcm0gb3B0aW9ucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgZXNidWlsZDoge1xuICAgIC8vIERyb3AgYWxsIGNvbnNvbGUuKiBjYWxscyBhbmQgZGVidWdnZXIgc3RhdGVtZW50cyBpbiBwcm9kdWN0aW9uXG4gICAgZHJvcDogWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10sXG4gICAgLy8gUmVtb3ZlIGxlZ2FsIGNvbW1lbnRzIGZyb20gb3V0cHV0XG4gICAgbGVnYWxDb21tZW50czogJ25vbmUnLFxuICB9LFxufSlcblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxTyxTQUFTLG9CQUFvQjtBQUNsUSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7QUFHeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsSUFFTixZQUFZLEVBQUUsV0FBVyxrQkFBa0IsS0FBSyxPQUFPLFdBQVcsS0FBSyxDQUFDO0FBQUE7QUFBQSxJQUV4RSxZQUFZLEVBQUUsV0FBVyxRQUFRLEtBQUssT0FBTyxXQUFXLEtBQUssQ0FBQztBQUFBLEVBQ2hFO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBRUEsT0FBTztBQUFBO0FBQUEsSUFFTCxXQUFXO0FBQUE7QUFBQSxJQUdYLFFBQVE7QUFBQTtBQUFBLElBR1IsV0FBVztBQUFBO0FBQUE7QUFBQSxJQUlYLFFBQVE7QUFBQTtBQUFBLElBR1Isc0JBQXNCO0FBQUE7QUFBQSxJQUd0Qix1QkFBdUI7QUFBQSxJQUV2QixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUE7QUFBQSxRQUVOLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBO0FBQUEsUUFHaEIsY0FBYztBQUFBO0FBQUEsVUFFWixRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUE7QUFBQSxVQUU3QixRQUFRLENBQUMsa0JBQWtCO0FBQUE7QUFBQSxVQUUzQixRQUFRLENBQUMsZUFBZTtBQUFBO0FBQUEsVUFFeEIsT0FBTyxDQUFDLGNBQWM7QUFBQTtBQUFBLFVBRXRCLE1BQU0sQ0FBQyxPQUFPO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBR0EsU0FBUztBQUFBO0FBQUEsSUFFUCxNQUFNLENBQUMsV0FBVyxVQUFVO0FBQUE7QUFBQSxJQUU1QixlQUFlO0FBQUEsRUFDakI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
