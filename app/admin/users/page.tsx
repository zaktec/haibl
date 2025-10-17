/**
 * User Management Page
 * 
 * Admin page for viewing and managing all users in the system.
 * Displays user information including name, email, role, and creation date.
 * Includes CRUD operations: Create, Read, Update, Delete users.
 */
import AdminSidebar from '@/app/admin/components/sidebar';
import { getAllUsers, deleteUserAction, createUserAction, updateUserAction, getAllQuizzes, getAllContent, createQuizAction, updateQuizAction, deleteQuizAction, getQuizWithQuestions, saveQuizAnswersAction, getUserRelatedData, resetQuizProgressAction, createProgressAction } from '@/app/admin/lib/actions';
import Link from 'next/link';
import ViewButton from './ViewButton';
import Breadcrumb from '../components/breadcrumb';
import QuizInterface from './QuizInterface';

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ view?: string; edit?: string; page?: string; quiz?: string; user?: string }> }) {
  // Await searchParams for Next.js 15 compatibility
  const params = await searchParams;
  
  // Fetch all users from database using centralized query function
  const users = await getAllUsers();
  const quizzes = await getAllQuizzes();
  const content = await getAllContent();
  const viewUserId = params.view ? parseInt(params.view) : null;
  const editUserId = params.edit ? parseInt(params.edit) : null;
  const viewUser = viewUserId ? users.find(u => Number(u.id) === Number(viewUserId)) : null;
  const editUser = editUserId ? users.find(u => Number(u.id) === Number(editUserId)) : null;
  
  // Get related data for user view
  const userRelatedData = viewUserId ? await getUserRelatedData(viewUserId) : null;
  
  // Quiz view/edit logic
  const viewQuizId = params.view && params.page === 'quizzes' ? parseInt(params.view) : null;
  const editQuizId = params.edit && params.page === 'quizzes' ? parseInt(params.edit) : null;
  const viewQuiz = viewQuizId ? quizzes.find(q => Number(q.id) === Number(viewQuizId)) : null;
  const editQuiz = editQuizId ? quizzes.find(q => Number(q.id) === Number(editQuizId)) : null;
  
  // Quiz details with questions
  const quizDetailsId = params.quiz ? parseInt(params.quiz) : null;
  const quizWithQuestions = quizDetailsId ? await getQuizWithQuestions(quizDetailsId) : null;

  return (
    // Main container: accounts for fixed header (pt-16), full height, flex layout
    <div className="pt-16 flex h-screen bg-gray-50">
      {/* Admin sidebar with navigation */}
      <AdminSidebar />
      
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Page title */}
          {params.page === 'quizzes' && editQuiz ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Quiz</h1>
                <Link href="/admin/users?page=quizzes" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Cancel
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <form action={async (formData: FormData) => {
                  'use server';
                  await updateQuizAction(editQuiz.id, formData);
                }} className="grid grid-cols-2 gap-4">
                  <input name="name" defaultValue={editQuiz.name} placeholder="Quiz Name" className="border rounded px-3 py-2" required />
                  <input name="code" defaultValue={editQuiz.code} placeholder="Quiz Code" className="border rounded px-3 py-2" required />
                  <select name="contentId" defaultValue={editQuiz.content_id} className="border rounded px-3 py-2" required>
                    <option value="">Select Content</option>
                    {content.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <input name="timeLimit" type="number" defaultValue={editQuiz.time_limit} placeholder="Time Limit (minutes)" className="border rounded px-3 py-2" />
                  <input name="attemptLimit" type="number" defaultValue={editQuiz.attempt_limit || 0} placeholder="Attempt Limit (0 = unlimited)" className="border rounded px-3 py-2" />
                  <input name="passMark" type="number" defaultValue={editQuiz.pass_mark || 50} placeholder="Pass Mark (%)" className="border rounded px-3 py-2" min="0" max="100" />
                  <input name="imageUrl" defaultValue={editQuiz.image_url || ''} placeholder="Image URL" className="border rounded px-3 py-2" />
                  <input name="attachmentUrl" defaultValue={editQuiz.attachment_url || ''} placeholder="Attachment URL" className="border rounded px-3 py-2" />
                  <div className="flex items-center space-x-2">
                    <input name="published" type="checkbox" defaultChecked={editQuiz.published} />
                    <span>Published</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input name="calculatorAllowed" type="checkbox" defaultChecked={editQuiz.calculator_allowed} />
                    <span>Calculator Allowed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input name="shuffleQuestions" type="checkbox" defaultChecked={editQuiz.shuffle_questions} />
                    <span>Shuffle Questions</span>
                  </div>
                  <div className="col-span-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Update Quiz
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : params.page === 'quizzes' && viewQuiz ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quiz Details</h1>
                <div className="flex space-x-2">
                  <Link href={`/admin/users?page=quizzes&edit=${viewQuiz.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Edit Quiz
                  </Link>
                  <Link href="/admin/users?page=quizzes" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Back to Quizzes
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">ID</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.id}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Name</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.name}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Code</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.code}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Content</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.content_name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Time Limit</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.time_limit} minutes</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Published</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.published ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Calculator Allowed</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.calculator_allowed ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Attempt Limit</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.attempt_limit || 'Unlimited'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Pass Mark</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.pass_mark || 50}%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Shuffle Questions</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.shuffle_questions ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Image URL</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.image_url || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Attachment URL</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.attachment_url || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Created At</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{new Date(viewQuiz.created_at).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Updated At</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.updated_at ? new Date(viewQuiz.updated_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : quizWithQuestions ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quiz Details with Questions</h1>
                <div className="flex space-x-2">
                  {params.user && (
                    <Link href={`/tutor/student?id=${params.user}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Back to Tutor
                    </Link>
                  )}
                  <Link href="/admin/users?page=quizzes" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Back to Quizzes
                  </Link>
                </div>
              </div>
              
              <form action={async (formData: FormData) => {
                'use server';
                await saveQuizAnswersAction(formData);
              }}>
                <input type="hidden" name="userId" value="1" />
                <input type="hidden" name="quizId" value={quizDetailsId} />
                <input type="hidden" name="contentId" value={quizWithQuestions[0]?.content_id || ''} />
                
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Questions ({quizWithQuestions.length})</h2>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Save Answers
                    </button>
                  </div>
                  <QuizInterface 
                    quizWithQuestions={quizWithQuestions} 
                    quizDetailsId={quizDetailsId!} 
                    resetQuizAction={async () => {
                      'use server';
                      await resetQuizProgressAction(1, quizDetailsId!);
                    }}
                    userRole="admin"
                  />
                </div>
              </form>
            </>
          ) : params.page === 'quizzes' ? (
            <>
              <h1 className="text-2xl font-bold mb-6">Quiz Management</h1>
              
              {/* Quizzes List */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">All Quizzes</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <Link href={`/admin/users?page=quizzes&quiz=${quiz.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">{quiz.name}</Link>
                        <p className="text-sm text-gray-500">
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {quiz.code}
                          </span>
                          <span className="ml-2">Content: {quiz.content_name || 'N/A'}</span>
                          <span className="ml-2">Time: {quiz.time_limit}min</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          quiz.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {quiz.published ? 'Published' : 'Draft'}
                        </span>
                        <div className="flex space-x-1">
                          <Link href={`/admin/users?page=quizzes&view=${quiz.id}`} className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border rounded">
                            View
                          </Link>
                          <Link href={`/admin/users?page=quizzes&edit=${quiz.id}`} className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border rounded">
                            Edit
                          </Link>
                          <form action={async () => {
                            'use server';
                            await deleteQuizAction(quiz.id);
                          }} className="inline">
                            <button type="submit" className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border rounded">
                              Delete
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Create Quiz Form */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Create New Quiz</h3>
                <form action={createQuizAction} className="grid grid-cols-2 gap-4">
                  <input name="name" placeholder="Quiz Name" className="border rounded px-3 py-2" required />
                  <input name="code" placeholder="Quiz Code" className="border rounded px-3 py-2" required />
                  <select name="contentId" className="border rounded px-3 py-2" required>
                    <option value="">Select Content</option>
                    {content.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <input name="timeLimit" type="number" placeholder="Time Limit (minutes)" className="border rounded px-3 py-2" defaultValue="30" />
                  <input name="attemptLimit" type="number" placeholder="Attempt Limit (0 = unlimited)" className="border rounded px-3 py-2" defaultValue="0" />
                  <input name="passMark" type="number" placeholder="Pass Mark (%)" className="border rounded px-3 py-2" defaultValue="50" min="0" max="100" />
                  <input name="imageUrl" placeholder="Image URL" className="border rounded px-3 py-2" />
                  <input name="attachmentUrl" placeholder="Attachment URL" className="border rounded px-3 py-2" />
                  <label className="flex items-center space-x-2">
                    <input name="published" type="checkbox" value="true" />
                    <span>Published</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input name="calculatorAllowed" type="checkbox" value="true" defaultChecked />
                    <span>Calculator Allowed</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input name="shuffleQuestions" type="checkbox" value="true" />
                    <span>Shuffle Questions</span>
                  </label>
                  <div className="col-span-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Create Quiz
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : editUser ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit User</h1>
                <Link href="/admin/users" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Cancel
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <form action={async (formData: FormData) => {
                  'use server';
                  await updateUserAction(editUser.id, formData);
                }} className="grid grid-cols-2 gap-4">
                  <input name="firstName" defaultValue={editUser.first_name} placeholder="First Name" className="border rounded px-3 py-2" required />
                  <input name="lastName" defaultValue={editUser.last_name} placeholder="Last Name" className="border rounded px-3 py-2" required />
                  <input name="email" type="email" defaultValue={editUser.email} placeholder="Email" className="border rounded px-3 py-2" required />
                  <select name="role" defaultValue={editUser.role} className="border rounded px-3 py-2" required>
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <input name="yearGroup" type="number" defaultValue={editUser.year_group || ''} placeholder="Year Group (1-13)" className="border rounded px-3 py-2" min="1" max="13" />
                  <input name="targetGrade" type="number" defaultValue={editUser.target_grade || ''} placeholder="Target Grade (1-9)" className="border rounded px-3 py-2" min="1" max="9" />
                  <input name="currentGrade" type="number" defaultValue={editUser.current_grade || ''} placeholder="Current Grade (1-9)" className="border rounded px-3 py-2" min="1" max="9" />
                  <select name="examBoard" defaultValue={editUser.exam_board || 'Edexcel'} className="border rounded px-3 py-2">
                    <option value="AQA">AQA</option>
                    <option value="Edexcel">Edexcel</option>
                    <option value="OCR">OCR</option>
                    <option value="WJEC">WJEC</option>
                    <option value="Other">Other</option>
                  </select>
                  <input name="school" defaultValue={editUser.school || ''} placeholder="School" className="border rounded px-3 py-2" />
                  <input name="course" defaultValue={editUser.course || ''} placeholder="Course" className="border rounded px-3 py-2" />
                  <input name="contactNumber" defaultValue={editUser.contact_number || ''} placeholder="Contact Number" className="border rounded px-3 py-2" />
                  <select name="classPreference" defaultValue={editUser.class_preference || 'foundation'} className="border rounded px-3 py-2">
                    <option value="foundation">Foundation</option>
                    <option value="higher">Higher</option>
                    <option value="ks3">KS3</option>
                  </select>
                  <select name="bookingOption" defaultValue={editUser.booking_option || 'pay_as_you_go'} className="border rounded px-3 py-2">
                    <option value="pay_as_you_go">Pay as you go</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <select name="paymentPreference" defaultValue={editUser.payment_preference || 'cash'} className="border rounded px-3 py-2">
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="directdebit">Direct Debit</option>
                  </select>
                  <select name="travelArrangement" defaultValue={editUser.travel_arrangement || 'pickup'} className="border rounded px-3 py-2">
                    <option value="pickup">Pickup</option>
                    <option value="alone">Alone</option>
                  </select>
                  <select name="communicationMethod" defaultValue={editUser.communication_method || 'whatsapp'} className="border rounded px-3 py-2">
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="text">Text</option>
                    <option value="other">Other</option>
                  </select>
                  <input name="communicationOther" defaultValue={editUser.communication_other || ''} placeholder="Communication Other" className="border rounded px-3 py-2" />
                  <input name="parentsName" defaultValue={editUser.parents_name || ''} placeholder="Parent's Name" className="border rounded px-3 py-2" />
                  <input name="imageUrl" defaultValue={editUser.image_url || ''} placeholder="Image URL" className="border rounded px-3 py-2" />
                  <input name="attachmentUrl" defaultValue={editUser.attachment_url || ''} placeholder="Attachment URL" className="border rounded px-3 py-2" />
                  <div className="flex items-center space-x-2">
                    <input name="promotionalConsent" type="checkbox" defaultChecked={editUser.promotional_consent} />
                    <label>Promotional Consent</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input name="homeworkRequired" type="checkbox" defaultChecked={editUser.homework_required} />
                    <label>Homework Required</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input name="active" type="checkbox" defaultChecked={editUser.active} />
                    <label>Active</label>
                  </div>
                  <div></div>
                  <div className="col-span-2">
                    <textarea name="notes" defaultValue={editUser.notes || ''} placeholder="Notes" className="border rounded px-3 py-2 w-full" rows={3}></textarea>
                  </div>
                  <div className="col-span-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Update User
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : viewUserId && !viewUser ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Not Found</h1>
                <Link href="/admin/users" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Back to Users
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">User with ID {viewUserId} was not found.</p>
              </div>
            </>
          ) : viewUser ? (
            <>
              <Breadcrumb items={[
                { label: 'Admin', href: '/admin' },
                { label: 'Users', href: '/admin/users' },
                { label: `${viewUser.first_name} ${viewUser.last_name}` }
              ]} />
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Details</h1>
                <div className="flex space-x-2">
                  <Link href={`/admin/users?edit=${viewUser.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Edit User
                  </Link>
                  <Link href="/admin/users" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Back to Users
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">ID</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.id}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">First Name</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.first_name}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Last Name</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.last_name}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Email</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.email}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Role</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.role}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Year Group</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.year_group || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Target Grade</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.target_grade || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Current Grade</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.current_grade || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Exam Board</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.exam_board || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">School</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.school || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Contact Number</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.contact_number || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Class Preference</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.class_preference || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Booking Option</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.booking_option || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Payment Preference</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.payment_preference || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Promotional Consent</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.promotional_consent ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Homework Required</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.homework_required ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Travel Arrangement</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.travel_arrangement || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Communication Method</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.communication_method || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Communication Other</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.communication_other || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Parent's Name</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.parents_name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Image URL</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.image_url || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Attachment URL</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.attachment_url || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Active</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.active ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Created At</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{new Date(viewUser.created_at).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Updated At</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewUser.updated_at ? new Date(viewUser.updated_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                    {viewUser.notes && (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Notes</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">{viewUser.notes}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* User Related Data */}
              {userRelatedData && (
                <div className="mt-6 space-y-6">
                  
                  {/* Progress Records */}
                  {userRelatedData.progress.length > 0 && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Progress Records ({userRelatedData.progress.length})</h3>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {userRelatedData.progress.map((prog) => (
                          <div key={prog.id} className="px-6 py-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{prog.content_name}</p>
                                {prog.quiz_name && (
                                  <p className="text-xs text-blue-600">Quiz: {prog.quiz_name} ({prog.quiz_code})</p>
                                )}
                                <p className="text-xs text-gray-500">
                                  Status: <span className={`font-medium ${
                                    prog.status === 'completed' ? 'text-green-600' :
                                    prog.status === 'in_progress' ? 'text-yellow-600' :
                                    'text-gray-600'
                                  }`}>{prog.status}</span>
                                  {prog.score && <span className="ml-2">Score: {prog.score}%</span>}
                                  {prog.grade && <span className="ml-2">Grade: {prog.grade}</span>}
                                </p>
                                
                                {/* Quiz Answers */}
                                {prog.answers && Object.keys(prog.answers).length > 0 && (
                                  <div className="mt-2 p-3 bg-gray-50 rounded">
                                    <div className="flex justify-between items-center mb-2">
                                      <p className="text-xs font-medium text-gray-700">Quiz Answers:</p>
                                      {prog.quiz_id && (
                                        <Link 
                                          href={`/admin/users?page=quizzes&quiz=${prog.quiz_id}`}
                                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                                        >
                                          View Quiz
                                        </Link>
                                      )}
                                    </div>
                                    <div className="space-y-1">
                                      {Object.entries(prog.answers).map(([questionId, answer]) => (
                                        <div key={questionId} className="text-xs">
                                          <span className="font-medium">Q{questionId}:</span> 
                                          <span className="text-gray-600">{String(answer)}</span>
                                          {prog.answer_scores && prog.answer_scores[questionId] !== undefined && (
                                            <span className={`ml-2 px-1 rounded text-xs ${
                                              prog.answer_scores[questionId] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                              {prog.answer_scores[questionId] ? '✓' : '✗'}
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {prog.completion}% complete
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Bookings */}
                  {userRelatedData.bookings.length > 0 && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Bookings ({userRelatedData.bookings.length})</h3>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {userRelatedData.bookings.map((booking) => (
                          <div key={booking.id} className="px-6 py-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {viewUser.role === 'tutor' ? 
                                    `Student: ${booking.student_first_name} ${booking.student_last_name}` :
                                    `Tutor: ${booking.tutor_first_name} ${booking.tutor_last_name}`
                                  }
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(booking.scheduled_start).toLocaleString()} - {new Date(booking.scheduled_end).toLocaleString()}
                                </p>
                              </div>
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
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* User Progress */}
                  {userRelatedData.sessions.length > 0 && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">User Progress ({userRelatedData.sessions.length})</h3>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {userRelatedData.sessions.map((session) => (
                          <div key={session.id} className="px-6 py-4">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <p className="font-medium text-gray-900">{session.content_name}</p>
                                <p className="text-gray-500">Session {session.session_number} - {new Date(session.session_date).toLocaleDateString()}</p>
                                {session.score && <p>Score: {session.score}%</p>}
                                {session.grade && <p>Grade: {session.grade}</p>}
                              </div>
                              <div>
                                {session.tutor_feedback && <p><span className="font-medium">Tutor:</span> {session.tutor_feedback}</p>}
                                {session.homework && <p><span className="font-medium">Homework:</span> {session.homework}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Authored Content (for tutors/admins) */}
                  {userRelatedData.authoredContent.length > 0 && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Authored Content ({userRelatedData.authoredContent.length})</h3>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {userRelatedData.authoredContent.map((content) => (
                          <div key={content.id} className="px-6 py-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{content.name}</p>
                                <p className="text-xs text-gray-500">
                                  Type: {content.type} | Grades: {content.grade_min}-{content.grade_max}
                                </p>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                content.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {content.published ? 'Published' : 'Draft'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Assign Quiz Section */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Assign Quiz</h3>
                    </div>
                    <div className="p-6">
                      <form action={async (formData: FormData) => {
                        'use server';
                        const { createProgressAction } = await import('@/app/admin/lib/actions');
                        await createProgressAction(formData);
                      }} className="grid grid-cols-2 gap-4">
                        <input type="hidden" name="userId" value={viewUser.id} />
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
                            Assign Quiz
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6">User Management</h1>
          
          {/* Users list container */}
          <div className="bg-white rounded-lg shadow mb-6">
            {/* Table header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">All Users</h2>
            </div>
            
            {/* Users list with dividers */}
            <div className="divide-y divide-gray-200">
              {/* Map through users array to display each user */}
              {users.map((user) => (
                <div key={user.id} className="px-6 py-4 flex items-center justify-between">
                  {/* User information section */}
                  <div>
                    {/* User full name */}
                    <p className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </p>
                    
                    {/* User role badge and email */}
                    <p className="text-sm text-gray-500">
                      {/* Role badge with conditional styling based on user role */}
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'tutor' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                      {/* User email address */}
                      <span className="ml-2">{user.email}</span>
                    </p>
                  </div>
                  
                  {/* User creation date and actions */}
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                    {/* CRUD Action buttons */}
                    <div className="flex space-x-1">
                      <ViewButton user={user} />
                      <Link href={`/admin/users?edit=${user.id}`} className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border rounded">
                        Edit
                      </Link>
                      <form action={async () => {
                        'use server';
                        await deleteUserAction(user.id);
                      }} className="inline">
                        <button type="submit" className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border rounded">
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Create User Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Create New User</h3>
            <form action={createUserAction} className="grid grid-cols-2 gap-4">
              <input name="firstName" placeholder="First Name" className="border rounded px-3 py-2" required />
              <input name="lastName" placeholder="Last Name" className="border rounded px-3 py-2" required />
              <input name="email" type="email" placeholder="Email" className="border rounded px-3 py-2" required />
              <input name="password" type="password" placeholder="Password" className="border rounded px-3 py-2" required />
              <select name="role" className="border rounded px-3 py-2" required>
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
                <option value="admin">Admin</option>
              </select>
              <input name="yearGroup" type="number" placeholder="Year Group" className="border rounded px-3 py-2" />
              <input name="targetGrade" type="number" placeholder="Target Grade" className="border rounded px-3 py-2" />
              <input name="school" placeholder="School" className="border rounded px-3 py-2" />
              <input name="course" placeholder="Course" className="border rounded px-3 py-2" />
              <input name="contactNumber" placeholder="Contact Number" className="border rounded px-3 py-2" />
              <input name="parentsName" placeholder="Parent's Name" className="border rounded px-3 py-2" />
              <input name="imageUrl" placeholder="Image URL" className="border rounded px-3 py-2" />
              <input name="attachmentUrl" placeholder="Attachment URL" className="border rounded px-3 py-2" />
              <div className="col-span-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Create User
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