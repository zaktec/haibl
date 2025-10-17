import { getDb } from '../../seed/db';

async function getAllTables() {
  const sql = getDb();

  const tables = {};

  try {
    tables.users = await sql`SELECT * FROM users ORDER BY id`;
  } catch (e) { tables.users = []; }

  try {
    tables.content = await sql`SELECT * FROM content ORDER BY id`;
  } catch (e) { tables.content = []; }

  try {
    tables.questions = await sql`SELECT * FROM questions ORDER BY id`;
  } catch (e) { tables.questions = []; }

  try {
    tables.quizzes = await sql`SELECT * FROM quizzes ORDER BY id`;
  } catch (e) { tables.quizzes = []; }

  try {
    tables.quiz_questions = await sql`SELECT * FROM quiz_questions ORDER BY quiz_id, question_id`;
  } catch (e) { tables.quiz_questions = []; }

  try {
    tables.bookings = await sql`SELECT * FROM bookings ORDER BY id`;
  } catch (e) { tables.bookings = []; }

  try {
    tables.user_progress = await sql`SELECT * FROM user_progress ORDER BY id`;
  } catch (e) { tables.user_progress = []; }

  try {
    tables.user_session_progress = await sql`SELECT * FROM user_session_progress ORDER BY id`;
  } catch (e) { tables.user_session_progress = []; }

  return tables;
}

export default async function DatabaseTables() {
  const tables = await getAllTables();

  return (
    <div className="space-y-8">
      {Object.entries(tables).map(([tableName, data]) => (
        <div key={tableName} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {tableName.replace('_', ' ')} ({data.length} records)
            </h3>
          </div>

          {data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(data[0]).map((column) => (
                      <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.slice(0, 10).map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {value === null ? (
                            <span className="text-gray-400 italic">null</span>
                          ) : typeof value === 'boolean' ? (
                            value ? '✓' : '✗'
                          ) : typeof value === 'object' ? (
                            JSON.stringify(value)
                          ) : (
                            String(value).length > 50 ? String(value).substring(0, 50) + '...' : String(value)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 10 && (
                <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500 text-center">
                  Showing first 10 of {data.length} records
                </div>
              )}
            </div>
          ) : (
            <div className="px-6 py-4 text-gray-500 text-center">
              No records found
            </div>
          )}
        </div>
      ))}
    </div>
  );
}