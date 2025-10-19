import Link from 'next/link';
import { getStudents, getTutorInfo, getTutorBookingsCount, getTutorUpcomingBookings } from './lib/actions';
import Breadcrumb from './breadcrumb';

export default async function TutorPage() {
  let students = [];
  let tutorInfo = null;
  let bookingsCount = 0;
  let upcomingBookings = 0;
  let dbAvailable = true;
  
  try {
    students = await getStudents();
    const tutorId = 3; // Hardcoded for demo - would come from auth
    tutorInfo = await getTutorInfo(tutorId);
    bookingsCount = await getTutorBookingsCount(tutorId);
    upcomingBookings = await getTutorUpcomingBookings(tutorId);
  } catch (error) {
    console.log('Database not available:', error);
    dbAvailable = false;
    // Set demo data for local development
    tutorInfo = { first_name: 'Demo', last_name: 'Tutor', email: 'tutor@demo.com' };
  }

  return (
    <div className="p-6">
      <Breadcrumb items={[{ label: 'Dashboard' }]} />
      {/* Tutor Details Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {tutorInfo?.first_name} {tutorInfo?.last_name}
        </h1>
        <p className="text-gray-600">{tutorInfo?.email}</p>
        {!dbAvailable && (
          <div className="mt-2 text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded">
            Local Development Mode - Database Offline
          </div>
        )}
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 text-blue-600">👥 My Students</h3>
          <div className="text-3xl font-bold text-gray-900">{dbAvailable ? students.length : 'Demo'}</div>
          <div className="text-sm text-gray-500 mt-2">Total students</div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 text-green-600">📝 Quizzes</h3>
          <div className="text-3xl font-bold text-gray-900">{dbAvailable ? (bookingsCount || 0) : 'Demo'}</div>
          <div className="text-sm text-gray-500 mt-2">Available quizzes</div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 text-orange-600">⏰ Upcoming</h3>
          <div className="text-3xl font-bold text-gray-900">{dbAvailable ? (upcomingBookings || 0) : 'Demo'}</div>
          <div className="text-sm text-gray-500 mt-2">Confirmed sessions</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">My Students</h2>
      <div className="grid gap-4">
        {dbAvailable ? (
          students.length > 0 ? students.map((student) => (
            <Link
              key={student.id}
              href={`/tutor/student?id=${student.id}`}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors bg-white shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {student.first_name} {student.last_name}
                  </h3>
                  <p className="text-gray-600">{student.email}</p>
                  <p className="text-sm text-gray-500">{student.school}</p>
                </div>
                <div className="text-right text-sm">
                  <p>Year {student.year_group}</p>
                  <p>Target: Grade {student.target_grade}</p>
                </div>
              </div>
            </Link>
          )) : <p className="text-gray-500">No students found</p>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600">Connect to database to view students</p>
          </div>
        )}
      </div>
    </div>
  );
}