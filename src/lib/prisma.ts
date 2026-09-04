import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL ?? 'postgresql://localhost:5432/booktrace';
const adapter = new PrismaPg({ connectionString });
const prismaGlobal = globalThis as unknown as { prisma?: PrismaClient };
const prisma = prismaGlobal.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') prismaGlobal.prisma = prisma;
export default prisma;
