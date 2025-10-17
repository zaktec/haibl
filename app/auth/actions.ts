'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { getDb } from '@/app/seed/db.js';

const sql = getDb();

function getStringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (!value || typeof value !== 'string') {
    throw new Error(`Invalid or missing form field: ${key}`);
  }
  return value.trim();
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function authenticate(_: string | undefined, formData: FormData) {
  try {
    if (!formData) {
      return 'Form data is missing';
    }
    
    const email = getStringField(formData, 'email').toLowerCase();
    const password = getStringField(formData, 'password');

    if (!email || !password) {
      return 'Please enter both email and password';
    }

    if (!isValidEmail(email)) {
      return 'Please enter a valid email address';
    }

    const [user] = await sql`
      SELECT id, email, password, role
      FROM users 
      WHERE email = ${email}
    `;

    const validPassword = user 
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, '$2b$10$fake.hash.to.prevent.timing.attacks');

    if (!user || !validPassword) {
      return 'Invalid email or password';
    }

    switch (user.role) {
      case 'admin':
        redirect('/admin');
        break;
      case 'tutor':
        redirect('/tutor');
        break;
      case 'student':
        redirect('/student');
        break;
      default:
        return 'Invalid user role. Please contact support.';
    }

  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error('Authentication error:', error);
    return `Login error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export async function register(_: string | undefined, formData: FormData) {
  try {
    const firstName = getStringField(formData, 'firstName');
    const lastName = getStringField(formData, 'lastName');
    const email = getStringField(formData, 'email').toLowerCase();
    const password = getStringField(formData, 'password');
    const role = formData.get('role')?.toString() || 'student';

    if (!firstName || !lastName || !email || !password) {
      return 'All fields are required';
    }

    if (!isValidEmail(email)) {
      return 'Please enter a valid email address';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    const [existingUser] = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser) {
      return 'A user with this email address already exists';
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await sql`
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES (${firstName}, ${lastName}, ${email}, ${hashedPassword}, ${role})
    `;

    redirect('/auth/login');

  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error('Registration error:', error);
    return `Registration error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}