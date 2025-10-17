import Link from 'next/link';
import { getStudentDetails } from '../lib/actions';
import { getDb } from '@/app/seed/db';
import { resetQuizProgressAction, createProgressAction } from '@/app/admin/lib/actions';
import Breadcrumb from '../breadcrumb';
import QuizInterface from '@/app/admin/users/QuizInterface';

export default async function StudentDetailPage({ searchParams }: { searchParams: Promise<{ id?: string; quiz?: string }> }) {
  const params = await searchParams;
  const id = params.id;
  const quizId = params.quiz ? parseInt(params.quiz) : null;

  if (!id) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Link href="/tutor" className="text-blue-600 hover:underline">
            ← Back to Students
          </Link>
        </div>
        <p>No student ID provided</p>
      </div>
    );
  }

  const data = await getStudentDetails(id);

  if (!data) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Link href="/tutor" className="text-blue-600 hover:underline">
            ← Back to Students
          </Link>
        </div>
        <p>Student not found</p>
      </div>
    );
  }

  const { student, progress, bookings } = data;

  // Get content and quizzes for assignment
  const sql = getDb();
  const content = await sql`SELECT id, name FROM content WHERE published = true ORDER BY name`;
  const quizzes = await sql`SELECT id, name, code FROM quizzes WHERE published = true ORDER BY name`;

  // If quiz parameter is provided, show quiz interface
  if (quizId) {
    const quizWithQuestions = await sql`
      SELECT 
        q.id as quiz_id,
        q.name as quiz_name,
        q.code as quiz_code,
        q.time_limit,
        q.published,
        q.calculator_allowed,
        qs.id as question_id,
        qs.text as question_text,
        qs.type as question_type,
        qs.correct_answer,
        qs.marks as question_marks,
        qs.image_url,
        qq.order_num
      FROM quizzes q
      JOIN quiz_questions qq ON q.id = qq.quiz_id
      JOIN questions qs ON qq.question_id = qs.id
      WHERE q.id = ${quizId}
      ORDER BY qq.order_num
    `;

    if (quizWithQuestions.length > 0) {
      return (
        <div className="p-6">
          <Breadcrumb items={[
            { label: 'Dashboard', href: '/tutor' },
            { label: `${student.first_name} ${student.last_name}`, href: `/tutor/student?id=${id}` },
            { label: quizWithQuestions[0].quiz_name }
          ]} />

          <div className="bg-white rounded-lg shadow">
            <QuizInterface 
              quizWithQuestions={quizWithQuestions} 
              quizDetailsId={quizId} 
              resetQuizAction={async () => {
                'use server';
                await resetQuizProgressAction(parseInt(id), quizId);
              }}
              userRole="tutor"
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="p-6">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/tutor' },
        { label: `${student.first_name} ${student.last_name}` }
      ]} />

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">
          {student.first_name} {student.last_name}
        </h1>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Year Group:</strong> {student.year_group}</p>
            <p><strong>Target Grade:</strong> {student.target_grade}</p>
          </div>
          <div>
            <p><strong>School:</strong> {student.school}</p>
            <p><strong>Parent/Guardian:</strong> {student.parents_name}</p>
            <p><strong>Joined:</strong> {new Date(student.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
          {progress.length > 0 ? (
            <div className="space-y-3">
              {progress.map((item, index) => (
                <div key={index} className="border-b pb-3">
                  <h3 className="font-medium">{item.content_name}</h3>
                  {item.quiz_name && (
                    <Link href={`/tutor/student?id=${student.id}&quiz=${item.quiz_id}`} className="text-blue-600 hover:underline text-sm">
                      📝 {item.quiz_name}
                    </Link>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Status: {item.status}</span>
                    <span>Progress: {item.completion}%</span>
                  </div>
                  {item.grade && (
                    <p className="text-sm">Grade: {item.grade} | Score: {item.score}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No progress recorded yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Session History</h2>
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="border-b pb-3">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {new Date(booking.scheduled_start).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Session #{booking.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.scheduled_start).toLocaleTimeString()} -
                    {new Date(booking.scheduled_end).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No sessions booked yet</p>
          )}
        </div>
        
        {/* Assign Content Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Assign Content</h2>
          <form action={async (formData: FormData) => {
            'use server';
            await createProgressAction(formData);
          }} className="grid grid-cols-2 gap-4">
            <input type="hidden" name="userId" value={student.id} />
            <select name="contentId" className="border rounded px-3 py-2" required>
              <option value="">Select Content</option>
              {content.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <select name="quizId" className="border rounded px-3 py-2">
              <option value="">Select Quiz (Optional)</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>{quiz.name} ({quiz.code})</option>
              ))}
            </select>
            <select name="status" className="border rounded px-3 py-2" required>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <input name="completion" type="number" placeholder="Completion %" className="border rounded px-3 py-2" min="0" max="100" defaultValue="0" />
            <div className="col-span-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Assign Content
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}