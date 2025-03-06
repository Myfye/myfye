import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import postcssPresetEnv from "postcss-preset-env";
import postcssEasings from "postcss-easings";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
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
});
