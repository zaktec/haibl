import '@/app/ui/global.css';
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
    <div className="onboarding-page pt-16 min-h-screen flex flex-col">
      <div className="bg-white border-b">
        <Headermth />
      </div>
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      
      
        <Footermth />
     
    </div>
  );
}