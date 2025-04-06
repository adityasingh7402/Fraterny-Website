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
  css: {
    // Ensure CSS modules are properly handled
    modules: {
      localsConvention: 'camelCase',
    },
    // Make sure PostCSS (used by Tailwind) runs correctly
    postcss: './postcss.config.js',
    // Dev sourcemaps for easier debugging
    devSourcemap: true,
  },
  build: {
    // Ensure CSS is properly extracted in production
    cssCodeSplit: true,
    // Optimize CSS extraction
    cssMinify: 'lightningcss',
    // Output build stats for analysis
    reportCompressedSize: true,
    // Output source maps for debugging
    sourcemap: mode === 'development',
    // Clean the output directory before building
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Optimize chunk sizes for better caching
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group React and core dependencies
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // Group UI components 
            if (id.includes('@radix-ui') || id.includes('lucide')) {
              return 'vendor-ui';
            }
            // Other dependencies
            return 'vendor';
          }
        },
        // Ensure critical CSS is prioritized
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            // Name critical CSS differently for easier identification
            if (assetInfo.source && assetInfo.source.includes('.heading-1') || 
                assetInfo.source.includes('.bg-navy') || 
                assetInfo.source.includes('.hero')) {
              return 'assets/critical-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
}));
