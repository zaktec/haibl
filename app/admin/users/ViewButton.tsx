import Link from 'next/link';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function ViewButton({ user }: { user: User }) {
  return (
    <Link 
      href={`/admin/users?view=${user.id}`}
      className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border rounded inline-block"
    >
      View
    </Link>
  );
}