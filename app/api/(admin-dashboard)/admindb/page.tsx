import Link from 'next/link';

export default function AdminDashboard() {
  const students = [
    { id: 1, name: 'Student 1' },
    { id: 2, name: 'Student 2' },
    { id: 3, name: 'Student 3' },
    { id: 4, name: 'Student 4' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Student List</h1>
      <div className="space-y-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-4 rounded-lg shadow border">
            <Link href={`/api/admindb/${student.id}`} className="text-lg font-semibold text-blue-600 hover:text-blue-800">
              {student.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}