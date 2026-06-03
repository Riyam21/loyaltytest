import type { PrismaClient } from "@prisma/client";

// Use-case layer: the seam tests exercise. Pure functions over the DB client,
// no framework or transport concerns.

export async function recordHealthCheck(db: PrismaClient, label: string) {
  return db.healthCheck.create({ data: { label } });
}

export async function latestHealthCheck(db: PrismaClient) {
  return db.healthCheck.findFirst({ orderBy: { createdAt: "desc" } });
}
