declare var require: any;
const postgres = require('postgres');

declare var process: {
  env: { [key: string]: string | undefined };
};

export function getDb(): any {
  // Don't create connection during build time
  if (typeof window !== 'undefined' || 
      process.env.NEXT_PHASE === 'phase-production-build' ||
      process.env.NODE_ENV === 'production' && !process.env.DB_HOST) {
    return null;
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