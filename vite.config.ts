
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/langflow": {
        target: "https://api.langflow.astra.datastax.com/lf/5ec9bcb6-b2bd-43c8-a3b8-bfaad0c4cbfc/api/v1/run/7279fafc-58db-4ed9-9c7d-4f6e76833cc5?stream=false",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/langflow/, ""),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
