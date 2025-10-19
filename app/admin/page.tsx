/**
 * Admin Dashboard Page
 * 
 * Main admin interface providing:
 * - Database summary statistics with clickable cards
 * - Quick action buttons for common tasks
 * - Quiz questions management (when page=quiz-questions)
 * - Real-time data from all database tables
 * 
 * Features:
 * - Responsive grid layout for statistics cards
 * - Navigation to all management sections
 * - Conditional rendering for quiz questions management
 * - Live database counts and user role breakdowns
 */
import AdminSidebar from './components/sidebar';
import DatabaseTables from './components/database-tables';
import ActivityPanel from './components/activity-panel';
import { getAllUsers, getAllQuizzes, getDatabaseSummary, getAllQuizQuestions, getAllQuestions, createQuizQuestionAction, deleteQuizQuestionAction, getAllSessionProgress, getAllProgress } from './lib/actions';
import Link from 'next/link';


/**
 * Admin Dashboard Component
 * @param {Object} searchParams - URL search parameters for conditional rendering
 * @returns {JSX.Element} - Admin dashboard interface
 */
export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ page?: string; view?: string }> }) {
  // Await search parameters for Next.js 15 compatibility
  const params = await searchParams;
  
  // Check database availability
  let users = [], quizzes = [], summary = { users: 0, content: 0, quizzes: 0, questions: 0, quiz_questions: 0, bookings: 0, progress: 0, session_progress: 0 };
  let dbAvailable = true;
  
  try {
    // Fetch core data for dashboard display in parallel
    [users, quizzes, summary] = await Promise.all([
      getAllUsers(),
      getAllQuizzes(),
      getDatabaseSummary()
    ]);
  } catch (error) {
    console.warn('Database not available:', error);
    dbAvailable = false;
  }
  
  // If database is not available, show local development mode
  if (!dbAvailable) {
    return (
      <div className="pt-16 flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Panel - Local Development Mode</h1>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Database Offline</h3>
              <p className="text-yellow-700">Connect to database to access full admin features</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-blue-600">👥 Users</h3>
                <div className="text-3xl font-bold text-gray-900">Demo Mode</div>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-green-600">📚 Content</h3>
                <div className="text-3xl font-bold text-gray-900">Demo Mode</div>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-purple-600">📝 Quizzes</h3>
                <div className="text-3xl font-bold text-gray-900">Demo Mode</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

  
  // Handle database tables page
  if (params.page === 'database') {
    return (
      <div className="pt-16 flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Database Tables</h1>
            <DatabaseTables />
          </div>
        </div>
      </div>
    );
  }
  
  // Handle session progress management page
  if (params.page === 'session-progress') {
    // Fetch session progress data
    const sessionProgress = await getAllSessionProgress();
    const users = await getAllUsers();
    const progress = await getAllProgress();
    
    // Handle view parameter for session progress details
    const viewSessionId = params.view ? parseInt(params.view) : null;
    const viewSession = viewSessionId ? sessionProgress.find(sp => sp.id === viewSessionId) : null;
    
    return (
      <div className="pt-16 flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {viewSession ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">User Progress Details</h1>
                  <Link href="/admin?page=session-progress" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Back to User Progress
                  </Link>
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Session ID</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewSession.id}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Student</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewSession.student_name}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Content</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewSession.content_name}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Session Number</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewSession.session_number}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Date</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{new Date(viewSession.session_date).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Completion</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewSession.completion}%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Score</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewSession.score}%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Grade</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewSession.grade}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Strengths</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">{viewSession.strengths}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Areas for Improvement</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">{viewSession.areas_for_improvement}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Student Reflection</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">{viewSession.student_reflection}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Tutor Feedback</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">{viewSession.tutor_feedback}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Homework</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">{viewSession.homework}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Next Lesson Plan</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">{viewSession.next_lesson_plan}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-6">User Progress Management</h1>
            
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">All User Progress Records</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session #</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sessionProgress.map((session) => (
                          <tr key={session.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.student_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.content_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.session_number}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(session.session_date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.completion}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.score}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.grade}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Link href={`/admin?page=session-progress&view=${session.id}`} className="text-green-600 hover:text-green-800 mr-2">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Handle quiz questions management page
  if (params.page === 'quiz-questions') {
    // Fetch additional data needed for quiz questions management in parallel
    const [quizQuestions, questions] = await Promise.all([
      getAllQuizQuestions(),
      getAllQuestions()
    ]);
    
    // Handle view parameter for quiz question details
    const viewQuizQuestionId = params.view ? `${params.view}` : null;
    const viewQuizQuestion = viewQuizQuestionId ? quizQuestions.find(qq => `${qq.quiz_id}-${qq.question_id}` === viewQuizQuestionId) : null;
    
    return (
      <div className="pt-16 flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {viewQuizQuestion ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Quiz Question Details</h1>
                  <Link href="/admin?page=quiz-questions" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Back to Quiz Questions
                  </Link>
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Quiz ID</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuizQuestion.quiz_id}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Question ID</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuizQuestion.question_id}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Quiz</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuizQuestion.quiz_name} ({viewQuizQuestion.quiz_code})</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Question</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">{viewQuizQuestion.question_text}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Question Type</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuizQuestion.question_type}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Order Number</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuizQuestion.order_num}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Marks</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuizQuestion.question_marks}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Correct Answer</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuizQuestion.correct_answer}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-6">Quiz Questions Management</h1>
            
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">All Quiz Questions</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {quizQuestions.map((quizQuestion) => (
                      <div key={`${quizQuestion.quiz_id}-${quizQuestion.question_id}`} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {quizQuestion.quiz_name} → Question #{quizQuestion.order_num}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-md">
                            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {quizQuestion.quiz_code}
                            </span>
                            <span className="ml-2">{quizQuestion.question_text}</span>
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{quizQuestion.question_marks} marks</span>
                          <div className="flex space-x-1">
                            <Link href={`/admin?page=quiz-questions&view=${quizQuestion.quiz_id}-${quizQuestion.question_id}`} className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border rounded">
                              View
                            </Link>
                            <form action={async () => {
                              'use server';
                              await deleteQuizQuestionAction(quizQuestion.quiz_id, quizQuestion.question_id);
                            }} className="inline">
                              <button type="submit" className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border rounded">
                                Remove
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium mb-4">Add Question to Quiz</h3>
                  <form action={createQuizQuestionAction} className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quiz</label>
                      <select name="quizId" className="border rounded px-3 py-2 w-full" required>
                        <option value="">Select Quiz</option>
                        {quizzes.map((quiz) => (
                          <option key={quiz.id} value={quiz.id}>{quiz.name} ({quiz.code})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                      <select name="questionId" className="border rounded px-3 py-2 w-full" required>
                        <option value="">Select Question</option>
                        {questions.map((question) => (
                          <option key={question.id} value={question.id}>
                            {question.text.substring(0, 50)}... ({question.marks} marks)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
                      <input name="orderNum" type="number" min="1" defaultValue="1" className="border rounded px-3 py-2 w-full" required />
                    </div>
                    <div className="col-span-3">
                      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Add Question to Quiz
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-16 flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Database Summary Cards */}
            <Link href="/admin/users" className="bg-white shadow rounded-lg p-6 block hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-blue-600">👥 Users</h3>
              <div className="text-3xl font-bold text-gray-900">{summary.users}</div>
              <div className="text-sm text-gray-500 mt-2">
                <div>Admins: {users.filter(u => u.role === 'admin').length}</div>
                <div>Tutors: {users.filter(u => u.role === 'tutor').length}</div>
                <div>Students: {users.filter(u => u.role === 'student').length}</div>
              </div>
            </Link>
            
            <Link href="/admin/content" className="bg-white shadow rounded-lg p-6 block hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-green-600">📚 Content</h3>
              <div className="text-3xl font-bold text-gray-900">{summary.content}</div>
              <div className="text-sm text-gray-500 mt-2">Learning materials</div>
            </Link>
            
            <Link href="/admin/users?page=quizzes" className="bg-white shadow rounded-lg p-6 block hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-purple-600">📝 Quizzes</h3>
              <div className="text-3xl font-bold text-gray-900">{summary.quizzes}</div>
              <div className="text-sm text-gray-500 mt-2">Assessment tools</div>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Link href="/admin/questions" className="bg-white shadow rounded-lg p-6 block hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-orange-600">❓ Questions</h3>
              <div className="text-3xl font-bold text-gray-900">{summary.questions}</div>
              <div className="text-sm text-gray-500 mt-2">Quiz questions</div>
            </Link>
            
            <Link href="/admin?page=quiz-questions" className="bg-white shadow rounded-lg p-6 block hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-yellow-600">🔗 Quiz Questions</h3>
              <div className="text-3xl font-bold text-gray-900">{summary.quiz_questions}</div>
              <div className="text-sm text-gray-500 mt-2">Question-quiz relationships</div>
            </Link>
            
            <Link href="/admin/bookings" className="bg-white shadow rounded-lg p-6 block hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-red-600">📅 Bookings</h3>
              <div className="text-3xl font-bold text-gray-900">{summary.bookings}</div>
              <div className="text-sm text-gray-500 mt-2">Tutoring sessions</div>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Link href="/admin/progress" className="bg-white shadow rounded-lg p-6 block hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-indigo-600">📊 Progress</h3>
              <div className="text-3xl font-bold text-gray-900">{summary.progress}</div>
              <div className="text-sm text-gray-500 mt-2">Student progress records</div>
            </Link>
            
            <Link href="/admin/user-progress" className="bg-white shadow rounded-lg p-6 block hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-teal-600">📈 User Progress</h3>
              <div className="text-3xl font-bold text-gray-900">{summary.session_progress || 0}</div>
              <div className="text-sm text-gray-500 mt-2">Individual session records</div>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Link href="/admin?page=database" className="bg-white shadow rounded-lg p-6 block hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-600">🗄️ Database Tables</h3>
              <div className="text-3xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-500 mt-2">View all database tables</div>
            </Link>
            <ActivityPanel />
          </div>
        </div>
      </div>
    </div>
  );
}