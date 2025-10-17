import { getDb } from '../../seed/db.js';

const sql = getDb();

export async function getStudentProgress(studentId: number) {
  const result = await sql`
    SELECT c.name, up.completion, up.status, up.grade, up.score, up.quiz_id
    FROM user_progress up
    JOIN content c ON up.content_id = c.id
    WHERE up.user_id = ${studentId}
    ORDER BY up.updated_at DESC
  `;
  return result;
}

export async function getStudentBookings(studentId: number) {
  const result = await sql`
    SELECT b.*, u.first_name as tutor_first_name, u.last_name as tutor_last_name
    FROM bookings b
    JOIN users u ON b.tutor_id = u.id
    WHERE b.student_id = ${studentId}
    ORDER BY b.scheduled_start DESC
  `;
  return result;
}

export async function getQuizQuestions(quizId: number) {
  const result = await sql`
    SELECT q.*, qq.order_num
    FROM questions q
    JOIN quiz_questions qq ON q.id = qq.question_id
    WHERE qq.quiz_id = ${quizId}
    ORDER BY qq.order_num
  `;
  return result;
}

export async function getQuizDetails(quizId: number) {
  const result = await sql`
    SELECT * FROM quizzes WHERE id = ${quizId}
  `;
  return result[0];
}