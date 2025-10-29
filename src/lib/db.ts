import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const db: PrismaClient = 
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  }).$extends(withAccelerate()) as unknown as PrismaClient; // <--- cast

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
