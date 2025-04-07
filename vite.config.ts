
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
            // React ecosystem bundle - must include ALL packages that use React contexts or internals
            if (id.includes('react') || 
                id.includes('react-dom') || 
                id.includes('react-router') ||
                id.includes('@radix-ui') ||
                id.includes('sonner') ||
                id.includes('@tanstack/react-query') ||
                id.includes('next-themes') ||
                id.includes('vaul') ||
                id.includes('cmdk') ||
                id.includes('embla-carousel-react') ||
                id.includes('react-day-picker') ||
                id.includes('react-hook-form') ||
                id.includes('react-image-crop') ||
                id.includes('react-resizable-panels')) {
              return 'vendor-react';
            }
            
            // UI utilities and libraries that don't directly depend on React internals
            if (id.includes('lucide') || 
                id.includes('clsx') || 
                id.includes('tailwind-merge') ||
                id.includes('class-variance-authority') ||
                id.includes('date-fns') ||
                id.includes('zod') ||
                id.includes('@supabase') ||
                id.includes('@hookform')) {
              return 'vendor-utils';
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
