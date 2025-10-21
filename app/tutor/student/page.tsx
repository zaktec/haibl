import Link from 'next/link';
import { getStudentDetails, getStudentQuizAnswers } from '../lib/actions';
import { getDb } from '@/app/seed/db';
import { resetQuizProgressAction, createProgressAction, resetAllProgressAction } from '@/app/admin/lib/actions';
import Breadcrumb from '../breadcrumb';
import QuizInterface from '@/app/admin/users/QuizInterface';

export default async function StudentDetailPage({ searchParams }: { searchParams: Promise<{ id?: string; quiz?: string; answers?: string }> }) {
  const params = await searchParams;
  const id = params.id;
  const quizId = params.quiz ? parseInt(params.quiz) : null;
  const answersQuizId = params.answers ? parseInt(params.answers) : null;

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
  const content = await sql`SELECT id, name, content_type FROM content WHERE published = true ORDER BY name`;
  const quizzes = await sql`SELECT id, name, code FROM quizzes WHERE published = true ORDER BY name`;

  // If answers parameter is provided, show quiz answers
  if (answersQuizId && id) {
    const sql = getDb();
    const debugData = await sql`
      SELECT up.id, up.user_id, up.quiz_id, up.answers, up.answer_scores, up.score, up.status,
             q.name as quiz_name, q.code as quiz_code
      FROM user_progress up
      LEFT JOIN quizzes q ON up.quiz_id = q.id
      WHERE up.user_id = ${id} AND up.quiz_id = ${answersQuizId}
    `;
    
    if (debugData.length === 0) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">No Quiz Data Found</h1>
          <p>No quiz answers found for user {id}, quiz {answersQuizId}</p>
        </div>
      );
    }
    
    const quizData = debugData[0];

    
    const questions = await sql`
      SELECT qs.id, qs.text, qs.correct_answer, qs.marks, qq.order_num
      FROM questions qs
      JOIN quiz_questions qq ON qs.id = qq.question_id
      WHERE qq.quiz_id = ${answersQuizId}
      ORDER BY qq.order_num
    `;
    
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">
            {quizData.quiz_name} ({quizData.quiz_code}) - Student Progress
          </h1>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded text-sm font-medium ${
              quizData.status === 'completed' ? 'bg-green-100 text-green-800' :
              quizData.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {quizData.status || 'Not Started'}
            </span>
            {quizData.score && <span className="text-lg font-semibold">Score: {quizData.score}%</span>}
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question: any) => {
            const questionId = question.id.toString();
            const studentAnswer = quizData.answers?.[questionId] || {};
            const answerScore = quizData.answer_scores?.[questionId];
            const hasAttempted = studentAnswer.working_out || studentAnswer.final_answer;
            
            return (
              <div key={question.id} className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Q{question.order_num}</span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">{question.marks} marks</span>
                    {answerScore && (
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        answerScore.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {answerScore.is_correct ? '✓ Correct' : '✗ Incorrect'} ({answerScore.marks_awarded}/{answerScore.max_marks})
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 mb-4">{question.text}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Student's Working:</h4>
                    <div className="bg-gray-50 p-3 rounded border min-h-[80px]">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {studentAnswer?.working_out || 'No working shown'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Student's Answer:</h4>
                    <div className={`p-3 rounded border min-h-[80px] ${
                      answerScore?.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <p className="text-sm font-medium">
                        {studentAnswer?.final_answer || 'No answer provided'}
                      </p>
                      {studentAnswer?.need_help && (
                        <p className="text-xs text-orange-600 mt-1">🆘 Student requested help</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Correct Answer:</h4>
                    <div className="bg-green-50 border border-green-200 p-3 rounded min-h-[80px]">
                      <p className="text-sm font-medium text-green-800">
                        {question.correct_answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
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
              studentId={parseInt(id)}
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
      
      {params.assigned === 'true' && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ Content assigned successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">
            {student.first_name} {student.last_name}
          </h1>
          <form action={async () => {
            'use server';
            await resetAllProgressAction(parseInt(id));
          }} className="inline">
            <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm">
              🔄 Reset All Progress
            </button>
          </form>
        </div>

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
                    <div className="space-y-1">
                      <Link href={`/tutor/student?id=${student.id}&quiz=${item.quiz_id}`} className="text-blue-600 hover:underline text-sm block">
                        📝 {item.quiz_name}
                      </Link>
                      <Link href={`/tutor/student?id=${student.id}&answers=${item.quiz_id}`} className="text-green-600 hover:underline text-xs block">
                        👁️ View Progress
                      </Link>
                    </div>
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
        <div className="bg-white rounded-lg shadow p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">📚 Assign Content</h2>
          <form action={async (formData: FormData) => {
            'use server';
            const result = await createProgressAction(formData);
            if (result?.success) {
              return (
                <script dangerouslySetInnerHTML={{
                  __html: `
                    document.getElementById('notification').classList.remove('hidden');
                    setTimeout(() => {
                      document.getElementById('notification').classList.add('hidden');
                    }, 3000);
                  `
                }} />
              );
            }
          }} className="space-y-4">
            <input type="hidden" name="userId" value={student.id} />
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Type *</label>
                <select name="assignmentType" className="w-full border rounded px-3 py-2" required>
                  <option value="">Select Type</option>
                  <option value="content">📖 Content (Lesson/Topic)</option>
                  <option value="quiz">📝 Quiz Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <select name="contentId" className="w-full border rounded px-3 py-2">
                  <option value="">Select Content (Optional for Quiz)</option>
                  {content.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.content_type === 'lesson' ? '📖' : item.content_type === 'quiz' ? '📝' : '📚'} {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quiz</label>
                <select name="quizId" className="w-full border rounded px-3 py-2">
                  <option value="">Select Quiz (Optional for Content)</option>
                  {quizzes.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>📝 {quiz.name} ({quiz.code})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select name="status" className="w-full border rounded px-3 py-2" required>
                  <option value="assigned">📋 Assigned</option>
                  <option value="not_started">⏸️ Not Started</option>
                  <option value="in_progress">🔄 In Progress</option>
                  <option value="review">👀 Under Review</option>
                  <option value="completed">✅ Completed</option>
                  <option value="needs_help">🆘 Needs Help</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Completion %</label>
                <input name="completion" type="number" placeholder="0-100" className="w-full border rounded px-3 py-2" min="0" max="100" defaultValue="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select name="priority" className="w-full border rounded px-3 py-2">
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                  <option value="urgent">🚨 Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input name="dueDate" type="date" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                <input name="estimatedHours" type="number" placeholder="Hours" className="w-full border rounded px-3 py-2" min="0" step="0.5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Notes</label>
              <textarea name="notes" placeholder="Add instructions, objectives, or special requirements..." className="w-full border rounded px-3 py-2" rows={3}></textarea>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input name="sendNotification" type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700">📧 Send notification to student</span>
              </label>
              <label className="flex items-center space-x-2">
                <input name="trackProgress" type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700">📊 Enable progress tracking</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 flex items-center space-x-2">
                <span>📚</span>
                <span>Assign Content</span>
              </button>
            </div>
            
            <div id="notification" className="hidden mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              ✅ Content assigned successfully!
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}