import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Enable network access - allows access from any device on your network
    port: 8080,
    strictPort: false, // Will try another port if 8080 is busy
    open: false, // Set to true if you want browser to open automatically
    proxy: {
      // Proxy Razorpay API requests to avoid CORS
      '/api/razorpay': {
        target: 'https://api.razorpay.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/razorpay/, ''),
        secure: true,
      },
    },
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
    
    // Performance optimizations
    target: 'es2020',
    minify: 'terser',
    cssMinify: true,
    
    // Split chunks strategically for better caching and performance
    rollupOptions: {
      output: {
        manualChunks: {
          // CRITICAL PATH - Small, fast loading core
          'app-core': ['react', 'react-dom'],
          'app-router': ['react-router-dom'],
          
          // UI FRAMEWORK - Cached separately, only used components
          'ui-radix-core': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-toast'
          ],
          'ui-radix-forms': [
            '@radix-ui/react-label',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-radio-group'
          ],
          
          // FORM HANDLING - Used across multiple pages
          'form-utils': [
            'react-hook-form', 
            '@hookform/resolvers',
            'zod'
          ],
          
          // DATA LAYER - Shared but separate
          'data-layer': [
            '@tanstack/react-query',
            '@supabase/supabase-js'
          ],
          
          // ADMIN-ONLY CHUNKS - Completely separate from public pages
          'admin-charts': ['recharts'],
          'admin-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-tabs',
            '@radix-ui/react-progress'
          ],
          
          // UTILITIES - Small, shared helpers
          'utils': [
            'clsx',
            'tailwind-merge',
            'class-variance-authority'
          ],
          
          // DATE UTILITIES - Only loaded when needed
          'date-utils': [
            'date-fns',
            'date-fns-tz'
          ],
          
          // IMAGE UTILITIES - Admin image management
          'image-utils': [
            'react-image-crop'
          ],
          
          // Separate chunks for admin services (lazy loaded)
          'admin-services': [
            // These will be dynamically imported, so they won't bloat main bundle
          ]
        }
      }
    },
    
    // Terser optimizations for production
    terserOptions: {
      compress: {
        // Production optimizations
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.warn'] : [],
      },
    },
    
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    
    // Source maps only in development
    sourcemap: mode === 'development',
    
    // Clean the output directory before building
    emptyOutDir: true,
  },
  
  // Optimize dependencies in dev mode
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      '@tanstack/react-query',
      // Include only essential dependencies for faster dev startup
    ],
    exclude: [
      // Exclude admin-heavy dependencies from dev optimization
    ]
  },
}));