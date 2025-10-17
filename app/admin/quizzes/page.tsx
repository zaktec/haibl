import AdminSidebar from '@/app/admin/components/sidebar';
import { getAllQuizzes, deleteQuizAction } from '@/app/admin/lib/actions';
import Link from 'next/link';

export default async function QuizzesPage({ searchParams }: { searchParams: Promise<{ view?: string; edit?: string }> }) {
  const params = await searchParams;
  const quizzes = await getAllQuizzes();
  const viewId = params?.view ? parseInt(params.view) : null;
  const editId = params?.edit ? parseInt(params.edit) : null;
  const viewQuiz = viewId ? quizzes.find(q => q.id === viewId) : null;
  const editQuiz = editId ? quizzes.find(q => q.id === editId) : null;

  if (editQuiz) {
    return (
      <div className="pt-16 flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Edit Quiz</h1>
              <Link href="/admin/quizzes" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Back to Quizzes
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <form className="grid grid-cols-2 gap-4">
                <input name="name" defaultValue={editQuiz.name} placeholder="Quiz Name" className="border rounded px-3 py-2" required />
                <input name="code" defaultValue={editQuiz.code} placeholder="Quiz Code" className="border rounded px-3 py-2" required />
                <input name="timeLimit" type="number" defaultValue={editQuiz.time_limit} placeholder="Time Limit (minutes)" className="border rounded px-3 py-2" />
                <input name="attemptLimit" type="number" defaultValue={editQuiz.attempt_limit || 0} placeholder="Attempt Limit (0 = unlimited)" className="border rounded px-3 py-2" />
                <input name="passMark" type="number" defaultValue={editQuiz.pass_mark || ''} placeholder="Pass Mark (%)" className="border rounded px-3 py-2" />
                <input name="imageUrl" defaultValue={editQuiz.image_url || ''} placeholder="Cover Image URL" className="border rounded px-3 py-2" />
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
                <div></div>
                <div className="col-span-2">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Update Quiz
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewQuiz) {
    return (
      <div className="pt-16 flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Quiz Details</h1>
              <div className="flex space-x-2">
                <Link href={`/admin/quizzes?edit=${viewQuiz.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Edit Quiz
                </Link>
                <Link href="/admin/quizzes" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuiz.pass_mark ? `${viewQuiz.pass_mark}%` : 'N/A'}</td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Created</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{new Date(viewQuiz.created_at).toLocaleDateString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
          <h1 className="text-2xl font-bold mb-6">Quiz Management</h1>
          
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <h3 className="text-lg font-medium mb-4">Create New Quiz</h3>
            <form className="grid grid-cols-2 gap-4">
              <input name="name" placeholder="Quiz Name" className="border rounded px-3 py-2" required />
              <input name="code" placeholder="Quiz Code" className="border rounded px-3 py-2" required />
              <input name="timeLimit" type="number" placeholder="Time Limit (minutes)" className="border rounded px-3 py-2" />
              <input name="attemptLimit" type="number" placeholder="Attempt Limit (0 = unlimited)" className="border rounded px-3 py-2" defaultValue="0" />
              <input name="passMark" type="number" placeholder="Pass Mark (%)" className="border rounded px-3 py-2" />
              <input name="imageUrl" placeholder="Cover Image URL" className="border rounded px-3 py-2" />
              <input name="attachmentUrl" placeholder="Attachment URL" className="border rounded px-3 py-2" />
              <select name="published" className="border rounded px-3 py-2">
                <option value="false">Draft</option>
                <option value="true">Published</option>
              </select>
              <div className="flex items-center space-x-2">
                <input name="calculatorAllowed" type="checkbox" defaultChecked />
                <label>Calculator Allowed</label>
              </div>
              <div className="flex items-center space-x-2">
                <input name="shuffleQuestions" type="checkbox" />
                <label>Shuffle Questions</label>
              </div>
              <div className="col-span-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Create Quiz
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">All Quizzes</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{quiz.name}</p>
                    <p className="text-sm text-gray-500">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {quiz.code}
                      </span>
                      <span className="ml-2">{quiz.time_limit} minutes</span>
                      <span className={`ml-2 inline-block px-2 py-1 rounded text-xs font-medium ${
                        quiz.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {quiz.published ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-500">
                      {new Date(quiz.created_at).toLocaleDateString()}
                    </div>
                    <Link 
                      href={`/admin/quizzes?view=${quiz.id}`}
                      className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border rounded"
                    >
                      View
                    </Link>
                    <Link 
                      href={`/admin/quizzes?edit=${quiz.id}`}
                      className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border rounded"
                    >
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}