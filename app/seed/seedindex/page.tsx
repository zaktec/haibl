'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SeedResult {
  error?: string;
  message?: string;
  tables_created?: string[];
  data_seeded?: {
    users: number;
    content: number;
    questions: number;
    quizzes: number;
  };
}

export default function SeedPage() {
  const [result, setResult] = useState<SeedResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const response = await fetch('/seed');
      const data = await response.json();
      setResult(data);
    } catch {
      setResult({ error: 'Failed to seed database' });
    }
    setLoading(false);
  };

  const StatusCard = ({ type, title, children }: { type: 'error' | 'success' | 'info' | 'data', title: string, children: React.ReactNode }) => {
    const styles = {
      error: 'bg-red-50 border-red-200 text-red-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      data: 'bg-purple-50 border-purple-200 text-purple-800'
    };
    
    return (
      <div className={`border rounded-lg p-4 ${styles[type]}`}>
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        {children}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Database Setup</h1>
        
        {!result ? (
          <div className="text-center">
            <p className="text-gray-600 mb-6">Click to create tables and seed data</p>
            <button
              onClick={handleSeed}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Setting up...' : 'Create Tables & Seed Data'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {result.error ? (
              <StatusCard type="error" title="❌ Error">
                <p className="text-red-700">{result.error}</p>
              </StatusCard>
            ) : (
              <>
                <StatusCard type="success" title="✅ Success">
                  <p className="text-green-700">{result.message}</p>
                </StatusCard>

                {result.tables_created && (
                  <StatusCard type="info" title="📋 Tables Created">
                    <div className="grid grid-cols-2 gap-2">
                      {result.tables_created.map(table => (
                        <div key={table} className="bg-white px-3 py-2 rounded border">{table}</div>
                      ))}
                    </div>
                  </StatusCard>
                )}

                {result.data_seeded && (
                  <StatusCard type="data" title="📊 Data Seeded">
                    <div className="grid grid-cols-2 gap-4">
                      <div>Users: {result.data_seeded.users}</div>
                      <div>Content: {result.data_seeded.content}</div>
                      <div>Questions: {result.data_seeded.questions}</div>
                      <div>Quizzes: {result.data_seeded.quizzes}</div>
                    </div>
                  </StatusCard>
                )}

                <div className="text-center pt-4">
                  <Link href="/auth/login" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 inline-block">
                    Go to Login Page
                  </Link>
                </div>
              </>
            )}

            <div className="text-center">
              <button onClick={() => setResult(null)} className="text-gray-500 hover:text-gray-700 underline">
                Run Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}