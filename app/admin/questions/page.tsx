import AdminSidebar from '@/app/admin/components/sidebar';
import { getAllQuestionsWithQuizzes, getAllQuizzesForSelect, getAllTopics, createQuestionAction, updateQuestionAction, deleteQuestionAction } from '@/app/admin/lib/actions';
import Link from 'next/link';
import Breadcrumb from '../components/breadcrumb';

export default async function QuestionsPage({ searchParams }: { searchParams: Promise<{ view?: string; edit?: string; quiz?: string; topic?: string }> }) {
  const params = await searchParams;
  const allQuestions = await getAllQuestionsWithQuizzes();
  const allQuizzes = await getAllQuizzesForSelect();
  const allTopics = await getAllTopics();
  const quizFilter = params.quiz || '';
  const topicFilter = params.topic || '';
  
  const questions = allQuestions.filter(q => {
    const matchesQuiz = !quizFilter || 
      q.quiz_names?.toLowerCase().includes(quizFilter.toLowerCase());
    
    const matchesTopic = !topicFilter || 
      q.topic?.toLowerCase() === topicFilter.toLowerCase();
    
    return matchesQuiz && matchesTopic;
  });
  
  const viewQuestionId = params.view ? parseInt(params.view) : null;
  const editQuestionId = params.edit ? parseInt(params.edit) : null;
  const viewQuestion = viewQuestionId ? allQuestions.find(q => Number(q.id) === Number(viewQuestionId)) : null;
  const editQuestion = editQuestionId ? allQuestions.find(q => Number(q.id) === Number(editQuestionId)) : null;

  return (
    <div className="pt-16 flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {editQuestion ? (
            <>
              <Breadcrumb items={[
                { label: 'Admin', href: '/admin' },
                { label: 'Questions', href: '/admin/questions' },
                { label: 'Edit Question' }
              ]} />
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Question</h1>
                <Link href="/admin/questions" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Cancel
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <form action={async (formData: FormData) => {
                  'use server';
                  await updateQuestionAction(editQuestion.id, formData);
                }} className="space-y-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                    <textarea name="text" defaultValue={editQuestion.text} placeholder="Enter question text" className="border rounded px-3 py-2 w-full" rows={3} required></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                      <select name="type" defaultValue={editQuestion.type} className="border rounded px-3 py-2 w-full" required>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="true_false">True/False</option>
                        <option value="short_answer">Short Answer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                      <input name="correctAnswer" defaultValue={editQuestion.correct_answer} placeholder="Correct answer" className="border rounded px-3 py-2 w-full" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Grade (1-9)</label>
                      <input name="gradeMin" type="number" defaultValue={editQuestion.grade_min} min="1" max="9" className="border rounded px-3 py-2 w-full" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Grade (1-9)</label>
                      <input name="gradeMax" type="number" defaultValue={editQuestion.grade_max} min="1" max="9" className="border rounded px-3 py-2 w-full" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
                      <input name="marks" type="number" defaultValue={editQuestion.marks} min="1" className="border rounded px-3 py-2 w-full" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                      <input name="topic" defaultValue={editQuestion.topic || ''} placeholder="e.g. algebra, probability" className="border rounded px-3 py-2 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                      <select name="difficultyLevel" defaultValue={editQuestion.difficulty_level || ''} className="border rounded px-3 py-2 w-full">
                        <option value="">Select Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Solution URL</label>
                      <input name="solutionUrl" defaultValue={editQuestion.solution_url || ''} placeholder="Link to worked solution" className="border rounded px-3 py-2 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                      <input name="imageUrl" defaultValue={editQuestion.image_url || ''} placeholder="Question image URL" className="border rounded px-3 py-2 w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Attachment URL</label>
                      <input name="attachmentUrl" defaultValue={editQuestion.attachment_url || ''} placeholder="Supporting files URL" className="border rounded px-3 py-2 w-full" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options (JSON format for multiple choice)</label>
                    <textarea name="options" defaultValue={JSON.stringify(editQuestion.options)} placeholder='["Option 1", "Option 2", "Option 3", "Option 4"]' className="border rounded px-3 py-2 w-full" rows={2}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (optional)</label>
                    <textarea name="explanation" defaultValue={editQuestion.explanation || ''} placeholder="Explanation of the correct answer" className="border rounded px-3 py-2 w-full" rows={2}></textarea>
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input name="active" type="checkbox" defaultChecked={editQuestion.active} />
                      <label>Active</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input name="randomizeOptions" type="checkbox" defaultChecked={editQuestion.randomize_options} />
                      <label>Randomize Options</label>
                    </div>
                  </div>
                  <div>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Update Question
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : viewQuestion ? (
            <>
              <Breadcrumb items={[
                { label: 'Admin', href: '/admin' },
                { label: 'Questions', href: '/admin/questions' },
                { label: `Question ${viewQuestion.id}` }
              ]} />
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Question Details</h1>
                <div className="flex space-x-2">
                  <Link href={`/admin/questions?edit=${viewQuestion.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Edit Question
                  </Link>
                  <Link href="/admin/questions" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Back to Questions
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">ID</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuestion.id}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Question Text</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-bold">{viewQuestion.text}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Type</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuestion.type}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Correct Answer</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuestion.correct_answer}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Grade Range</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuestion.grade_min} - {viewQuestion.grade_max}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Marks</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuestion.marks}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Topic</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuestion.topic || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Difficulty Level</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuestion.difficulty_level || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Options</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-bold">{JSON.stringify(viewQuestion.options)}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Randomize Options</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuestion.randomize_options ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Active</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuestion.active ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Solution URL</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuestion.solution_url || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Attachment URL</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewQuestion.attachment_url || 'N/A'}</td>
                    </tr>
                    {viewQuestion.image_url && (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Image</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                          <img src={viewQuestion.image_url} alt="Question" className="max-w-xs max-h-32 object-contain" />
                        </td>
                      </tr>
                    )}
                    {viewQuestion.explanation && (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Explanation</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">{viewQuestion.explanation}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Created At</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{new Date(viewQuestion.created_at).toLocaleDateString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <Breadcrumb items={[
                { label: 'Admin', href: '/admin' },
                { label: 'Questions' }
              ]} />
              <h1 className="text-2xl font-bold mb-6">Question Management</h1>
              
              {/* Filter Bar */}
              <div className="bg-white rounded-lg shadow mb-6 p-4">
                <form method="GET" className="flex gap-2 items-center">
                  <select 
                    name="topic" 
                    defaultValue={topicFilter}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Topics</option>
                    {allTopics.map((topicObj) => (
                      <option key={topicObj.topic} value={topicObj.topic}>{topicObj.topic}</option>
                    ))}
                  </select>
                  <select 
                    name="quiz" 
                    defaultValue={quizFilter}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Quizzes</option>
                    {allQuizzes.map((quiz) => (
                      <option key={quiz.id} value={quiz.name}>{quiz.name} ({quiz.code})</option>
                    ))}
                  </select>
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Filter
                  </button>
                  {(quizFilter || topicFilter) && (
                    <a href="/admin/questions" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                      Clear
                    </a>
                  )}
                </form>
              </div>
          
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Questions ({questions.length})</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {questions.map((question) => (
                    <div key={question.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-md">{question.text}</p>
                        <p className="text-sm text-gray-500">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            question.type === 'multiple_choice' ? 'bg-blue-100 text-blue-800' :
                            question.type === 'true_false' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {question.type.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="ml-2">Grades {question.grade_min}-{question.grade_max}</span>
                          <span className="ml-2">{question.marks} marks</span>
                          {question.quiz_names && (
                            <span className="ml-2 text-xs text-blue-600">Quizzes: {question.quiz_names}</span>
                          )}
                          <span className={`ml-2 inline-block px-2 py-1 rounded text-xs font-medium ${
                            question.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {question.active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-500">
                          {new Date(question.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-1">
                          <Link href={`/admin/questions?view=${question.id}`} className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border rounded">
                            View
                          </Link>
                          <Link href={`/admin/questions?edit=${question.id}`} className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border rounded">
                            Edit
                          </Link>
                          <form action={async () => {
                            'use server';
                            await deleteQuestionAction(question.id);
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
                <h3 className="text-lg font-medium mb-4">Create New Question</h3>
                <form action={createQuestionAction} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                    <textarea name="text" placeholder="Enter question text" className="border rounded px-3 py-2 w-full" rows={3} required></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                      <select name="type" className="border rounded px-3 py-2 w-full" required>
                        <option value="">Select Type</option>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="true_false">True/False</option>
                        <option value="short_answer">Short Answer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                      <input name="correctAnswer" placeholder="Correct answer" className="border rounded px-3 py-2 w-full" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Grade (1-9)</label>
                      <input name="gradeMin" type="number" min="1" max="9" defaultValue="1" className="border rounded px-3 py-2 w-full" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Grade (1-9)</label>
                      <input name="gradeMax" type="number" min="1" max="9" defaultValue="9" className="border rounded px-3 py-2 w-full" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
                      <input name="marks" type="number" min="1" defaultValue="1" className="border rounded px-3 py-2 w-full" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                      <input name="topic" placeholder="e.g. algebra, probability" className="border rounded px-3 py-2 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                      <select name="difficultyLevel" className="border rounded px-3 py-2 w-full">
                        <option value="">Select Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Solution URL</label>
                      <input name="solutionUrl" placeholder="Link to worked solution" className="border rounded px-3 py-2 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                      <input name="imageUrl" placeholder="Question image URL" className="border rounded px-3 py-2 w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Attachment URL</label>
                      <input name="attachmentUrl" placeholder="Supporting files URL" className="border rounded px-3 py-2 w-full" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options (JSON format for multiple choice)</label>
                    <textarea name="options" placeholder='["Option 1", "Option 2", "Option 3", "Option 4"]' className="border rounded px-3 py-2 w-full" rows={2}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (optional)</label>
                    <textarea name="explanation" placeholder="Explanation of the correct answer" className="border rounded px-3 py-2 w-full" rows={2}></textarea>
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input name="active" type="checkbox" defaultChecked />
                      <label>Active</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input name="randomizeOptions" type="checkbox" />
                      <label>Randomize Options</label>
                    </div>
                  </div>
                  <div>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Create Question
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