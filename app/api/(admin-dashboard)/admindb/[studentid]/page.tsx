import Link from 'next/link';

export default async function StudentDetail({
  params,
}: {
  params: Promise<{ studentid: string }>;
}) {
  const { studentid } = await params;
  return (
    <div>
      <div className="mb-4">
        <Link href="/api/admindb" className="text-blue-600 hover:text-blue-800">
          ← Back to Student List
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">Student Details</h1>
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-semibold mb-4">Student ID: {studentid}</h2>
        <p className="text-gray-600">Details for student {studentid} will be displayed here.</p>
      </div>
    </div>
  );
}
