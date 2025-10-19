import postgres from 'postgres';

export function getDb() {
  // Don't create connection during build time
  if (typeof window !== 'undefined' || 
      process.env.NEXT_PHASE === 'phase-production-build') {
    return null;
  }
  
  // Return null if no database host is configured
  const dbHost = process.env.DB_HOST;
  if (!dbHost) {
    return null;
  }
  
  try {
    const sql = postgres({
      host: dbHost,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'postgres',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      ssl: 'require',
      connect_timeout: 30,
      idle_timeout: 60,
      max: 5,
      onnotice: () => {}, // Suppress notices
    });
    
    return sql;
  } catch (error) {
    console.error('Database connection failed:', error);
    return null;
  }
}