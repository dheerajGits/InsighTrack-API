import { PrismaClient } from "@prisma/client";
import { colors } from "./terminalColors";

// Check if we are in a development environment
const isDevelopment = process.env.NODE_ENV === "development";

// Add prisma to the NodeJS global type
declare global {
  var prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
let prisma: PrismaClient;

if (isDevelopment) {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
} else {
  prisma = new PrismaClient();
}

prisma.$connect().catch((e) => {
  console.error("Failed to connect to the database", e);
});

prisma.$use(async (params: any, next: any) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  const color =
    after - before < 200
      ? colors.fg.green
      : after - before < 400 && after - before >= 200
      ? colors.fg.yellow
      : colors.fg.red;

  console.log(
    color,
    `↓ Query ${params.model}.${params.action} took ${after - before}ms`,
    colors.reset
  );
  return result;
});

export default prisma;
