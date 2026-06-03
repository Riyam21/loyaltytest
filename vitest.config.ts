import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    testTimeout: 120_000,
    hookTimeout: 120_000,
    // Each DB-backed test file boots its own embedded Postgres; run files
    // sequentially to avoid port/resource contention.
    fileParallelism: false,
  },
});
