'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AssignmentNotification() {
  const [show, setShow] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('assigned') === 'true') {
      setShow(true);
      setTimeout(() => setShow(false), 3000);
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
      ✅ Content assigned successfully!
    </div>
  );
}