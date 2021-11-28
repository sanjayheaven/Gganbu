import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import model from "./Gganbu/vite-plugin-model"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), model()],
  resolve: {
    alias: [
      { find: "@", replacement: require("path").resolve(__dirname, "src") },
      { find: "~", replacement: require("path").resolve(__dirname) },
    ],
  },
})
