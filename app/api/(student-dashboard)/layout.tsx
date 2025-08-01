export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-16">
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Student Dashboard</h2>
          </div>
        </div>
        
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}