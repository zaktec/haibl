'use server';

import { redirect } from 'next/navigation';

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    // Simplified auth for deployment
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!email || !password) {
      return 'Please fill in all fields';
    }
    
    // For now, just redirect to admin for any login
    redirect('/admin');
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