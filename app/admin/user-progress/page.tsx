/**
 * User Progress Management Page
 * 
 * Comprehensive CRUD interface for student progress tracking:
 * - View all progress records with status indicators
 * - Create new progress records for student-content pairs
 * - Edit existing progress with detailed fields
 * - View detailed progress information
 * - Delete progress records
 */
import AdminSidebar from '@/app/admin/components/sidebar';
import { getAllProgress, getAllUsers, getAllContent, getAllQuizzes, createProgressAction, updateProgressAction, deleteProgressAction } from '@/app/admin/lib/actions';
import Link from 'next/link';
import Breadcrumb from '../components/breadcrumb';

export default async function SessionProgressPage({ searchParams }: { searchParams: Promise<{ view?: string; edit?: string }> }) {
  const params = await searchParams;
  
  const progress = await getAllProgress();
  const users = await getAllUsers();
  const content = await getAllContent();
  const quizzes = await getAllQuizzes();
  
  const viewProgressId = params.view ? parseInt(params.view) : null;
  const editProgressId = params.edit ? parseInt(params.edit) : null;
  
  const viewProgress = viewProgressId ? progress.find(p => Number(p.id) === Number(viewProgressId)) : null;
  const editProgress = editProgressId ? progress.find(p => Number(p.id) === Number(editProgressId)) : null;
  
  const students = users.filter(u => u.role === 'student');

  return (
    <div className="pt-16 flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {editProgress ? (
            <>
              <Breadcrumb items={[
                { label: 'Admin', href: '/admin' },
                { label: 'User Progress', href: '/admin/user-progress' },
                { label: 'Edit Progress' }
              ]} />
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Progress</h1>
                <Link href="/admin/user-progress" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Cancel
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <form action={async (formData: FormData) => {
                  'use server';
                  await updateProgressAction(editProgress.id, formData);
                }} className="grid grid-cols-2 gap-4">
                  <input name="completion" type="number" defaultValue={editProgress.completion} placeholder="Completion %" className="border rounded px-3 py-2" min="0" max="100" required />
                  <select name="status" defaultValue={editProgress.status} className="border rounded px-3 py-2" required>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <input name="grade" type="number" step="0.1" defaultValue={editProgress.grade || ''} placeholder="Grade" className="border rounded px-3 py-2" />
                  <input name="score" type="number" defaultValue={editProgress.score || ''} placeholder="Score %" className="border rounded px-3 py-2" min="0" max="100" />
                  <input name="sessionsCount" type="number" defaultValue={editProgress.sessions_count} placeholder="Sessions Count" className="border rounded px-3 py-2" min="0" />
                  <div className="flex items-center space-x-2">
                    <input name="completed" type="checkbox" defaultChecked={editProgress.completed} />
                    <label>Completed</label>
                  </div>
                  <div className="col-span-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Update Progress
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : viewProgress ? (
            <>
              <Breadcrumb items={[
                { label: 'Admin', href: '/admin' },
                { label: 'User Progress', href: '/admin/user-progress' },
                { label: viewProgress.user_name }
              ]} />
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Progress Details</h1>
                <div className="flex space-x-2">
                  <Link href={`/admin/user-progress?edit=${viewProgress.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Edit Progress
                  </Link>
                  <Link href="/admin/user-progress" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Back to Progress
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">ID</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewProgress.id}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Student</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewProgress.user_name}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Content</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewProgress.content_name}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Status</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewProgress.status}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Completion</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewProgress.completion}%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Score</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewProgress.score || 'N/A'}%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Grade</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewProgress.grade || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Sessions Count</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewProgress.sessions_count}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Completed</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewProgress.completed ? 'Yes' : 'No'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <Breadcrumb items={[
                { label: 'Admin', href: '/admin' },
                { label: 'User Progress' }
              ]} />
              <h1 className="text-2xl font-bold mb-6">User Progress Management</h1>
              
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">All Progress Records</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {progress.map((prog) => (
                    <div key={prog.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{prog.user_name}</p>
                        <p className="text-sm text-gray-500">
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {prog.content_name}
                          </span>
                          <span className="ml-2">Completion: {prog.completion}%</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          prog.status === 'completed' ? 'bg-green-100 text-green-800' :
                          prog.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {prog.status}
                        </span>
                        <div className="flex space-x-1">
                          <Link href={`/admin/user-progress?view=${prog.id}`} className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border rounded">
                            View
                          </Link>
                          <Link href={`/admin/user-progress?edit=${prog.id}`} className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border rounded">
                            Edit
                          </Link>
                          <form action={async () => {
                            'use server';
                            await deleteProgressAction(prog.id);
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
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Create New Progress Record</h3>
                <form action={createProgressAction} className="grid grid-cols-2 gap-4">
                  <select name="userId" className="border rounded px-3 py-2" required>
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>{student.first_name} {student.last_name}</option>
                    ))}
                  </select>
                  <select name="contentId" className="border rounded px-3 py-2" required>
                    <option value="">Select Content</option>
                    {content.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <select name="quizId" className="border rounded px-3 py-2">
                    <option value="">Select Quiz (Optional)</option>
                    {quizzes.map((quiz) => (
                      <option key={quiz.id} value={quiz.id}>{quiz.name}</option>
                    ))}
                  </select>
                  <input name="completion" type="number" placeholder="Completion %" className="border rounded px-3 py-2" min="0" max="100" defaultValue="0" required />
                  <select name="status" className="border rounded px-3 py-2" required>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <input name="sessionsCount" type="number" placeholder="Sessions Count" className="border rounded px-3 py-2" min="0" defaultValue="0" />
                  <div className="col-span-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Create Progress
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