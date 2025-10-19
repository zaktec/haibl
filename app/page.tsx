import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Hai-bl</h1>
          <nav className="space-x-4">
            <Link href="/seed/page" className="text-gray-600 hover:text-indigo-600">Seed DB</Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
            <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Excel with Human Tutors
            <span className="text-indigo-600"> + AI Expertise</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            HAiBL: A human-guided, AI-powered blended learning platform built for smarter, more personalised education.
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
              <span className="text-2xl">👨🏫</span>
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

        {/* Subjects */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Subject</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/auth/login?subject=maths" className="block p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔢</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Mathematics</h3>
                <p className="text-gray-600">Algebra, Geometry, Calculus & more</p>
              </div>
            </Link>
            <Link href="/auth/login?subject=computer" className="block p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💻</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Computer Science</h3>
                <p className="text-gray-600">Programming, Algorithms & Data Structures</p>
              </div>
            </Link>
            <Link href="/auth/login?subject=physics" className="block p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚛️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Physics</h3>
                <p className="text-gray-600">Mechanics, Thermodynamics & Quantum</p>
              </div>
            </Link>
            <Link href="/auth/login?subject=chemistry" className="block p-6 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🧪</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Chemistry</h3>
                <p className="text-gray-600">Organic, Inorganic & Physical Chemistry</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-16 text-center">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-indigo-600 mb-2">10,000+</div>
            <div className="text-gray-600">Students Enrolled</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
            <div className="text-gray-600">Expert Tutors</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Students Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 mb-4">Hai-bl transformed my understanding of calculus. The AI-powered recommendations were spot on!</p>
              <div className="font-semibold">Sarah M.</div>
              <div className="text-sm text-gray-500">A-Level Student</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 mb-4">The personalized learning path helped me improve my grades by 2 levels in just 3 months.</p>
              <div className="font-semibold">James L.</div>
              <div className="text-sm text-gray-500">GCSE Student</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 mb-4">As a tutor, Hai-bl analytics help me track student progress like never before.</p>
              <div className="font-semibold">Dr. Emily R.</div>
              <div className="text-sm text-gray-500">Mathematics Tutor</div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-2 border-gray-200 rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Basic</h3>
              <div className="text-3xl font-bold text-indigo-600 mb-4">£29<span className="text-lg text-gray-500">/month</span></div>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Access to all subjects</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>AI-powered recommendations</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Progress tracking</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Interactive quizzes</li>
              </ul>
              <Link href="/auth/register?plan=basic" className="block bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">Get Started</Link>
            </div>
            <div className="border-2 border-indigo-500 rounded-xl p-6 text-center relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm">Most Popular</div>
              <h3 className="text-xl font-semibold mb-4">Premium</h3>
              <div className="text-3xl font-bold text-indigo-600 mb-4">£59<span className="text-lg text-gray-500">/month</span></div>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Everything in Basic</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>1-on-1 tutor sessions</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Priority support</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Exam preparation</li>
              </ul>
              <Link href="/auth/register?plan=premium" className="block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">Get Started</Link>
            </div>
            <div className="border-2 border-gray-200 rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
              <div className="text-3xl font-bold text-indigo-600 mb-4">£99<span className="text-lg text-gray-500">/month</span></div>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Everything in Premium</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Unlimited tutor sessions</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Custom learning paths</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Dedicated account manager</li>
              </ul>
              <Link href="/auth/register?plan=enterprise" className="block bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">Get Started</Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-600 rounded-2xl shadow-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-6">Join thousands of students already succeeding with Hai-bl</p>
          <div className="space-x-4">
            <Link href="/auth/register" className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">Start Free Trial</Link>
            <Link href="/demo" className="border border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700">Book Demo</Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 Hai-bl Math Tutoring Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}