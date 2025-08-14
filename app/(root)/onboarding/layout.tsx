import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import Header from '@/app/ui/root/Headermth';
import Footer from '@/app/ui/root/Footermth';

import { Metadata } from 'next';
import Headermth from '@/app/ui/root/Headermth';
import Footermth from '@/app/ui/root/Footermth';

export const metadata: Metadata = {
  title: {
    template: '%s | HaiBL | Next.js Learn Dashboard',
    default: 'HaiBL | Next.js Learn Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <div className="pt-16">
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
          </div>
        </div>
        
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Headermth />
          {children}
        </main>
      </div>
    </div>
  );
}