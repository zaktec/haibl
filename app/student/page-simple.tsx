import Link from 'next/link';

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, Student</h1>
              <p className="text-gray-600">Local Development Mode</p>
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
            <p className="text-sm text-gray-500">Database features disabled for local development</p>
          </div>
        </div>
      </div>
    </div>
  );
}