import Link from 'next/link';

const sidebarItems = [
  { name: 'Students', href: '/tutor', icon: '👥' },
  { name: 'Schedule', href: '/tutor/schedule', icon: '📅' },
  { name: 'Content', href: '/tutor/content', icon: '📚' },
  { name: 'Reports', href: '/tutor/reports', icon: '📊' },
];

function TutorSidebar() {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Tutor Panel</h2>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <Link
          href="/auth/login"
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 hover:text-red-700"
        >
          <span className="mr-3">🚪</span>
          Logout
        </Link>
      </div>
    </div>
  );
}

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-16 flex h-screen bg-gray-50">
      <TutorSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}