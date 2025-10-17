import AdminSidebar from '@/app/admin/components/sidebar';
import { getAllBookings, getAllUsers, updateBookingAction, createBookingAction, deleteBookingAction } from '@/app/admin/lib/actions';
import Link from 'next/link';
import Breadcrumb from '../components/breadcrumb';

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ view?: string; edit?: string }> }) {
  const params = await searchParams;
  const bookings = await getAllBookings();
  const users = await getAllUsers();
  const viewBookingId = params.view ? parseInt(params.view) : null;
  const editBookingId = params.edit ? parseInt(params.edit) : null;
  const viewBooking = viewBookingId ? bookings.find(b => Number(b.id) === Number(viewBookingId)) : null;
  const editBooking = editBookingId ? bookings.find(b => Number(b.id) === Number(editBookingId)) : null;

  const tutors = users.filter(u => u.role === 'tutor');
  const students = users.filter(u => u.role === 'student');

  return (
    <div className="pt-16 flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {editBooking ? (
            <>
              <Breadcrumb items={[
                { label: 'Admin', href: '/admin' },
                { label: 'Bookings', href: '/admin/bookings' },
                { label: 'Edit Booking' }
              ]} />
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Booking</h1>
                <Link href="/admin/bookings" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Cancel
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <form action={async (formData: FormData) => {
                  'use server';
                  await updateBookingAction(editBooking.id, formData);
                }} className="grid grid-cols-2 gap-4">
                  <select name="tutorId" defaultValue={editBooking.tutor_id} className="border rounded px-3 py-2" required>
                    <option value="">Select Tutor</option>
                    {tutors.map((tutor) => (
                      <option key={tutor.id} value={tutor.id}>{tutor.first_name} {tutor.last_name}</option>
                    ))}
                  </select>
                  <select name="studentId" defaultValue={editBooking.student_id} className="border rounded px-3 py-2" required>
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>{student.first_name} {student.last_name}</option>
                    ))}
                  </select>
                  <select name="sessionType" defaultValue={editBooking.session_type || 'individual'} className="border rounded px-3 py-2" required>
                    <option value="individual">Individual</option>
                    <option value="group">Group</option>
                  </select>
                  <select name="deliveryMode" defaultValue={editBooking.delivery_mode || 'online'} className="border rounded px-3 py-2" required>
                    <option value="online">Online</option>
                    <option value="face_to_face">Face to Face</option>
                  </select>
                  <input name="scheduledStart" type="datetime-local" defaultValue={editBooking.scheduled_start ? new Date(editBooking.scheduled_start).toISOString().slice(0, 16) : ''} className="border rounded px-3 py-2" required />
                  <input name="scheduledEnd" type="datetime-local" defaultValue={editBooking.scheduled_end ? new Date(editBooking.scheduled_end).toISOString().slice(0, 16) : ''} className="border rounded px-3 py-2" required />
                  <input name="location" defaultValue={editBooking.location || ''} placeholder="Meeting link or address" className="border rounded px-3 py-2" />
                  <input name="maxParticipants" type="number" defaultValue={editBooking.max_participants || 1} min="1" className="border rounded px-3 py-2" />
                  <select name="status" defaultValue={editBooking.status} className="border rounded px-3 py-2" required>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div></div>
                  <div className="col-span-2">
                    <textarea name="notes" defaultValue={editBooking.notes || ''} placeholder="Session notes or requirements" className="border rounded px-3 py-2 w-full" rows={3}></textarea>
                  </div>
                  <div className="col-span-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Update Booking
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : viewBooking ? (
            <>
              <Breadcrumb items={[
                { label: 'Admin', href: '/admin' },
                { label: 'Bookings', href: '/admin/bookings' },
                { label: `Booking ${viewBooking.id}` }
              ]} />
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Booking Details</h1>
                <div className="flex space-x-2">
                  <Link href={`/admin/bookings?edit=${viewBooking.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Edit Booking
                  </Link>
                  <Link href="/admin/bookings" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Back to Bookings
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">ID</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewBooking.id}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Tutor</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewBooking.tutor_first_name} {viewBooking.tutor_last_name}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Student</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewBooking.student_first_name} {viewBooking.student_last_name}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Scheduled Start</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewBooking.scheduled_start ? new Date(viewBooking.scheduled_start).toLocaleString() : 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Scheduled End</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewBooking.scheduled_end ? new Date(viewBooking.scheduled_end).toLocaleString() : 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Session Type</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewBooking.session_type || 'individual'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Delivery Mode</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewBooking.delivery_mode || 'online'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Location</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-bold">{viewBooking.location || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Max Participants</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewBooking.max_participants || 1}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Status</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{viewBooking.status}</td>
                    </tr>
                    {viewBooking.notes && (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Notes</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">{viewBooking.notes}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">Created At</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{new Date(viewBooking.created_at).toLocaleDateString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <Breadcrumb items={[
                { label: 'Admin', href: '/admin' },
                { label: 'Bookings' }
              ]} />
              <h1 className="text-2xl font-bold mb-6">Booking Management</h1>
          
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">All Bookings</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.tutor_first_name} {booking.tutor_last_name} → {booking.student_first_name} {booking.student_last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status.toUpperCase()}
                          </span>
                          <span className="ml-2">{booking.session_type || 'individual'} • {booking.delivery_mode || 'online'}</span>
                          <span className="ml-2">{booking.scheduled_start ? new Date(booking.scheduled_start).toLocaleString() : 'No date'}</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-500">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-1">
                          <Link href={`/admin/bookings?view=${booking.id}`} className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border rounded">
                            View
                          </Link>
                          <Link href={`/admin/bookings?edit=${booking.id}`} className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border rounded">
                            Edit
                          </Link>
                          <form action={async () => {
                            'use server';
                            await deleteBookingAction(booking.id);
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
                <h3 className="text-lg font-medium mb-4">Create New Booking</h3>
                <form action={createBookingAction} className="grid grid-cols-2 gap-4">
                  <select name="tutorId" className="border rounded px-3 py-2" required>
                    <option value="">Select Tutor</option>
                    {tutors.map((tutor) => (
                      <option key={tutor.id} value={tutor.id}>{tutor.first_name} {tutor.last_name}</option>
                    ))}
                  </select>
                  <select name="studentId" className="border rounded px-3 py-2" required>
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>{student.first_name} {student.last_name}</option>
                    ))}
                  </select>
                  <select name="sessionType" defaultValue="individual" className="border rounded px-3 py-2" required>
                    <option value="individual">Individual</option>
                    <option value="group">Group</option>
                  </select>
                  <select name="deliveryMode" defaultValue="online" className="border rounded px-3 py-2" required>
                    <option value="online">Online</option>
                    <option value="face_to_face">Face to Face</option>
                  </select>
                  <input name="scheduledStart" type="datetime-local" className="border rounded px-3 py-2" required />
                  <input name="scheduledEnd" type="datetime-local" className="border rounded px-3 py-2" required />
                  <input name="location" placeholder="Meeting link or address" className="border rounded px-3 py-2" />
                  <input name="maxParticipants" type="number" defaultValue="1" min="1" className="border rounded px-3 py-2" />
                  <select name="status" defaultValue="pending" className="border rounded px-3 py-2" required>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div></div>
                  <div className="col-span-2">
                    <textarea name="notes" placeholder="Session notes or requirements" className="border rounded px-3 py-2 w-full" rows={3}></textarea>
                  </div>
                  <div className="col-span-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Create Booking
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