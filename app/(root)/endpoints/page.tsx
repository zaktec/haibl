"use client"
import React, { useState } from 'react';
import { 
  Code, 
  Play, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  BookOpen, 
  Calendar, 
  HelpCircle,
  Database,
  Settings,
  Ban,
} from 'lucide-react';

const APIDocumentation = () => {
const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);
const [testResponse, setTestResponse] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);


  // API Endpoints Data
  const endpoints = [
     {
      category: 'User Management',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-blue-500',
      endpoints: [
        {
          id: 'users-get',
          method: 'GET',
          path: '/api/users',
          description: 'Get all users with optional filtering',
          params: 'role, year_group, exam_board',
          example: '/api/users?role=student&year_group=10',
          body: null
        },
        {
          id: 'users-post',
          method: 'POST',
          path: '/api/users',
          description: 'Create a new user',
          params: null,
          example: '/api/users',
          body: {
            name: 'John Smith',
            email: 'john@email.com',
            password: 'password123',
            role: 'student',
            year_group: 10,
            target_grade: 'A',
            exam_board: 'AQA',
            parents_name: 'Jane Smith'
          }
        },
        {
          id: 'user-get',
          method: 'GET',
          path: '/api/users/[id]',
          description: 'Get specific user by ID',
          params: null,
          example: '/api/users/123',
          body: null
        },
        {
          id: 'user-put',
          method: 'PUT',
          path: '/api/users/[id]',
          description: 'Update user information',
          params: null,
          example: '/api/users/123',
          body: {
            name: 'John Smith Updated',
            email: 'john.updated@email.com',
            role: 'student',
            active: true
          }
        },
        {
          id: 'user-delete',
          method: 'DELETE',
          path: '/api/users/[id]',
          description: 'Soft delete user (set active = false)',
          params: null,
          example: '/api/users/123',
          body: null
        }
      ]
    },
    {
      category: 'Error Handling',
      icon: <Ban className="w-5 h-5" />,
      color: 'bg-blue-500',
      endpoints: [
        {
          id: 'error-get',
          method: 'GET',
          path: 'endpoints',
          description: 'Get all the endpoints',
          params: null,
          example: '/endpoints',
          body: null
        },
        {
          id: 'users-post',
          method: 'POST',
          path: '/api/users',
          description: 'Create a new user',
          params: null,
          example: '/api/users',
          body: {
            name: 'John Smith',
            email: 'john@email.com',
            password: 'password123',
            role: 'student',
            year_group: 10,
            target_grade: 'A',
            exam_board: 'AQA',
            parents_name: 'Jane Smith'
          }
        },
        {
          id: 'user-get',
          method: 'GET',
          path: '/api/users/[id]',
          description: 'Get specific user by ID',
          params: null,
          example: '/api/users/123',
          body: null
        },
        {
          id: 'user-put',
          method: 'PUT',
          path: '/api/users/[id]',
          description: 'Update user information',
          params: null,
          example: '/api/users/123',
          body: {
            name: 'John Smith Updated',
            email: 'john.updated@email.com',
            role: 'student',
            active: true
          }
        },
        {
          id: 'user-delete',
          method: 'DELETE',
          path: '/api/users/[id]',
          description: 'Soft delete user (set active = false)',
          params: null,
          example: '/api/users/123',
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
          id: 'content-get',
          method: 'GET',
          path: '/api/content',
          description: 'Get all content with optional filtering',
          params: 'type, parent_id, published',
          example: '/api/content?type=lesson&published=true',
          body: null
        },
        {
          id: 'content-post',
          method: 'POST',
          path: '/api/content',
          description: 'Create new content (course, topic, or lesson)',
          params: null,
          example: '/api/content',
          body: {
            parent_id: 1,
            type: 'lesson',
            name: 'Quadratic Equations',
            description: 'Learn to solve quadratic equations',
            code: 'MATH-L001',
            grade_min: 9,
            grade_max: 11,
            published: true
          }
        },
        {
          id: 'content-item-get',
          method: 'GET',
          path: '/api/content/[id]',
          description: 'Get specific content item',
          params: null,
          example: '/api/content/456',
          body: null
        },
        {
          id: 'content-put',
          method: 'PUT',
          path: '/api/content/[id]',
          description: 'Update content item',
          params: null,
          example: '/api/content/456',
          body: {
            name: 'Advanced Quadratic Equations',
            description: 'Updated description',
            published: true
          }
        },
        {
          id: 'content-delete',
          method: 'DELETE',
          path: '/api/content/[id]',
          description: 'Delete content item',
          params: null,
          example: '/api/content/456',
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
          id: 'bookings-get',
          method: 'GET',
          path: '/api/bookings',
          description: 'Get all bookings with tutor/student details',
          params: 'tutor_id, student_id, status, date_from, date_to',
          example: '/api/bookings?status=scheduled&tutor_id=123',
          body: null
        },
        {
          id: 'bookings-post',
          method: 'POST',
          path: '/api/bookings',
          description: 'Create new booking/session',
          params: null,
          example: '/api/bookings',
          body: {
            tutor_id: 1,
            student_id: 2,
            scheduled_start: '2025-07-28T14:00:00Z',
            scheduled_end: '2025-07-28T15:00:00Z',
            content_id: 5,
            cost: 25.00
          }
        },
        {
          id: 'booking-get',
          method: 'GET',
          path: '/api/bookings/[id]',
          description: 'Get specific booking details',
          params: null,
          example: '/api/bookings/789',
          body: null
        },
        {
          id: 'booking-put',
          method: 'PUT',
          path: '/api/bookings/[id]',
          description: 'Update booking (complete session, add notes)',
          params: null,
          example: '/api/bookings/789',
          body: {
            status: 'completed',
            session_notes: 'Great progress on algebra',
            homework_set: 'Complete exercises 1-10',
            rating: 5
          }
        }
      ]
    },
    {
      category: 'Progress Tracking',
      icon: <Database className="w-5 h-5" />,
      color: 'bg-orange-500',
      endpoints: [
        {
          id: 'progress-get',
          method: 'GET',
          path: '/api/progress',
          description: 'Get student progress records',
          params: 'user_id, content_id, status',
          example: '/api/progress?user_id=123&status=completed',
          body: null
        },
        {
          id: 'progress-post',
          method: 'POST',
          path: '/api/progress',
          description: 'Create or update progress record',
          params: null,
          example: '/api/progress',
          body: {
            user_id: 2,
            content_id: 5,
            completion: 75,
            status: 'in_progress',
            grade: 8.5,
            strengths: 'Good understanding of concepts',
            areas_for_improvement: 'Need more practice with word problems',
            sessions_count: 3,
            homework: 'Complete chapter 5 exercises',
            next_lesson_plan: 'Move to advanced topics'
          }
        }
      ]
    },
    {
      category: 'Assessment System',
      icon: <HelpCircle className="w-5 h-5" />,
      color: 'bg-red-500',
      endpoints: [
        {
          id: 'questions-get',
          method: 'GET',
          path: '/api/questions',
          description: 'Get quiz questions with filtering',
          params: 'type, grade_min, grade_max, active',
          example: '/api/questions?type=multiple_choice&grade_min=9',
          body: null
        },
        {
          id: 'questions-post',
          method: 'POST',
          path: '/api/questions',
          description: 'Create new question',
          params: null,
          example: '/api/questions',
          body: {
            text: 'What is 2x + 5 = 13?',
            type: 'multiple_choice',
            correct_answer: '4',
            options: ['2', '4', '6', '8'],
            grade_min: 9,
            grade_max: 11
          }
        },
        {
          id: 'quizzes-get',
          method: 'GET',
          path: '/api/quizzes',
          description: 'Get all quizzes',
          params: 'content_id, published',
          example: '/api/quizzes?published=true',
          body: null
        },
        {
          id: 'attempts-post',
          method: 'POST',
          path: '/api/attempts',
          description: 'Submit quiz attempt',
          params: null,
          example: '/api/attempts',
          body: {
            user_id: 2,
            quiz_id: 1,
            score: 85,
            completed: true
          }
        }
      ]
    },
    {
      category: 'Student Management',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-indigo-500',
      endpoints: [
        {
          id: 'students-get',
          method: 'GET',
          path: '/api/students',
          description: 'Get all students with filtering',
          params: 'year_group, target_grade, active',
          example: '/api/students?year_group=10&active=true',
          body: null
        },
        {
          id: 'student-create',
          method: 'POST',
          path: '/api/students',
          description: 'Create new student account',
          params: null,
          example: '/api/students',
          body: {
            name: 'Alice Johnson',
            email: 'alice@email.com',
            year_group: 11,
            target_grade: 'A*',
            exam_board: 'Edexcel',
            parents_name: 'Sarah Johnson'
          }
        },
        {
          id: 'student-update',
          method: 'PUT',
          path: '/api/students/[id]',
          description: 'Update student information',
          params: null,
          example: '/api/students/123',
          body: {
            target_grade: 'A*',
            year_group: 12,
            active: true
          }
        }
      ]
    },
    {
      category: 'Tutor Management',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-teal-500',
      endpoints: [
        {
          id: 'tutors-get',
          method: 'GET',
          path: '/api/tutors',
          description: 'Get all tutors with specializations',
          params: 'subject, grade_level, available',
          example: '/api/tutors?subject=mathematics&available=true',
          body: null
        },
        {
          id: 'tutor-create',
          method: 'POST',
          path: '/api/tutors',
          description: 'Create new tutor account',
          params: null,
          example: '/api/tutors',
          body: {
            name: 'Dr. Smith',
            email: 'smith@email.com',
            specializations: ['Algebra', 'Calculus'],
            hourly_rate: 35.00,
            qualifications: 'PhD Mathematics'
          }
        },
        {
          id: 'tutor-update',
          method: 'PUT',
          path: '/api/tutors/[id]',
          description: 'Update tutor profile and availability',
          params: null,
          example: '/api/tutors/456',
          body: {
            hourly_rate: 40.00,
            available: true,
            specializations: ['Advanced Calculus']
          }
        }
      ]
    },
    {
      category: 'Admin Settings',
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-gray-500',
      endpoints: [
        {
          id: 'settings-get',
          method: 'GET',
          path: '/api/settings',
          description: 'Get system settings',
          params: null,
          example: '/api/settings',
          body: null
        },
        {
          id: 'settings-put',
          method: 'PUT',
          path: '/api/settings',
          description: 'Update system settings',
          params: null,
          example: '/api/settings',
          body: {
            platform_name: 'MathsMaster Pro',
            default_session_length: '60',
            currency: 'GBP'
          }
        },
        {
          id: 'reset-log',
          method: 'GET',
          path: '/api/admin/reset-log',
          description: 'Get admin reset operations log',
          params: 'admin_id, target_user_id',
          example: '/api/admin/reset-log',
          body: null
        },
        {
          id: 'admin-dashboard',
          method: 'GET',
          path: '/api/admindb',
          description: 'Get admin dashboard with student list',
          params: null,
          example: '/api/admindb',
          body: null
        },
        {
          id: 'student-detail',
          method: 'GET',
          path: '/api/admindb/[studentid]',
          description: 'Get individual student details',
          params: null,
          example: '/api/admindb/1',
          body: null
        },
        {
          id: 'tutor-dashboard',
          method: 'GET',
          path: '/api/tutordb',
          description: 'Get tutor dashboard',
          params: null,
          example: '/api/tutordb',
          body: null
        },
        {
          id: 'student-dashboard',
          method: 'GET',
          path: '/api/studentdb',
          description: 'Get student dashboard',
          params: null,
          example: '/api/studentdb',
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
    
    // Simulate API call
    setTimeout(() => {
      setTestResponse(JSON.stringify({
        status: 200,
        message: 'Success',
        data: endpoint.method === 'GET' ? 
          { example: 'response', timestamp: new Date().toISOString() } :
          { message: 'Operation completed successfully', id: Math.floor(Math.random() * 1000) }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
              <p className="text-gray-600 mt-1">Maths Learning Platform Endpoints</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {endpoints.reduce((total, category) => total + category.endpoints.length, 0)} Endpoints
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Categories */}
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

          {/* Main Content - Endpoints */}
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

                      {/* Parameters */}
                      {endpoint.params && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Query Parameters:</h4>
                          <div className="bg-gray-50 p-3 rounded">
                            <code className="text-sm text-gray-700">{endpoint.params}</code>
                          </div>
                        </div>
                      )}

                      {/* Request Body */}
                      {endpoint.body && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Request Body:</h4>
                          <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                            <pre className="text-green-400 text-sm">
                              {JSON.stringify(endpoint.body, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Example URL */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Example:</h4>
                        <div className="bg-blue-50 p-3 rounded">
                          <code className="text-sm text-blue-800">{endpoint.example}</code>
                        </div>
                      </div>

                      {/* Test Response */}
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

        {/* Quick Start Guide */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white p-8">
          <h2 className="text-2xl font-bold mb-4">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">1. Authentication</h3>
              <p className="text-blue-100 text-sm">Include JWT token in Authorization header for protected endpoints.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Content-Type</h3>
              <p className="text-blue-100 text-sm">Set Content-Type: application/json for POST/PUT requests.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Error Handling</h3>
              <p className="text-blue-100 text-sm">All endpoints return consistent error format with status codes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;