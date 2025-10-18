'use client';

import { useState } from 'react';
import { Copy, CheckCircle, Play, Users, BookOpen, Calendar, Database, Shield } from 'lucide-react';
import AdminSidebar from '@/app/admin/components/sidebar';

const APIDocumentation = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState('');
  const [testResponse, setTestResponse] = useState('');

  const endpoints = [
    {
      category: 'Authentication',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-red-500',
      endpoints: [
        {
          id: 'login',
          method: 'GET',
          path: '/auth/login',
          description: 'Login page',
          params: null,
          example: 'GET /auth/login',
          body: null
        },
        {
          id: 'register',
          method: 'GET',
          path: '/auth/register',
          description: 'Registration page',
          params: null,
          example: 'GET /auth/register',
          body: null
        }
      ]
    },
    {
      category: 'Admin Panel',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-blue-500',
      endpoints: [
        {
          id: 'admin-dashboard',
          method: 'GET',
          path: '/admin',
          description: 'Admin dashboard with statistics',
          params: null,
          example: 'GET /admin',
          body: null
        },
        {
          id: 'admin-users',
          method: 'GET',
          path: '/admin/users',
          description: 'User management interface',
          params: null,
          example: 'GET /admin/users',
          body: null
        },
        {
          id: 'admin-bookings',
          method: 'GET',
          path: '/admin/bookings',
          description: 'Booking management interface',
          params: null,
          example: 'GET /admin/bookings',
          body: null
        },
        {
          id: 'admin-content',
          method: 'GET',
          path: '/admin/content',
          description: 'Content management interface',
          params: null,
          example: 'GET /admin/content',
          body: null
        },
        {
          id: 'admin-quizzes',
          method: 'GET',
          path: '/admin/quizzes',
          description: 'Quiz management interface',
          params: null,
          example: 'GET /admin/quizzes',
          body: null
        },
        {
          id: 'admin-questions',
          method: 'GET',
          path: '/admin/questions',
          description: 'Question bank management',
          params: null,
          example: 'GET /admin/questions',
          body: null
        },
        {
          id: 'admin-progress',
          method: 'GET',
          path: '/admin/user-progress',
          description: 'User progress tracking',
          params: null,
          example: 'GET /admin/user-progress',
          body: null
        }
      ]
    },
    {
      category: 'Student Portal',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-green-500',
      endpoints: [
        {
          id: 'student-dashboard',
          method: 'GET',
          path: '/student',
          description: 'Student dashboard with progress',
          params: null,
          example: 'GET /student',
          body: null
        }
      ]
    },
    {
      category: 'Tutor Portal',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-purple-500',
      endpoints: [
        {
          id: 'tutor-dashboard',
          method: 'GET',
          path: '/tutor',
          description: 'Tutor dashboard with students',
          params: null,
          example: 'GET /tutor',
          body: null
        },
        {
          id: 'student-details',
          method: 'GET',
          path: '/tutor/student',
          description: 'Individual student progress view',
          params: 'id: Student ID (query param)',
          example: 'GET /tutor/student?id=1',
          body: null
        }
      ]
    },
    {
      category: 'Database & Setup',
      icon: <Database className="w-5 h-5" />,
      color: 'bg-orange-500',
      endpoints: [
        {
          id: 'seed-create-tables',
          method: 'GET',
          path: '/seed',
          description: 'Create database tables',
          params: null,
          example: 'GET /seed',
          body: null
        },
        {
          id: 'seed-populate-data',
          method: 'POST',
          path: '/seed',
          description: 'Populate database with sample data',
          params: null,
          example: 'POST /seed',
          body: null
        }
      ]
    },
    {
      category: 'Public Pages',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-gray-500',
      endpoints: [
        {
          id: 'homepage',
          method: 'GET',
          path: '/',
          description: 'Homepage/landing page',
          params: null,
          example: 'GET /',
          body: null
        },
        {
          id: 'onboarding',
          method: 'GET',
          path: '/onboarding',
          description: 'User onboarding page',
          params: null,
          example: 'GET /onboarding',
          body: null
        },
        {
          id: 'endpoints-docs',
          method: 'GET',
          path: '/endpoints',
          description: 'API documentation (this page)',
          params: null,
          example: 'GET /endpoints',
          body: null
        }
      ]
    }
  ];

  const copyToClipboard = (text: string, method: string, path: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(`${method}-${path}-${index}`);
    setTimeout(() => setCopiedEndpoint(''), 2000);
  };

  type Endpoint = {
    id: string;
    method: string;
    path: string;
    description: string;
    params: string | null;
    example: string;
    body: Record<string, unknown> | null;
  };

  const testEndpoint = async (endpoint: Endpoint, index: number) => {
    setIsLoading(true);
    setActiveEndpoint(`${endpoint.method}-${endpoint.path}-${index}`);
    
    setTimeout(() => {
      setTestResponse(JSON.stringify({
        status: 200,
        message: 'Success',
        data: { example: 'response', timestamp: new Date().toISOString() }
      }, null, 2));
      setIsLoading(false);
    }, 1500);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pt-16 flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
            <p className="text-gray-600 text-sm">Admin-only API Endpoints</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
                <nav className="space-y-2">
                  {endpoints.map((category, idx) => (
                    <a
                      key={idx}
                      href={`#${category.category.toLowerCase().replace(' ', '-')}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${category.color} text-white`}>
                        {category.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{category.category}</div>
                        <div className="text-sm text-gray-500">{category.endpoints.length} endpoints</div>
                      </div>
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              {endpoints.map((category, categoryIdx) => (
                <div
                  key={categoryIdx}
                  id={category.category.toLowerCase().replace(' ', '-')}
                  className="bg-white rounded-lg shadow-sm border"
                >
                  <div className="px-6 py-4 border-b bg-gray-50 rounded-t-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${category.color} text-white`}>
                        {category.icon}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">{category.category}</h2>
                    </div>
                  </div>

                  <div className="divide-y">
                    {category.endpoints.map((endpoint, endpointIdx) => (
                      <div key={endpointIdx} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMethodColor(endpoint.method)}`}>
                                {endpoint.method}
                              </span>
                              <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                                {endpoint.path}
                              </code>
                            </div>
                            <p className="text-gray-600">{endpoint.description}</p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => copyToClipboard(endpoint.example || endpoint.path, endpoint.method, endpoint.path, endpointIdx)}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copy endpoint"
                            >
                              {copiedEndpoint === `${endpoint.method}-${endpoint.path}-${endpointIdx}` ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => testEndpoint(endpoint, endpointIdx)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Test endpoint"
                              disabled={isLoading}
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {endpoint.params && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Parameters:</h4>
                            <code className="text-sm text-gray-600">{endpoint.params}</code>
                          </div>
                        )}

                        {endpoint.body && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Request Body:</h4>
                            <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                              <code>{JSON.stringify(endpoint.body, null, 2)}</code>
                            </pre>
                          </div>
                        )}

                        {activeEndpoint === `${endpoint.method}-${endpoint.path}-${endpointIdx}` && testResponse && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Response:</h4>
                            <pre className="bg-green-50 border border-green-200 p-3 rounded text-sm overflow-x-auto">
                              <code className="text-green-800">{testResponse}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;