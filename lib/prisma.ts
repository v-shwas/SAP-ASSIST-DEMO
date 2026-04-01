/**
 * Prisma client singleton — prevents creating multiple instances in dev (hot reload).
 * Uses @neondatabase/serverless for Vercel edge/serverless compatibility.
 */
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export function getPrisma(): PrismaClient {
  if (!global.__prisma) {
    const raw = process.env.DATABASE_URL;
    if (!raw) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    // Strip channel_binding param — unsupported by @neondatabase/serverless WebSocket transport
    const url = new URL(raw);
    url.searchParams.delete("channel_binding");
    const connectionString = url.toString();
    const pool = new Pool({ connectionString });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Neon Pool/PrismaNeon type mismatch across versions
    const adapter = new PrismaNeon(pool as any);
    global.__prisma = new PrismaClient({ adapter });
  }
  return global.__prisma;
}
