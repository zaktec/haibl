import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">MathsTutorHelp</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link href="/auth/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Master Mathematics with
            <span className="text-blue-600"> Expert Tutoring</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Connect with qualified math tutors, access personalized learning content, 
            and track your progress in our comprehensive learning platform.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link 
              href="/auth/login" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="/auth/login" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-blue-600 text-3xl mb-4">👨🏫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Tutors</h3>
            <p className="text-gray-600">
              Learn from qualified mathematics tutors with years of teaching experience.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-blue-600 text-3xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Content</h3>
            <p className="text-gray-600">
              Access comprehensive learning materials tailored to your grade level.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-blue-600 text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed progress tracking and analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}