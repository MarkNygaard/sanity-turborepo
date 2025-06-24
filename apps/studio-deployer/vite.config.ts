import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/components": resolve(__dirname, "./src/components"),
      "@/hooks": resolve(__dirname, "./src/hooks"),
      "@/services": resolve(__dirname, "./src/services"),
      "@/types": resolve(__dirname, "./src/types"),
    },
  },
  server: {
    port: 3333,
    host: true,
    fs: {
      // Allow serving files from one level up to the project root
      allow: [".."],
    },
    // Configure CORS for Sanity authentication
    cors: {
      origin: ["https://api.sanity.io", "https://www.sanity.io"],
      credentials: true,
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  // Handle Sanity authentication redirects
  preview: {
    cors: true,
  },
});
