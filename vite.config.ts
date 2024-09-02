import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/shinka-88-frontend/',
  server: {
    open: true,
    host: '192.168.31.24',
    // host: 'localhost',
    port: 3000
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
