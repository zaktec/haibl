'use server';

import { redirect } from 'next/navigation';

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!email || !password) {
      return 'Please fill in all fields';
    }
    
    // Route based on email/role
    if (email === 'admin@mathstutorhelp.com') {
      redirect('/admin');
    } else if (email === 'tutor@mathstutorhelp.com') {
      redirect('/tutor');
    } else if (email === 'student@mathstutorhelp.com') {
      redirect('/student');
    } else {
      // Default to student for other emails
      redirect('/student');
    }
  } catch (error) {
    return 'Authentication failed';
  }
}

export async function register(prevState: string | undefined, formData: FormData) {
  try {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!firstName || !lastName || !email || !password) {
      return 'Please fill in all fields';
    }
    
    // For now, just redirect to login after registration
    redirect('/auth/login');
  } catch (error) {
    return 'Registration failed';
  }
}