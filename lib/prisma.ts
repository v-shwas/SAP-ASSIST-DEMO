/**
 * Prisma client singleton — prevents creating multiple instances in dev (hot reload).
 * Uses @neondatabase/serverless for Vercel edge/serverless compatibility.
 */
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export function getPrisma(): PrismaClient {
  if (!global.__prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    const adapter = new PrismaNeon({ connectionString });
    global.__prisma = new PrismaClient({ adapter });
  }
  return global.__prisma;
}
