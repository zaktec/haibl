import { getDb } from '../../seed/db';

export async function getStudents() {
  const sql = getDb();
  if (!sql) return [];
  const result = await sql`
    SELECT id, first_name, last_name, email, year_group, target_grade, school, parents_name
    FROM users 
    WHERE role = 'student'
    ORDER BY first_name, last_name
  `;
  return result;
}

export async function getTutorInfo(tutorId: number) {
  const sql = getDb();
  if (!sql) return null;
  const result = await sql`
    SELECT first_name, last_name, email FROM users WHERE id = ${tutorId} AND role = 'tutor'
  `;
  return result[0];
}

export async function getTutorBookingsCount(tutorId: number) {
  const sql = getDb();
  if (!sql) return 0;
  const result = await sql`
    SELECT COUNT(*) as count FROM bookings WHERE tutor_id = ${tutorId}
  `;
  return result[0]?.count || 0;
}

export async function getTutorUpcomingBookings(tutorId: number) {
  const sql = getDb();
  if (!sql) return 0;
  const result = await sql`
    SELECT COUNT(*) as count FROM bookings 
    WHERE tutor_id = ${tutorId} AND scheduled_start > NOW() AND status = 'confirmed'
  `;
  return result[0]?.count || 0;
}

export async function getStudentDetails(id: string) {
  const sql = getDb();
  if (!sql) return null;
  const studentResult = await sql`
    SELECT id, first_name, last_name, email, year_group, target_grade, school, parents_name, created_at
    FROM users 
    WHERE id = ${id} AND role = 'student'
  `;

  if (studentResult.length === 0) return null;

  const progressResult = await sql`
    SELECT up.id, c.name as content_name, up.completion, up.status, up.grade, up.score, up.quiz_id, up.created_at, up.updated_at,
           q.name as quiz_name, q.code as quiz_code
    FROM user_progress up
    LEFT JOIN content c ON up.content_id = c.id
    LEFT JOIN quizzes q ON up.quiz_id = q.id
    WHERE up.user_id = ${id}
    ORDER BY up.updated_at DESC
  `;

  const bookingsResult = await sql`
    SELECT id, scheduled_start, scheduled_end, status
    FROM bookings
    WHERE student_id = ${id}
    ORDER BY scheduled_start DESC
  `;

  return {
    student: studentResult[0],
    progress: progressResult,
    bookings: bookingsResult
  };
}

export async function getStudentQuizAnswers(userId: string, quizId: number) {
  const sql = getDb();
  if (!sql) return null;
  
  const result = await sql`
    SELECT up.answers, up.answer_scores, up.score, up.status, up.updated_at,
           q.name as quiz_name, q.code as quiz_code
    FROM user_progress up
    LEFT JOIN quizzes q ON up.quiz_id = q.id
    WHERE up.user_id = ${userId} AND up.quiz_id = ${quizId}
  `;
  
  if (result.length === 0) return null;
  
  // Get quiz questions for context
  const questions = await sql`
    SELECT qs.id, qs.text, qs.correct_answer, qs.marks, qq.order_num
    FROM questions qs
    JOIN quiz_questions qq ON qs.id = qq.question_id
    WHERE qq.quiz_id = ${quizId}
    ORDER BY qq.order_num
  `;
  
  return {
    ...result[0],
    questions
  };
}