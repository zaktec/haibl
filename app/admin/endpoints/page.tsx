'use client';

import React, { useState } from 'react';
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
          method: 'POST',
          path: '/api/auth/login',
          description: 'Authenticate user and get session',
          params: null,
          example: 'POST /api/auth/login',
          body: { email: 'admin@mathstutorhelp.com', password: 'password123' }
        }
      ]
    },
    {
      category: 'User Management',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-blue-500',
      endpoints: [
        {
          id: 'get-users',
          method: 'GET',
          path: '/admin/users',
          description: 'Get all users (Admin only)',
          params: null,
          example: 'GET /admin/users',
          body: null
        },
        {
          id: 'create-user',
          method: 'POST',
          path: '/admin/users',
          description: 'Create new user (Admin only)',
          params: null,
          example: 'POST /admin/users',
          body: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'student' }
        },
        {
          id: 'delete-user',
          method: 'DELETE',
          path: '/admin/users/:id',
          description: 'Delete user (Admin only)',
          params: 'id: User ID',
          example: 'DELETE /admin/users/1',
          body: null
        }
      ]
    },
    {
      category: 'Content Management',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-green-500',
      endpoints: [
        {
          id: 'get-content',
          method: 'GET',
          path: '/admin/content',
          description: 'Get all content items',
          params: null,
          example: 'GET /admin/content',
          body: null
        },
        {
          id: 'create-content',
          method: 'POST',
          path: '/admin/content',
          description: 'Create new content item',
          params: null,
          example: 'POST /admin/content',
          body: { name: 'Algebra Basics', type: 'lesson', gradeMin: 9, gradeMax: 11, published: true }
        },
        {
          id: 'delete-content',
          method: 'DELETE',
          path: '/admin/content/:id',
          description: 'Delete content item',
          params: 'id: Content ID',
          example: 'DELETE /admin/content/1',
          body: null
        }
      ]
    },
    {
      category: 'Booking Management',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-purple-500',
      endpoints: [
        {
          id: 'get-bookings',
          method: 'GET',
          path: '/admin/bookings',
          description: 'Get all bookings',
          params: null,
          example: 'GET /admin/bookings',
          body: null
        },
        {
          id: 'delete-booking',
          method: 'DELETE',
          path: '/admin/bookings/:id',
          description: 'Cancel/delete booking',
          params: 'id: Booking ID',
          example: 'DELETE /admin/bookings/1',
          body: null
        }
      ]
    },
    {
      category: 'Database',
      icon: <Database className="w-5 h-5" />,
      color: 'bg-orange-500',
      endpoints: [
        {
          id: 'seed-database',
          method: 'GET',
          path: '/seed',
          description: 'Seed database with sample data',
          params: null,
          example: 'GET /seed',
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
                              disabled={isLoading && activeEndpoint === `${endpoint.method}-${endpoint.path}-${endpointIdx}`}
                              className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                              <Play className="w-3 h-3" />
                              <span className="text-xs">Test</span>
                            </button>
                          </div>
                        </div>

                        {endpoint.params && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Parameters:</h4>
                            <div className="bg-gray-50 p-3 rounded">
                              <code className="text-sm text-gray-700">{endpoint.params}</code>
                            </div>
                          </div>
                        )}

                        {endpoint.body && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Request Body:</h4>
                            <div className="bg-gray-50 p-3 rounded">
                              <pre className="text-sm text-gray-700">{JSON.stringify(endpoint.body, null, 2)}</pre>
                            </div>
                          </div>
                        )}

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Example:</h4>
                          <div className="bg-blue-50 p-3 rounded">
                            <code className="text-sm text-blue-800">{endpoint.example}</code>
                          </div>
                        </div>

                        {activeEndpoint === `${endpoint.method}-${endpoint.path}-${endpointIdx}` && (
                          <div className="mt-4 p-4 bg-gray-50 rounded">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Response:</h4>
                            {isLoading ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                <span className="text-sm text-gray-600">Testing endpoint...</span>
                              </div>
                            ) : (
                              <div className="bg-gray-900 p-3 rounded overflow-x-auto">
                                <pre className="text-green-400 text-xs">{testResponse}</pre>
                              </div>
                            )}
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