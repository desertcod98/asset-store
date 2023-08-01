import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

const connectionString = process.env.DATABASE_URL

declare global {
  var cachedDb: PostgresJsDatabase;
}

let db: PostgresJsDatabase;

if (process.env.NODE_ENV === "production") {
  const client = postgres(connectionString!)
  db = drizzle(client);
} else {
  if (!global.cachedDb) {
    const client = postgres(connectionString!)
    db = drizzle(client);
    global.cachedDb = db;
  }
  db = global.cachedDb;
}

export default db;



