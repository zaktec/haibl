
export default function StudentDashboardLayout({
  children,
  StudentCourse,
  StudentProgress,  
  StudentToDo
}: {
  children: React.ReactNode;
  StudentCourse: React.ReactNode;
  StudentProgress: React.ReactNode;
  StudentToDo: React.ReactNode;
}) {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Studentsssssss Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          {children}
        </div>
        <div className="space-y-4">
          {StudentCourse}
          {StudentProgress}
          {StudentToDo}
        </div>
      </div>
    </div>
  )}