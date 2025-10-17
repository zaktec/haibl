import postgres from 'postgres';

export function getDb() {
  const sql = postgres({
    host: process.env.RDS_HOST,
    port: parseInt(process.env.RDS_PORT) || 5432,
    database: process.env.RDS_DATABASE,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  });
  
  return sql;
}