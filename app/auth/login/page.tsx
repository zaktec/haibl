'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === 'admin@mathstutorhelp.com' && password === '123') {
      window.location.href = '/admin';
    } else if (email === 'tutor@mathstutorhelp.com' && password === '123') {
      window.location.href = '/tutor';
    } else if (email === 'student@mathstutorhelp.com' && password === '123') {
      window.location.href = '/student';
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-3 text-center">Quick Login</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setEmail('admin@mathstutorhelp.com');
                setPassword('123');
              }}
              className="w-full p-2 bg-red-100 text-red-800 rounded text-sm"
            >
              Admin (admin@mathstutorhelp.com / 123)
            </button>
            <button
              onClick={() => {
                setEmail('tutor@mathstutorhelp.com');
                setPassword('123');
              }}
              className="w-full p-2 bg-green-100 text-green-800 rounded text-sm"
            >
              Tutor (tutor@mathstutorhelp.com / 123)
            </button>
            <button
              onClick={() => {
                setEmail('student@mathstutorhelp.com');
                setPassword('123');
              }}
              className="w-full p-2 bg-blue-100 text-blue-800 rounded text-sm"
            >
              Student (student@mathstutorhelp.com / 123)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}