export async function seedUserProgress(sql: any, studentUsers: any[], content: any[], quizzes: any[]) {
  return await sql`
    INSERT INTO user_progress (user_id, content_id, quiz_id, completion, status, grade, score, completed, sessions_count, answers, answer_scores) VALUES
    (${studentUsers[0].id}, ${content[0].id}, NULL, 85, 'completed', 7.5, 85, true, 3, '{}', '{}'),
    (${studentUsers[0].id}, ${content[1].id}, NULL, 60, 'in_progress', NULL, NULL, false, 2, '{}', '{}'),
    (${studentUsers[0].id}, ${content[content.length - 1].id}, ${quizzes[0].id}, 75, 'completed', 6.0, 75, true, 1, '{"1": "2² × 5³", "2": "1 17/12", "3": "2^-1", "4": "0.00128"}', '{"1": true, "2": false, "3": true, "4": true}'),
    (${studentUsers[1].id}, ${content[0].id}, NULL, 90, 'completed', 8.0, 90, true, 2, '{}', '{}'),
    (${studentUsers[1].id}, ${content[2].id}, NULL, 45, 'in_progress', NULL, NULL, false, 1, '{}', '{}'),
    (${studentUsers[2].id}, ${content[0].id}, NULL, 30, 'assigned', NULL, NULL, false, 0, '{}', '{}'),
    (${studentUsers[2].id}, ${content[1].id}, NULL, 0, 'not_started', NULL, NULL, false, 0, '{}', '{}')
    RETURNING id
  `;
}