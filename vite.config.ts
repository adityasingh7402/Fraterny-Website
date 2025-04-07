
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
        // Refined chunking strategy to prevent React context errors
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React ecosystem bundle - all React and dependencies that use React internals
            if (id.includes('react') || 
                id.includes('react-dom') || 
                id.includes('react-router') ||
                id.includes('@radix-ui') ||  // UI components that depend on React
                id.includes('sonner') ||     // Toast notifications that use React contexts
                id.includes('@tanstack/react-query') || // React Query uses React contexts
                id.includes('@supabase') ||  // May use React internals
                id.includes('zod') ||        // Often used with React forms
                id.includes('date-fns')) {   // Date libraries used with React
              return 'vendor-react-ecosystem';
            }
            
            // UI utilities that don't directly depend on React internals
            if (id.includes('lucide') || 
                id.includes('clsx') || 
                id.includes('tailwind-merge') ||
                id.includes('class-variance-authority')) {
              return 'vendor-ui-utils';
            }
            
            // All other dependencies
            return 'vendor-other';
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
