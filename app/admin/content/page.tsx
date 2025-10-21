import AdminSidebar from '@/app/admin/components/sidebar';
import { getAllContent, updateContentAction } from '@/app/admin/lib/actions';
import { createContentAction, deleteContentAction } from '@/app/admin/lib/actions';
import Link from 'next/link';
import Breadcrumb from '../components/breadcrumb';
import ImageUpload from '@/app/ui/ImageUpload';

export default async function ContentPage({ searchParams }: { searchParams: Promise<{ view?: string; edit?: string }> }) {
  const params = await searchParams;
  const content = await getAllContent();
  const viewContentId = params.view ? parseInt(params.view) : null;
  const editContentId = params.edit ? parseInt(params.edit) : null;
  const viewContent = viewContentId ? content.find(c => Number(c.id) === Number(viewContentId)) : null;
  const editContent = editContentId ? content.find(c => Number(c.id) === Number(editContentId)) : null;

  return (
    <div className="pt-16 flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {editContent ? (
            <>
              <Breadcrumb items={[
                { label: 'Admin', href: '/admin' },
                { label: 'Content', href: '/admin/content' },
                { label: 'Edit Content' }
              ]} />
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Content</h1>
                <Link href="/admin/content" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Cancel
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <form action={async (formData: FormData) => {
                  'use server';
                  await updateContentAction(editContent.id, formData);
                }} className="grid grid-cols-2 gap-4">
                  <input name="clipNumber" defaultValue={editContent.clip_number || ''} placeholder="Clip Number" className="border rounded px-3 py-2" />
                  <input name="name" defaultValue={editContent.name} placeholder="Content Name" className="border rounded px-3 py-2" required />
                  <input name="topic" defaultValue={editContent.topic || ''} placeholder="Topic" className="border rounded px-3 py-2" />
                  <select name="contentType" defaultValue={editContent.content_type} className="border rounded px-3 py-2" required>
                    <option value="lesson">Lesson</option>
                    <option value="quiz">Quiz</option>
                    <option value="topic">Topic</option>
                  </select>
                  <select name="tier" defaultValue={editContent.tier || 'Foundation'} className="border rounded px-3 py-2">
                    <option value="Foundation">Foundation</option>
                    <option value="Higher">Higher</option>
                  </select>
                  <input name="gradeMin" type="number" defaultValue={editContent.grade_min} placeholder="Min Grade" className="border rounded px-3 py-2" required />
                  <input name="gradeMax" type="number" defaultValue={editContent.grade_max} placeholder="Max Grade" className="border rounded px-3 py-2" required />
                  <input name="videoUrl" defaultValue={editContent.video_url || ''} placeholder="Video URL" className="border rounded px-3 py-2" />
                  <ImageUpload name="imageUrl" label="Image" currentUrl={editContent.image_url || ''} />
                  <input name="attachmentUrl" defaultValue={editContent.attachment_url || ''} placeholder="Attachment URL" className="border rounded px-3 py-2" />
                  <div className="flex items-center space-x-2">
                    <input name="published" type="checkbox" defaultChecked={editContent.published} />
                    <label>Published</label>
                  </div>
                  <div className="col-span-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Update Content
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : viewContent ? (
            <>
              <Breadcrumb items={[
                { label: 'Admin', href: '/admin' },
                { label: 'Content', href: '/admin/content' },
                { label: viewContent.name }
              ]} />
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Content Details</h1>
                <div className="flex space-x-2">
                  <Link href={`/admin/content?edit=${viewContent.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Edit Content
                  </Link>
                  <Link href="/admin/content" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Back to Content
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">ID</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewContent.id}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Name</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewContent.name}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Type</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewContent.type}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Grade Range</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewContent.grade_min} - {viewContent.grade_max}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Published</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewContent.published ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Image URL</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewContent.image_url || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Attachment URL</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewContent.attachment_url || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Created At</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{new Date(viewContent.created_at).toLocaleDateString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <Breadcrumb items={[
                { label: 'Admin', href: '/admin' },
                { label: 'Content' }
              ]} />
              <h1 className="text-2xl font-bold mb-6">Content Management</h1>
          
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">All Content</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {content.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {item.type.toUpperCase()}
                      </span>
                      <span className="ml-2">Grades {item.grade_min}-{item.grade_max}</span>
                      <span className={`ml-2 inline-block px-2 py-1 rounded text-xs font-medium ${
                        item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.published ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-1">
                      <Link href={`/admin/content?view=${item.id}`} className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border rounded">
                        View
                      </Link>
                      <Link href={`/admin/content?edit=${item.id}`} className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border rounded">
                        Edit
                      </Link>
                      <form action={async () => {
                        'use server';
                        await deleteContentAction(item.id);
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
          
          {/* Create Content Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Create New Content</h3>
            <form action={createContentAction} className="grid grid-cols-2 gap-4">
              <input name="clipNumber" placeholder="Clip Number" className="border rounded px-3 py-2" />
              <input name="name" placeholder="Content Name" className="border rounded px-3 py-2" required />
              <input name="topic" placeholder="Topic" className="border rounded px-3 py-2" />
              <select name="contentType" className="border rounded px-3 py-2" required>
                <option value="">Select Type</option>
                <option value="lesson">Lesson</option>
                <option value="quiz">Quiz</option>
                <option value="topic">Topic</option>
              </select>
              <select name="tier" className="border rounded px-3 py-2">
                <option value="Foundation">Foundation</option>
                <option value="Higher">Higher</option>
              </select>
              <input name="gradeMin" type="number" placeholder="Min Grade" className="border rounded px-3 py-2" required />
              <input name="gradeMax" type="number" placeholder="Max Grade" className="border rounded px-3 py-2" required />
              <input name="videoUrl" placeholder="Video URL" className="border rounded px-3 py-2" />
              <ImageUpload name="imageUrl" label="Image" />
              <input name="attachmentUrl" placeholder="Attachment URL" className="border rounded px-3 py-2" />
              <select name="published" className="border rounded px-3 py-2" required>
                <option value="false">Draft</option>
                <option value="true">Published</option>
              </select>
              <div className="col-span-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Create Content
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