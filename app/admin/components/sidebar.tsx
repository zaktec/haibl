/**
 * Admin Sidebar Component
 * 
 * Reusable navigation sidebar for all admin pages providing:
 * - Quick access to all management sections
 * - Visual icons for easy identification
 * - Organized navigation structure
 * - Logout functionality
 * 
 * Navigation Structure:
 * - Dashboard: Main admin overview with statistics
 * - Users: User management (students, tutors, admins)
 * - Content: Learning materials and lessons
 * - Questions: Quiz question bank management
 * - Quizzes: Quiz creation and management
 * - Quiz Questions: Junction table management
 * - Bookings: Tutoring session scheduling
 * - Progress: Student progress tracking
 * - API Docs: Development documentation
 * - Seed Database: Development data seeding
 */
import Link from 'next/link';

// Navigation items configuration with icons and routes
// Organized by functionality for comprehensive admin access
const sidebarItems = [
  { name: 'Dashboard', href: '/admin', icon: '🏠' },
  { name: 'Users', href: '/admin/users', icon: '👥' },
  { name: 'Content', href: '/admin/content', icon: '📚' },
  { name: 'Questions', href: '/admin/questions', icon: '❓' },
  { name: 'Quizzes', href: '/admin/users?page=quizzes', icon: '📝' },
  { name: 'Quiz Questions', href: '/admin?page=quiz-questions', icon: '🔗' },
  { name: 'Bookings', href: '/admin/bookings', icon: '📅' },
  { name: 'Progress', href: '/admin/progress', icon: '📊' },
  { name: 'User Progress', href: '/admin/user-progress', icon: '📈' },
  { name: 'API Docs', href: '/admin/endpoints', icon: '📋' },
  { name: 'Seed Database', href: '/seed', icon: '🌱' },
];

/**
 * Admin Sidebar Component
 * Renders navigation sidebar with all admin management links
 * @returns {JSX.Element} - Sidebar navigation component
 */
export default function AdminSidebar() {
  return (
    // Sidebar container: fixed width, white background, shadow for visual separation
    <div className="w-64 bg-white shadow-lg">
      {/* Sidebar header with admin panel title */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
      </div>
      
      {/* Main navigation menu with all admin management links */}
      <nav className="p-4">
        <ul className="space-y-2">
          {/* Dynamically generate navigation links from sidebarItems array */}
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                {/* Visual icon for quick identification */}
                <span className="mr-3">{item.icon}</span>
                {/* Navigation item label */}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Logout section positioned at bottom with visual separation */}
      <div className="p-4 border-t">
        <Link
          href="/auth/login"
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 hover:text-red-700"
        >
          {/* Logout icon with distinctive red styling */}
          <span className="mr-3">🚪</span>
          Logout
        </Link>
      </div>
    </div>
  );
}