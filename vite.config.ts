import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      // "/websocket": {
      //   target: "ws://localhost:5173",
      //   ws: true,
      // },
    },
  },
});
