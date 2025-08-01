import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import Header from 'app/components/Header';
import Footer from 'app/components/Footer';

import { Metadata } from 'next';

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
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        {children}
        <Footer />


      </body>
    </html>
  );
}