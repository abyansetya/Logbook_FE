import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./app/__tests__/setup.ts"],
    globals: true,
    include: ["app/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "~": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "app"),
    },
  },
});
