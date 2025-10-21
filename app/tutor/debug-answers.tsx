import { getDb } from '@/app/seed/db';

export default async function DebugQuizAnswers() {
  const sql = getDb();
  if (!sql) return <div>No database connection</div>;

  const progress = await sql`
    SELECT up.id, up.user_id, up.quiz_id, up.answers, up.answer_scores, up.score, up.status,
           u.first_name, u.last_name, q.name as quiz_name
    FROM user_progress up
    LEFT JOIN users u ON up.user_id = u.id
    LEFT JOIN quizzes q ON up.quiz_id = q.id
    WHERE up.user_id = 6 AND up.quiz_id = 1
  `;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quiz Answers Debug - User 6, Quiz 1</h1>
      
      {progress.length === 0 ? (
        <p>No quiz answers found for user 6, quiz 1</p>
      ) : (
        <div className="space-y-4">
          {progress.map((item: any) => (
            <div key={item.id} className="bg-white border rounded p-4">
              <h3 className="font-bold">
                User {item.user_id} ({item.first_name} {item.last_name}) - Quiz {item.quiz_id} ({item.quiz_name})
              </h3>
              <p>Status: {item.status} | Score: {item.score}%</p>
              <pre className="bg-gray-100 p-2 mt-2 text-xs overflow-auto">
                Answers: {JSON.stringify(item.answers, null, 2)}
              </pre>
              <pre className="bg-gray-100 p-2 mt-2 text-xs overflow-auto">
                Scores: {JSON.stringify(item.answer_scores, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}