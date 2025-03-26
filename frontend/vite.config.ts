import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import postcssPresetEnv from "postcss-preset-env";
import postcssEasings from "postcss-easings";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    VitePWA({
      manifest: {
        name: "MyFye",
        short_name: "MyFye",
        description: "MyFye",
        theme_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [postcssPresetEnv, postcssEasings],
    },
  },
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
