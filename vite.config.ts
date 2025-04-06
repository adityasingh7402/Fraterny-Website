
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
  },
}));
