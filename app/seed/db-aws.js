import postgres from 'postgres';

export function getDb() {
  const sql = postgres({
    host: process.env.AWS_RDS_HOST,
    port: process.env.AWS_RDS_PORT || 5432,
    database: process.env.AWS_RDS_DATABASE,
    username: process.env.AWS_RDS_USERNAME,
    password: process.env.AWS_RDS_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  });
  
  return sql;
}