import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import basicSsl from "@vitejs/plugin-basic-ssl";
import tailwindcss from "tailwindcss";
import env from "dotenv";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5555,
  },
  plugins: [
    react(),
    basicSsl({
      name: "localhost",
      domains: ["localhost"],
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
    },
  },
  define: {
    "process.env": env,
    global: {},
    "global.WebSocket": "window.WebSocket", // Ensure WebSocket is available globally
    "global.btoa": "window.btoa.bind(window)", // Ensure btoa is available globally
  },
});
