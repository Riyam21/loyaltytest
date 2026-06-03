import { afterAll, beforeAll, expect, test } from "vitest";
import type { PrismaClient } from "@prisma/client";
import { startTestDatabase, type TestDatabase } from "./db";
import { latestHealthCheck, recordHealthCheck } from "../src/core/health";

let db: TestDatabase;
let prisma: PrismaClient;

beforeAll(async () => {
  db = await startTestDatabase();
  prisma = db.prisma;
});

afterAll(async () => {
  await db?.stop();
});

test("a health check round-trips through the real database", async () => {
  await recordHealthCheck(prisma, "hello");

  const latest = await latestHealthCheck(prisma);

  expect(latest?.label).toBe("hello");
});

test("latest returns the most recent health check", async () => {
  await recordHealthCheck(prisma, "first");
  await recordHealthCheck(prisma, "second");

  const latest = await latestHealthCheck(prisma);

  expect(latest?.label).toBe("second");
});
