import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

const dummyUrl = "postgres://postgres:postgres@localhost:5432/things_done";
const isRemoteDb = Boolean(databaseUrl && !databaseUrl.includes("localhost") && !databaseUrl.includes("127.0.0.1"));

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl || dummyUrl,
    ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
export const hasDb = Boolean(databaseUrl);

