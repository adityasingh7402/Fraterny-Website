// vite.config.ts
import { defineConfig } from "file:///D:/Websiteeeeeeeeee/S%20Project/Fraterny/Fraterny-Website/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Websiteeeeeeeeee/S%20Project/Fraterny/Fraterny-Website/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///D:/Websiteeeeeeeeee/S%20Project/Fraterny/Fraterny-Website/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\Websiteeeeeeeeee\\S Project\\Fraterny\\Fraterny-Website";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: true,
    // Enable network access - allows access from any device on your network
    port: 8080,
    strictPort: false,
    // Will try another port if 8080 is busy
    open: false,
    // Set to true if you want browser to open automatically
    proxy: {
      // Proxy Razorpay API requests to avoid CORS
      "/api/razorpay": {
        target: "https://api.razorpay.com/v1",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api\/razorpay/, ""),
        secure: true
      }
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    // Output build stats for analysis
    reportCompressedSize: true,
    // Performance optimizations
    target: "es2020",
    minify: "terser",
    cssMinify: true,
    // Split chunks strategically for better caching and performance
    rollupOptions: {
      output: {
        manualChunks: {
          // CRITICAL PATH - Small, fast loading core
          "app-core": ["react", "react-dom"],
          "app-router": ["react-router-dom"],
          // UI FRAMEWORK - Cached separately, only used components
          "ui-radix-core": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-toast"
          ],
          "ui-radix-forms": [
            "@radix-ui/react-label",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-radio-group"
          ],
          // FORM HANDLING - Used across multiple pages
          "form-utils": [
            "react-hook-form",
            "@hookform/resolvers",
            "zod"
          ],
          // DATA LAYER - Shared but separate
          "data-layer": [
            "@tanstack/react-query",
            "@supabase/supabase-js"
          ],
          // ADMIN-ONLY CHUNKS - Completely separate from public pages
          "admin-charts": ["recharts"],
          "admin-ui": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-tabs",
            "@radix-ui/react-progress"
          ],
          // UTILITIES - Small, shared helpers
          "utils": [
            "clsx",
            "tailwind-merge",
            "class-variance-authority"
          ],
          // DATE UTILITIES - Only loaded when needed
          "date-utils": [
            "date-fns",
            "date-fns-tz"
          ],
          // IMAGE UTILITIES - Admin image management
          "image-utils": [
            "react-image-crop"
          ],
          // Separate chunks for admin services (lazy loaded)
          "admin-services": [
            // These will be dynamically imported, so they won't bloat main bundle
          ]
        }
      }
    },
    // Terser optimizations for production
    terserOptions: {
      compress: {
        // Production optimizations
        drop_console: mode === "production",
        drop_debugger: true,
        pure_funcs: mode === "production" ? ["console.log", "console.warn"] : []
      }
    },
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    // Source maps only in development
    sourcemap: mode === "development",
    // Clean the output directory before building
    emptyOutDir: true
  },
  // Optimize dependencies in dev mode
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query"
      // Include only essential dependencies for faster dev startup
    ],
    exclude: [
      // Exclude admin-heavy dependencies from dev optimization
    ]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxXZWJzaXRlZWVlZWVlZWVlXFxcXFMgUHJvamVjdFxcXFxGcmF0ZXJueVxcXFxGcmF0ZXJueS1XZWJzaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxXZWJzaXRlZWVlZWVlZWVlXFxcXFMgUHJvamVjdFxcXFxGcmF0ZXJueVxcXFxGcmF0ZXJueS1XZWJzaXRlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9XZWJzaXRlZWVlZWVlZWVlL1MlMjBQcm9qZWN0L0ZyYXRlcm55L0ZyYXRlcm55LVdlYnNpdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiB0cnVlLCAvLyBFbmFibGUgbmV0d29yayBhY2Nlc3MgLSBhbGxvd3MgYWNjZXNzIGZyb20gYW55IGRldmljZSBvbiB5b3VyIG5ldHdvcmtcclxuICAgIHBvcnQ6IDgwODAsXHJcbiAgICBzdHJpY3RQb3J0OiBmYWxzZSwgLy8gV2lsbCB0cnkgYW5vdGhlciBwb3J0IGlmIDgwODAgaXMgYnVzeVxyXG4gICAgb3BlbjogZmFsc2UsIC8vIFNldCB0byB0cnVlIGlmIHlvdSB3YW50IGJyb3dzZXIgdG8gb3BlbiBhdXRvbWF0aWNhbGx5XHJcbiAgICBwcm94eToge1xyXG4gICAgICAvLyBQcm94eSBSYXpvcnBheSBBUEkgcmVxdWVzdHMgdG8gYXZvaWQgQ09SU1xyXG4gICAgICAnL2FwaS9yYXpvcnBheSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwczovL2FwaS5yYXpvcnBheS5jb20vdjEnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpXFwvcmF6b3JwYXkvLCAnJyksXHJcbiAgICAgICAgc2VjdXJlOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmXHJcbiAgICBjb21wb25lbnRUYWdnZXIoKSxcclxuICBdLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgLy8gT3V0cHV0IGJ1aWxkIHN0YXRzIGZvciBhbmFseXNpc1xyXG4gICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IHRydWUsXHJcbiAgICBcclxuICAgIC8vIFBlcmZvcm1hbmNlIG9wdGltaXphdGlvbnNcclxuICAgIHRhcmdldDogJ2VzMjAyMCcsXHJcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxyXG4gICAgY3NzTWluaWZ5OiB0cnVlLFxyXG4gICAgXHJcbiAgICAvLyBTcGxpdCBjaHVua3Mgc3RyYXRlZ2ljYWxseSBmb3IgYmV0dGVyIGNhY2hpbmcgYW5kIHBlcmZvcm1hbmNlXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgLy8gQ1JJVElDQUwgUEFUSCAtIFNtYWxsLCBmYXN0IGxvYWRpbmcgY29yZVxyXG4gICAgICAgICAgJ2FwcC1jb3JlJzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcclxuICAgICAgICAgICdhcHAtcm91dGVyJzogWydyZWFjdC1yb3V0ZXItZG9tJ10sXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIFVJIEZSQU1FV09SSyAtIENhY2hlZCBzZXBhcmF0ZWx5LCBvbmx5IHVzZWQgY29tcG9uZW50c1xyXG4gICAgICAgICAgJ3VpLXJhZGl4LWNvcmUnOiBbXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJywgXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtZHJvcGRvd24tbWVudScsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3Qtc2VsZWN0JyxcclxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC10b2FzdCdcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICAndWktcmFkaXgtZm9ybXMnOiBbXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtbGFiZWwnLFxyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWNoZWNrYm94JyxcclxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1yYWRpby1ncm91cCdcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIEZPUk0gSEFORExJTkcgLSBVc2VkIGFjcm9zcyBtdWx0aXBsZSBwYWdlc1xyXG4gICAgICAgICAgJ2Zvcm0tdXRpbHMnOiBbXHJcbiAgICAgICAgICAgICdyZWFjdC1ob29rLWZvcm0nLCBcclxuICAgICAgICAgICAgJ0Bob29rZm9ybS9yZXNvbHZlcnMnLFxyXG4gICAgICAgICAgICAnem9kJ1xyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gREFUQSBMQVlFUiAtIFNoYXJlZCBidXQgc2VwYXJhdGVcclxuICAgICAgICAgICdkYXRhLWxheWVyJzogW1xyXG4gICAgICAgICAgICAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5JyxcclxuICAgICAgICAgICAgJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcydcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIEFETUlOLU9OTFkgQ0hVTktTIC0gQ29tcGxldGVseSBzZXBhcmF0ZSBmcm9tIHB1YmxpYyBwYWdlc1xyXG4gICAgICAgICAgJ2FkbWluLWNoYXJ0cyc6IFsncmVjaGFydHMnXSxcclxuICAgICAgICAgICdhZG1pbi11aSc6IFtcclxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1hY2NvcmRpb24nLFxyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LXRhYnMnLFxyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LXByb2dyZXNzJ1xyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gVVRJTElUSUVTIC0gU21hbGwsIHNoYXJlZCBoZWxwZXJzXHJcbiAgICAgICAgICAndXRpbHMnOiBbXHJcbiAgICAgICAgICAgICdjbHN4JyxcclxuICAgICAgICAgICAgJ3RhaWx3aW5kLW1lcmdlJyxcclxuICAgICAgICAgICAgJ2NsYXNzLXZhcmlhbmNlLWF1dGhvcml0eSdcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIERBVEUgVVRJTElUSUVTIC0gT25seSBsb2FkZWQgd2hlbiBuZWVkZWRcclxuICAgICAgICAgICdkYXRlLXV0aWxzJzogW1xyXG4gICAgICAgICAgICAnZGF0ZS1mbnMnLFxyXG4gICAgICAgICAgICAnZGF0ZS1mbnMtdHonXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBJTUFHRSBVVElMSVRJRVMgLSBBZG1pbiBpbWFnZSBtYW5hZ2VtZW50XHJcbiAgICAgICAgICAnaW1hZ2UtdXRpbHMnOiBbXHJcbiAgICAgICAgICAgICdyZWFjdC1pbWFnZS1jcm9wJ1xyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gU2VwYXJhdGUgY2h1bmtzIGZvciBhZG1pbiBzZXJ2aWNlcyAobGF6eSBsb2FkZWQpXHJcbiAgICAgICAgICAnYWRtaW4tc2VydmljZXMnOiBbXHJcbiAgICAgICAgICAgIC8vIFRoZXNlIHdpbGwgYmUgZHluYW1pY2FsbHkgaW1wb3J0ZWQsIHNvIHRoZXkgd29uJ3QgYmxvYXQgbWFpbiBidW5kbGVcclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIFRlcnNlciBvcHRpbWl6YXRpb25zIGZvciBwcm9kdWN0aW9uXHJcbiAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgLy8gUHJvZHVjdGlvbiBvcHRpbWl6YXRpb25zXHJcbiAgICAgICAgZHJvcF9jb25zb2xlOiBtb2RlID09PSAncHJvZHVjdGlvbicsXHJcbiAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcclxuICAgICAgICBwdXJlX2Z1bmNzOiBtb2RlID09PSAncHJvZHVjdGlvbicgPyBbJ2NvbnNvbGUubG9nJywgJ2NvbnNvbGUud2FybiddIDogW10sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBPcHRpbWl6ZSBkZXBlbmRlbmNpZXNcclxuICAgIGNvbW1vbmpzT3B0aW9uczoge1xyXG4gICAgICBpbmNsdWRlOiBbL25vZGVfbW9kdWxlcy9dLFxyXG4gICAgICB0cmFuc2Zvcm1NaXhlZEVzTW9kdWxlczogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIFNvdXJjZSBtYXBzIG9ubHkgaW4gZGV2ZWxvcG1lbnRcclxuICAgIHNvdXJjZW1hcDogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyxcclxuICAgIFxyXG4gICAgLy8gQ2xlYW4gdGhlIG91dHB1dCBkaXJlY3RvcnkgYmVmb3JlIGJ1aWxkaW5nXHJcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcclxuICB9LFxyXG4gIFxyXG4gIC8vIE9wdGltaXplIGRlcGVuZGVuY2llcyBpbiBkZXYgbW9kZVxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgaW5jbHVkZTogW1xyXG4gICAgICAncmVhY3QnLCBcclxuICAgICAgJ3JlYWN0LWRvbScsIFxyXG4gICAgICAncmVhY3Qtcm91dGVyLWRvbScsIFxyXG4gICAgICAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5JyxcclxuICAgICAgLy8gSW5jbHVkZSBvbmx5IGVzc2VudGlhbCBkZXBlbmRlbmNpZXMgZm9yIGZhc3RlciBkZXYgc3RhcnR1cFxyXG4gICAgXSxcclxuICAgIGV4Y2x1ZGU6IFtcclxuICAgICAgLy8gRXhjbHVkZSBhZG1pbi1oZWF2eSBkZXBlbmRlbmNpZXMgZnJvbSBkZXYgb3B0aW1pemF0aW9uXHJcbiAgICBdXHJcbiAgfSxcclxufSkpOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVcsU0FBUyxvQkFBb0I7QUFDaFksT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBO0FBQUEsSUFDWixNQUFNO0FBQUE7QUFBQSxJQUNOLE9BQU87QUFBQTtBQUFBLE1BRUwsaUJBQWlCO0FBQUEsUUFDZixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxvQkFBb0IsRUFBRTtBQUFBLFFBQ3RELFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsaUJBQ1QsZ0JBQWdCO0FBQUEsRUFDbEIsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVMLHNCQUFzQjtBQUFBO0FBQUEsSUFHdEIsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBO0FBQUEsSUFHWCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUE7QUFBQSxVQUVaLFlBQVksQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUNqQyxjQUFjLENBQUMsa0JBQWtCO0FBQUE7QUFBQSxVQUdqQyxpQkFBaUI7QUFBQSxZQUNmO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDRjtBQUFBLFVBQ0Esa0JBQWtCO0FBQUEsWUFDaEI7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQTtBQUFBLFVBR0EsY0FBYztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQTtBQUFBLFVBR0EsY0FBYztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsVUFDRjtBQUFBO0FBQUEsVUFHQSxnQkFBZ0IsQ0FBQyxVQUFVO0FBQUEsVUFDM0IsWUFBWTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQTtBQUFBLFVBR0EsU0FBUztBQUFBLFlBQ1A7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQTtBQUFBLFVBR0EsY0FBYztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsVUFDRjtBQUFBO0FBQUEsVUFHQSxlQUFlO0FBQUEsWUFDYjtBQUFBLFVBQ0Y7QUFBQTtBQUFBLFVBR0Esa0JBQWtCO0FBQUE7QUFBQSxVQUVsQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFHQSxlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUE7QUFBQSxRQUVSLGNBQWMsU0FBUztBQUFBLFFBQ3ZCLGVBQWU7QUFBQSxRQUNmLFlBQVksU0FBUyxlQUFlLENBQUMsZUFBZSxjQUFjLElBQUksQ0FBQztBQUFBLE1BQ3pFO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFHQSxpQkFBaUI7QUFBQSxNQUNmLFNBQVMsQ0FBQyxjQUFjO0FBQUEsTUFDeEIseUJBQXlCO0FBQUEsSUFDM0I7QUFBQTtBQUFBLElBR0EsV0FBVyxTQUFTO0FBQUE7QUFBQSxJQUdwQixhQUFhO0FBQUEsRUFDZjtBQUFBO0FBQUEsRUFHQSxjQUFjO0FBQUEsSUFDWixTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBO0FBQUEsSUFFRjtBQUFBLElBQ0EsU0FBUztBQUFBO0FBQUEsSUFFVDtBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
