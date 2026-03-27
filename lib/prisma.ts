/**
 * Prisma client singleton — prevents creating multiple instances in dev (hot reload).
 * Prisma 7 uses a driver adapter pattern instead of datasourceUrl in the constructor.
 */
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export function getPrisma(): PrismaClient {
  if (!global.__prisma) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL ?? "",
      connectionTimeoutMillis: 3000, // fail fast if Postgres isn't running
      max: 5,
    });
    const adapter = new PrismaPg(pool);
    global.__prisma = new PrismaClient({ adapter });
  }
  return global.__prisma;
}
