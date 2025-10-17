import postgres from 'postgres';

let sql = null;

/**
 * Get a singleton database connection
 * - Reuses the same connection pool (important for Next.js hot reloads)
 * - Uses environment variable POSTGRES_URL in production
 * - Falls back to local database for development
 */
export function getDb() {
  if (!sql) {
    const connectionString = process.env.POSTGRES_URL || 'postgresql://localhost:5432/mathdb';

    sql = postgres(connectionString, {
      ssl: process.env.POSTGRES_URL
        ? { rejectUnauthorized: false }
        : undefined,
      max: 20,              // Increase connection pool size
      idle_timeout: 30,     // Keep connections alive longer
      connect_timeout: 5,   // Faster connection timeout
      debug: false, // Disable query logging for performance
    });
  }
  return sql;
}

/**
 * Gracefully close the database connection pool
 * (useful for scripts or tests, not usually needed in serverless apps)
 */
export async function closeDb() {
  if (sql) {
    await sql.end({ timeout: 5 });
    sql = null;
  }
}
