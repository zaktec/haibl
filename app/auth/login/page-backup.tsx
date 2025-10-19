'use client';

import { authenticate, register } from '@/app/auth/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = isLogin 
        ? await authenticate(undefined, formData)
        : await register(undefined, formData);
        
      if (result) {
        setError(result);
      }
    } catch (error: any) {
      if (error.message?.includes('NEXT_REDIRECT')) {
        // Successful login/register - redirect will happen automatically
        return;
      } else {
        setError(isLogin ? 'Login failed' : 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email: string, password: string) => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = password;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 text-center ${isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-md`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 text-center ${!isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-md`}
          >
            Register
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 text-red-500 text-sm">{error}</div>
        )}
        
        {isLogin && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">One-Click Login</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={async () => {
                  setLoading(true);
                  const formData = new FormData();
                  formData.append('email', 'admin@mathstutorhelp.com');
                  formData.append('password', '123');
                  try {
                    await authenticate(undefined, formData);
                  } catch (error: any) {
                    if (error.message?.includes('NEXT_REDIRECT')) {
                      // Redirect will happen automatically
                      return;
                    }
                  }
                  setLoading(false);
                }}
                disabled={loading}
                className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-sm">Admin Login</div>
                <div className="text-xs opacity-75">One-click access</div>
              </button>
              <button
                onClick={async () => {
                  setLoading(true);
                  const formData = new FormData();
                  formData.append('email', 'tutor@mathstutorhelp.com');
                  formData.append('password', '123');
                  try {
                    await authenticate(undefined, formData);
                  } catch (error: any) {
                    if (error.message?.includes('NEXT_REDIRECT')) {
                      return;
                    }
                  }
                  setLoading(false);
                }}
                disabled={loading}
                className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-sm">Tutor Login</div>
                <div className="text-xs opacity-75">One-click access</div>
              </button>
              <button
                onClick={async () => {
                  setLoading(true);
                  const formData = new FormData();
                  formData.append('email', 'student@mathstutorhelp.com');
                  formData.append('password', '123');
                  try {
                    await authenticate(undefined, formData);
                  } catch (error: any) {
                    if (error.message?.includes('NEXT_REDIRECT')) {
                      return;
                    }
                  }
                  setLoading(false);
                }}
                disabled={loading}
                className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-sm">Student Login</div>
                <div className="text-xs opacity-75">One-click access</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}