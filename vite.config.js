// vite.config.js - Optimized for better caching
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    rollupOptions: {
      output: {
        // Better chunk splitting for caching
        manualChunks: {
          vendor: ["react", "react-dom"],
          gsap: ["gsap", "@gsap/react"],
          utils: ["react-helmet-async"],
        },
        // Add hashes to filenames for better caching
        // assetFileNames: (assetInfo) => {
        //   const info = assetInfo.name.split(".");
        //   const ext = info[info.length - 1];
        //   if (/\.(jpe?g|png|gif|svg|webp)$/i.test(assetInfo.name)) {
        //     return `images/[name]-[hash][extname]`;
        //   }
        //   if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
        //     return `fonts/[name]-[hash][extname]`;
        //   }
        //   return `assets/[name]-[hash][extname]`;
        // },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
      },
    },

    // Optimize assets
    assetsInlineLimit: 0, // Don't inline images to enable proper caching

    // Target modern browsers for better performance
    target: "es2020",

    // Better minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },

  // Asset handling
  assetsInclude: ["**/*.webp", "**/*.svg", "**/*.jpg", "**/*.png"],

  // Better dev server config
  server: {
    hmr: {
      overlay: false,
    },
    // Enable HTTP/2 for better performance
    https: false, // Set to true if you have SSL certs
  },

  // Preview server optimization
  preview: {
    headers: {
      // Cache static assets for 1 year
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "gsap", "@gsap/react"],
    // Force optimize these even if they're not detected
    force: false,
  },

  // Enable source maps in development only
  // define: {
  //   __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
  // },
});
