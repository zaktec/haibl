const { Pool } = require('pg');

console.log('🔧 Testing database connection from Amplify...');

const envCheck = {
  DB_HOST: process.env.DB_HOST || 'MISSING',
  DB_PORT: process.env.DB_PORT || 'MISSING',
  DB_NAME: process.env.DB_NAME || 'MISSING', 
  DB_USER: process.env.DB_USER || 'MISSING',
  DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'MISSING'
};

console.log('Environment variables:', envCheck);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000
});

async function testConnection() {
  try {
    console.log('🔌 Connecting to:', process.env.DB_HOST);
    
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query(`
      SELECT 
        NOW() as connection_time,
        current_database() as db_name,
        current_user as db_user,
        version() as postgres_version
    `);
    
    console.log('Connection info:', result.rows[0]);
    
    client.release();
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
  } finally {
    await pool.end();
  }
}

testConnection();