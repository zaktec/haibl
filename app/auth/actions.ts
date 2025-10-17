'use server';

export async function authenticate(_: string | undefined, formData: FormData) {
  return 'Authentication temporarily disabled';
}

export async function register(_: string | undefined, formData: FormData) {
  return 'Registration temporarily disabled';
}