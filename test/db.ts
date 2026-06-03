import { execSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import EmbeddedPostgres from "embedded-postgres";
import { PrismaClient } from "@prisma/client";

// Boots a REAL Postgres (downloaded binary, no Docker) for tests, pushes the
// Prisma schema into it, and hands back a connected client. This is the
// primary test seam: domain use-cases run against real Postgres, never a mock.

export interface TestDatabase {
  prisma: PrismaClient;
  url: string;
  stop: () => Promise<void>;
}

export async function startTestDatabase(): Promise<TestDatabase> {
  const dir = mkdtempSync(join(tmpdir(), "loyalty-pg-"));
  const port = 54000 + Math.floor(Math.random() * 2000);

  const pg = new EmbeddedPostgres({
    databaseDir: dir,
    user: "postgres",
    password: "postgres",
    port,
    persistent: false,
  });

  await pg.initialise();
  await pg.start();
  await pg.createDatabase("test");

  const url = `postgresql://postgres:postgres@localhost:${port}/test`;

  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    env: { ...process.env, DATABASE_URL: url },
    stdio: "inherit",
  });

  const prisma = new PrismaClient({ datasourceUrl: url });

  return {
    prisma,
    url,
    async stop() {
      await prisma.$disconnect();
      await pg.stop();
      rmSync(dir, { recursive: true, force: true });
    },
  };
}
