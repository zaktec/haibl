import MailForm from '@/app/ui/root/MailForm';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'MTH - Onboarding',
  description: 'Book your place in our Maths Revision Classes in Levenshulme, Manchester. GCSE Foundation, Higher and KS3 classes available starting October 2025.',
  metadataBase: null,
  openGraph: {
    title: 'MTH - Onboarding',
    description: 'Book your place in our Maths Revision Classes in Levenshulme, Manchester. GCSE Foundation, Higher and KS3 classes available starting October 2025.',
  },
};
export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <MailForm />
    </main>
  );
}