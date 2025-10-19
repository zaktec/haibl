import { getDb } from '../seed/db';

export default async function DatabaseStatus() {
  let status = 'Unknown';
  let host = 'Not configured';
  let error = null;
  let tableCount = 0;

  try {
    const sql = getDb();
    
    if (!sql) {
      status = 'No database configured';
    } else {
      host = process.env.RDS_HOST || process.env.DB_HOST || 'localhost';
      
      const result = await sql`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      tableCount = parseInt(result[0].count);
      status = 'Connected to AWS RDS';
    }
  } catch (err: any) {
    status = 'Connection failed';
    error = err.message;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Database Status</h1>
      
      <div className="bg-white rounded-lg border p-4 mb-4">
        <h2 className="font-semibold mb-2">Connection Status</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><strong>Status:</strong> {status}</div>
          <div><strong>Host:</strong> {host}</div>
          <div><strong>Tables:</strong> {tableCount}</div>
          <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
        </div>
        
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border p-4">
        <h2 className="font-semibold mb-2">Environment Variables</h2>
        <div className="text-xs space-y-1">
          <div>DB_HOST: {process.env.DB_HOST ? '✓' : '✗'}</div>
          <div>RDS_HOST: {process.env.RDS_HOST ? '✓' : '✗'}</div>
        </div>
      </div>
    </div>
  );
}