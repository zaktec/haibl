import postgres from 'postgres';

export function getDb() {
  // Don't create connection during build time
  if (typeof window === 'undefined' && !process.env.DB_HOST) {
    throw new Error('Database not available during build');
  }
  
  const sql = postgres({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'haibl',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  });
  
  return sql;
}