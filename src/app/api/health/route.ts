import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { latestHealthCheck, recordHealthCheck } from "@/core/health";

// Proves the full path: HTTP -> use-case -> schema -> DB and back.
export async function GET() {
  await recordHealthCheck(prisma, "http-health");
  const latest = await latestHealthCheck(prisma);
  return NextResponse.json({ ok: true, latest });
}
