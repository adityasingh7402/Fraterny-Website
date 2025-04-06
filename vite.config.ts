
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Output build stats for analysis
    reportCompressedSize: true,
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Group React dependencies together
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Group Tanstack/UI dependencies
          'vendor-ui': ['@tanstack/react-query', '@radix-ui/react-toast', '@radix-ui/react-dialog'],
          // Group charting libraries
          'vendor-charts': ['recharts'],
        },
        // Extract CSS into separate files for better caching
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/css/i.test(extType)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      }
    },
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    // Output source maps for debugging
    sourcemap: mode === 'development',
    // Clean the output directory before building
    emptyOutDir: true,
    // Minify CSS for production
    cssMinify: true,
    // Extract CSS into a separate file
    cssCodeSplit: true,
  },
  // Optimize dependencies in dev mode
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
  },
  // CSS optimization options
  css: {
    // Enable CSS modules
    modules: {
      scopeBehaviour: 'local',
    },
    // Optimize CSS processing
    postcss: {
      plugins: [],
    },
    // Minify CSS in production
    devSourcemap: true,
  },
}));
