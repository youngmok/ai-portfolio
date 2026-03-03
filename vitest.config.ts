import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // jsdom simulates browser APIs (window, document, sessionStorage, etc.)
    environment: "jsdom",
    globals: true,
    // Reset module-level state between test files
    isolate: true,
    setupFiles: [],
    // Include both lib and component test paths
    include: ["src/**/__tests__/**/*.{test,spec}.{ts,tsx}"],
    // Reset all mocks automatically between each test
    clearMocks: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      // Mirror tsconfig paths: @/* -> src/*
      "@": path.resolve(__dirname, "./src"),
      // Stub next/navigation for unit tests (no Next.js runtime needed)
      "next/navigation": path.resolve(
        __dirname,
        "src/__mocks__/next/navigation.ts"
      ),
    },
  },
});
