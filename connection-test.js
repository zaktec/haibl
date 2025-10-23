import { Pool } from 'pg';

async function testConnection() {
  const envCheck = {
    DB_HOST: process.env.DB_HOST || 'MISSING',
    DB_PORT: process.env.DB_PORT || 'MISSING',
    DB_NAME: process.env.DB_NAME || 'MISSING', 
    DB_USER: process.env.DB_USER || 'MISSING',
    DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'MISSING'
  };
  
  console.log('Environment variables:', envCheck);
  
  if (!process.env.DB_HOST) {
    console.error('❌ DB_HOST is missing');
    return;
  }
  
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });
  
  try {
    console.log('🔌 Connecting to:', process.env.DB_HOST);
    
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT NOW() as time, current_database() as db');
    console.log('Connection info:', result.rows[0]);
    
    client.release();
    console.log('🎉 Database test completed!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
  } finally {
    await pool.end();
  }
}

testConnection();