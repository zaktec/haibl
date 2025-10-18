import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">HAIBL</h1>
          <nav className="space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
            <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master Math with
            <span className="text-indigo-600"> Expert Tutors</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Personalized math tutoring platform connecting students with qualified tutors. 
            Track progress, take quizzes, and achieve your academic goals.
          </p>
          <div className="space-x-4">
            <Link href="/auth/register" className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700">
              Get Started
            </Link>
            <Link href="/onboarding" className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50">
              Learn More
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Tutors</h3>
            <p className="text-gray-600">Connect with qualified math tutors for personalized learning sessions.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">Monitor your learning progress with detailed analytics and reports.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Quizzes</h3>
            <p className="text-gray-600">Practice with engaging quizzes tailored to your grade level.</p>
          </div>
        </div>

        {/* Portals */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Access Your Portal</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/student" className="block p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👨‍🎓</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Student Portal</h3>
                <p className="text-gray-600">Access your dashboard, quizzes, and progress tracking.</p>
              </div>
            </Link>
            <Link href="/tutor" className="block p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👨‍🏫</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Tutor Portal</h3>
                <p className="text-gray-600">Manage students, sessions, and track their progress.</p>
              </div>
            </Link>
            <Link href="/admin" className="block p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚙️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Admin Panel</h3>
                <p className="text-gray-600">Manage users, content, and platform settings.</p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 HAIBL Math Tutoring Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}