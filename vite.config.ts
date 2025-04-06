
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
    // Remove the cssMinify option that depends on lightningcss
    // cssMinify: 'lightningcss',
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
        // Fixed TypeScript error by correctly typing the assetFileNames function
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            const source = assetInfo.source ? assetInfo.source.toString() : '';
            if (source.includes('.heading-1') || source.includes('.bg-navy') || source.includes('.hero')) {
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
