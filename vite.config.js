import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/components": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/upload": {
        target: "http://localhost:3344",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      "/multiple": {
        target: "http://localhost:3344",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      "/dropzone": {
        target: "http://localhost:3344",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [vue(), vuetify({ autoImport: true })],
});
