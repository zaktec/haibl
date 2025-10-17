import postgres from 'postgres';

export function getDb() {
  const sql = postgres({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  });
  
  return sql;
}