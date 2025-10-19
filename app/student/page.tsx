import Link from 'next/link';
import { getDb } from '@/app/seed/db';
import ExpandableSection from './ExpandableSection';
import { saveQuizAnswersAction, resetQuizProgressAction } from '@/app/admin/lib/actions';

export default async function StudentDashboard({ searchParams }: { searchParams: Promise<{ quiz?: string }> }) {
  const params = await searchParams;
  const quizId = params.quiz ? parseInt(params.quiz) : null;
  // For demo purposes, using student user ID 6 (Emma Wilson)
  // In a real app, this would come from session/authentication
  const sql = getDb();
  
  // Handle case where database is not available (local development)
  if (!sql) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, Student</h1>
                <p className="text-gray-600">Local Development Mode - Database Offline</p>
              </div>
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
                Logout
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-500 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Current Grade</h3>
                <p className="text-3xl font-bold">B+</p>
                <p className="text-sm opacity-90">Mathematics</p>
              </div>
              
              <div className="bg-green-500 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Lessons Completed</h3>
                <p className="text-3xl font-bold">24</p>
                <p className="text-sm opacity-90">This semester</p>
              </div>
              
              <div className="bg-orange-500 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Next Session</h3>
                <p className="text-3xl font-bold">2</p>
                <p className="text-sm opacity-90">Days away</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Student dashboard is working! 🎉</p>
              <p className="text-sm text-gray-500">Connect to database to see full features</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  let user, bookings, progress, sessionProgress, todoItems;
  
  try {
    user = await sql`
      SELECT first_name, last_name, email, school, year_group, target_grade
      FROM users 
      WHERE id = 6 AND role = 'student'
      LIMIT 1
    `;
    
    bookings = await sql`
      SELECT b.*, 
             t.first_name as tutor_first_name, 
             t.last_name as tutor_last_name
      FROM bookings b
      LEFT JOIN users t ON b.tutor_id = t.id
      WHERE b.student_id = 6
      ORDER BY b.scheduled_start DESC
    `;
    
    progress = await sql`
      SELECT up.*, c.name as content_name, q.name as quiz_name
      FROM user_progress up
      LEFT JOIN content c ON up.content_id = c.id
      LEFT JOIN quizzes q ON up.quiz_id = q.id
      WHERE up.user_id = 6
      ORDER BY up.updated_at DESC
    `;
    
    sessionProgress = await sql`
      SELECT usp.*, c.name as content_name
      FROM user_session_progress usp
      JOIN user_progress up ON usp.user_progress_id = up.id
      LEFT JOIN content c ON up.content_id = c.id
      WHERE up.user_id = 6
      ORDER BY usp.session_date DESC
      LIMIT 5
    `;
    
    todoItems = await sql`
      SELECT up.*, c.name as content_name, q.name as quiz_name
      FROM user_progress up
      LEFT JOIN content c ON up.content_id = c.id
      LEFT JOIN quizzes q ON up.quiz_id = q.id
      WHERE up.user_id = 6 AND up.status IN ('assigned', 'not_started', 'in_progress')
      ORDER BY up.created_at ASC
    `;
  } catch (error) {
    console.error('Database query failed:', error);
    // Fallback to empty arrays
    user = [];
    bookings = [];
    progress = [];
    sessionProgress = [];
    todoItems = [];
  }
  
  const currentUser = user[0];
  
  // If quiz parameter is provided, get quiz data
  let quizWithQuestions = null;
  if (quizId) {
    quizWithQuestions = await sql`
      SELECT 
        q.id as quiz_id,
        q.name as quiz_name,
        q.code as quiz_code,
        q.time_limit,
        q.published,
        q.calculator_allowed,
        q.content_id,
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
  }
  
  // If quiz is requested, show quiz interface
  if (quizId && quizWithQuestions && quizWithQuestions.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Take Quiz</h1>
            <Link href="/student" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Back to Dashboard
            </Link>
          </div>
          
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">📋 Exam Instructions</h2>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• Read each question carefully before answering</p>
              <p>• Show all your working in the "Working Out" section</p>
              <p>• Write your final answer clearly in the "Final Answer" section</p>
              <p>• Check "Need help with this question" if you're stuck</p>
              <p>• You can submit your answers at any time using the "Submit Answers" button</p>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-blue-300">
                <div><span className="font-medium">Time Limit:</span> {quizWithQuestions[0]?.time_limit} minutes</div>
                <div><span className="font-medium">Questions:</span> {quizWithQuestions.length}</div>
                <div><span className="font-medium">Calculator:</span> {quizWithQuestions[0]?.calculator_allowed ? 'Allowed' : 'Not Allowed'}</div>
              </div>
            </div>
          </div>
          
          {/* Questions Form */}
          <form action={async (formData: FormData) => {
            'use server';
            await saveQuizAnswersAction(formData);
          }}>
            <input type="hidden" name="userId" value="6" />
            <input type="hidden" name="quizId" value={quizId} />
            <input type="hidden" name="contentId" value={quizWithQuestions[0]?.content_id || ''} />
            
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Questions ({quizWithQuestions.length})</h2>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Submit Answers
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {quizWithQuestions.map((item) => (
                  <div key={item.question_id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Q{item.order_num}</span>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">{item.question_marks} marks</span>
                        </div>
                        <div className="text-sm mb-3 font-medium">{item.question_text}</div>
                        
                        {/* Question Image */}
                        {item.image_url && (
                          <div className="mb-4">
                            <img 
                              src={item.image_url} 
                              alt={`Question ${item.order_num} diagram`}
                              className="max-w-full h-auto border border-gray-300 rounded"
                            />
                          </div>
                        )}
                        
                        {/* Working Out and Answer Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Working Out:</label>
                            <textarea 
                              name={`working_out_${item.question_id}`}
                              placeholder="Show your working here..."
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={4}
                            ></textarea>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Final Answer:</label>
                            <textarea 
                              name={`final_answer_${item.question_id}`}
                              placeholder="Your final answer..."
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                            ></textarea>
                          </div>
                        </div>
                        
                        {/* Need Help Option */}
                        <div className="mb-3">
                          <label className="flex items-center space-x-2 text-sm">
                            <input 
                              type="checkbox" 
                              name={`need_help_${item.question_id}`}
                              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-orange-600 font-medium">Need help with this question</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Submit button at bottom */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button type="submit" className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium">
                Submit All Answers
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.first_name || 'Emma'} {currentUser?.last_name || 'Wilson'}</h1>
              <p className="text-gray-600">{currentUser?.school || 'Greenfield High School'} • Year {currentUser?.year_group || '10'} • Target Grade: {currentUser?.target_grade || '7'}</p>
            </div>
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
              Logout
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-500 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Current Grade</h3>
              <p className="text-3xl font-bold">B+</p>
              <p className="text-sm opacity-90">Mathematics</p>
            </div>
            
            <div className="bg-green-500 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Lessons Completed</h3>
              <p className="text-3xl font-bold">24</p>
              <p className="text-sm opacity-90">This semester</p>
            </div>
            
            <div className="bg-orange-500 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Next Session</h3>
              <p className="text-3xl font-bold">2</p>
              <p className="text-sm opacity-90">Days away</p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {/* To Do - Now at the top */}
            <div className="border rounded-lg p-6 bg-orange-50 border-orange-200">
              <h3 className="text-lg font-semibold mb-4 text-orange-800">📋 To Do</h3>
              <div className="space-y-3">
                {todoItems.length > 0 ? (
                  todoItems.map((item) => (
                    <div key={item.id} className="p-3 bg-white rounded border-l-4 border-orange-400">
                      {item.quiz_id ? (
                        <Link href={`/student?quiz=${item.quiz_id}`} className="block hover:bg-gray-50 -m-3 p-3 rounded">
                          <div className="font-medium text-blue-600 hover:text-blue-800">{item.content_name}</div>
                          <div className="text-xs text-blue-600">Quiz: {item.quiz_name} - Click to take exam</div>
                          <div className="flex justify-between items-center mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.status === 'assigned' ? 'bg-red-100 text-red-800' :
                              item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                            <div className="text-sm text-gray-600">{item.completion}% done</div>
                          </div>
                        </Link>
                      ) : (
                        <>
                          <div className="font-medium">{item.content_name}</div>
                          <div className="flex justify-between items-center mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.status === 'assigned' ? 'bg-red-100 text-red-800' :
                              item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                            <div className="text-sm text-gray-600">{item.completion}% done</div>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-4">All caught up! 🎉</div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Progress - Now First */}
              <ExpandableSection title="My Progress" totalCount={progress.length} initialLimit={3}>
                {progress.length > 0 ? (
                  progress.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <span className={`mr-3 ${
                          item.status === 'completed' ? 'text-green-600' :
                          item.status === 'in_progress' ? 'text-blue-600' :
                          'text-gray-400'
                        }`}>
                          {item.status === 'completed' ? '✓' : 
                           item.status === 'in_progress' ? '📚' : '○'}
                        </span>
                        <div>
                          <div className="font-medium">{item.content_name}</div>
                          {item.quiz_name && (
                            <div className="text-xs text-blue-600">Quiz: {item.quiz_name}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">{item.completion}%</div>
                        {item.score && (
                          <div className="text-gray-500">Score: {item.score}%</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-4">No progress data available</div>
                )}
              </ExpandableSection>
              
              {/* Previous Sessions - Now Second */}
              <ExpandableSection title="Previous Sessions" totalCount={sessionProgress.length} initialLimit={3}>
                {sessionProgress.length > 0 ? (
                  sessionProgress.map((session) => (
                    <div key={session.id} className="p-3 bg-gray-50 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{session.content_name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(session.session_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div>Session {session.session_number} - {new Date(session.session_date).toLocaleDateString()}</div>
                          {session.score && <div>Score: {session.score}%</div>}
                          {session.grade && <div>Grade: {session.grade}</div>}
                        </div>
                        <div>
                          {session.tutor_feedback && (
                            <div><span className="font-medium">Feedback:</span> {session.tutor_feedback}</div>
                          )}
                          {session.homework && (
                            <div><span className="font-medium">Homework:</span> {session.homework}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-4">No previous sessions</div>
                )}
              </ExpandableSection>
            </div>
          </div>



          
          {/* Bookings and Progress Overview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">My Bookings</h3>
              <div className="space-y-3 text-sm">
                {bookings.length > 0 ? (
                  bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{booking.session_type} Session</div>
                        <div className="text-gray-500">with {booking.tutor_first_name} {booking.tutor_last_name}</div>
                        <div className="text-xs text-gray-400">{booking.delivery_mode} • {booking.location || 'Online'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{new Date(booking.scheduled_start).toLocaleDateString()}</div>
                        <div className="text-gray-500">{new Date(booking.scheduled_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-4">No bookings found</div>
                )}
              </div>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Progress Overview</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{progress.length > 0 ? Math.round(progress.reduce((acc, item) => acc + item.completion, 0) / progress.length) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${progress.length > 0 ? Math.round(progress.reduce((acc, item) => acc + item.completion, 0) / progress.length) : 0}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}