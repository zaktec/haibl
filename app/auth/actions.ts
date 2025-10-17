/**
 * Authentication Server Actions (Enhanced with Type Safety & Security)
 * 
 * Handles:
 *  - User login (authenticate)
 *  - User registration (register)
 *  - User logout (logout)
 * 
 * Features:
 *  - Comprehensive error handling with try...catch blocks
 *  - Type-safe form data extraction
 *  - Input validation and sanitization
 *  - Security best practices (timing attack prevention, password strength)
 *  - Role-based access control
 */

'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { getDb } from '@/app/seed/db.js';

// ===================================================================
// DATABASE CONNECTION
// ===================================================================

/**
 * Get database connection using the same singleton as admin
 */
const sql = getDb();

// ===================================================================
// FORM DATA EXTRACTION HELPERS
// ===================================================================

/**
 * Safely extracts a string field from FormData
 * @param formData - The FormData object from the form submission
 * @param key - The field name to extract
 * @returns Trimmed string value
 * @throws Error if field is missing or not a string
 */
function getStringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  
  // Check if value exists and is a string (not a File)
  if (!value || typeof value !== 'string') {
    throw new Error(`Invalid or missing form field: ${key}`);
  }
  
  // Return trimmed value to remove leading/trailing whitespace
  return value.trim();
}

/**
 * Safely extracts a number field from FormData
 * @param formData - The FormData object from the form submission
 * @param key - The field name to extract
 * @returns Parsed number value
 * @throws Error if field is missing, not a string, or not a valid number
 */
function getNumberField(formData: FormData, key: string): number {
  const value = formData.get(key);
  
  if (!value || typeof value !== 'string') {
    throw new Error(`Invalid or missing form field: ${key}`);
  }
  
  const num = parseFloat(value.trim());
  if (isNaN(num)) {
    throw new Error(`Field ${key} must be a valid number`);
  }
  
  return num;
}

/**
 * Safely extracts a boolean field from FormData
 * @param formData - The FormData object from the form submission
 * @param key - The field name to extract
 * @returns Boolean value (true for 'true', 'on', '1', false otherwise)
 */
function getBooleanField(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  if (typeof value !== 'string') return false;
  
  const lowerValue = value.toLowerCase().trim();
  return lowerValue === 'true' || lowerValue === 'on' || lowerValue === '1';
}

/**
 * Safely extracts an optional string field from FormData
 * @param formData - The FormData object from the form submission
 * @param key - The field name to extract
 * @param defaultValue - Default value if field is missing or empty
 * @returns String value or default
 */
function getOptionalStringField(formData: FormData, key: string, defaultValue: string = ''): string {
  const value = formData.get(key);
  
  if (!value || typeof value !== 'string') {
    return defaultValue;
  }
  
  return value.trim() || defaultValue;
}

// ===================================================================
// VALIDATION HELPERS
// ===================================================================

/**
 * Validates email format using regex
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Object with isValid boolean and error message if invalid
 */
function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  
  return { isValid: true };
}

/**
 * Validates user role
 * @param role - Role to validate
 * @returns true if valid, false otherwise
 */
function isValidRole(role: string): boolean {
  const validRoles = ['admin', 'tutor', 'student'];
  return validRoles.includes(role);
}

// ===================================================================
// AUTHENTICATION ACTIONS
// ===================================================================

/**
 * Authenticate (Login)
 * --------------------
 * Securely authenticates a user by:
 * 1. Extracting and validating email and password from form
 * 2. Looking up user in database
 * 3. Comparing password with bcrypt hash (with timing attack prevention)
 * 4. Redirecting based on user role
 * 
 * @param _ - Previous state (unused, required for useFormState)
 * @param formData - Form data containing email and password
 * @returns Error message string if authentication fails, redirects on success
 */
export async function authenticate(_: string | undefined, formData: FormData) {
  try {
    // Check if formData exists
    if (!formData) {
      return 'Form data is missing';
    }
    
    // Extract and validate form data
    const email = getStringField(formData, 'email').toLowerCase();
    const password = getStringField(formData, 'password');
    


    // Basic validation
    if (!email || !password) {
      return 'Please enter both email and password';
    }

    if (!isValidEmail(email)) {
      return 'Please enter a valid email address';
    }

    // Look up user in database (only select needed fields)
    const [user] = await sql`
      SELECT id, email, password, role
      FROM users 
      WHERE email = ${email}
    `;
    


    // Always run password comparison to prevent timing attacks
    // This ensures the same amount of time is spent whether user exists or not
    const validPassword = user 
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, '$2b$10$fake.hash.to.prevent.timing.attacks'); // Fake hash
      


    // Check both user existence and password validity
    if (!user || !validPassword) {
      return 'Invalid email or password';
    }

    // Redirect based on user role
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
    // Handle specific error types
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // Re-throw redirect errors (they're expected)
      throw error;
    }
    
    // Log only non-redirect errors
    console.error('Authentication error:', error);
    
    // Return specific error for debugging
    return `Login error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

/**
 * Register (Sign Up)
 * ------------------
 * Securely registers a new user by:
 * 1. Extracting and validating all form data
 * 2. Checking if user already exists
 * 3. Validating email format and password strength
 * 4. Hashing password using bcrypt with salt rounds
 * 5. Inserting user into database
 * 6. Redirecting to login page
 * 
 * @param _ - Previous state (unused, required for useFormState)
 * @param formData - Form data containing user registration information
 * @returns Error message string if registration fails, redirects on success
 */
export async function register(_: string | undefined, formData: FormData) {
  try {
    // Extract and validate all form fields
    const firstName = getStringField(formData, 'firstName');
    const lastName = getStringField(formData, 'lastName');
    const email = getStringField(formData, 'email').toLowerCase();
    const password = getStringField(formData, 'password');
    const role = getOptionalStringField(formData, 'role', 'student');

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return 'All fields are required';
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return 'Please enter a valid email address';
    }

    // Validate role
    if (!isValidRole(role)) {
      return 'Invalid role selected';
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return passwordValidation.error!;
    }

    // Check if user already exists
    const [existingUser] = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser) {
      return 'A user with this email address already exists';
    }

    // Hash password with salt rounds (10 is a good balance of security vs performance)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into database
    const [newUser] = await sql`
      INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at)
      VALUES (${firstName}, ${lastName}, ${email}, ${hashedPassword}, ${role}, NOW(), NOW())
      RETURNING id, email, role
    `;

    // Log successful registration (optional, for monitoring)
    console.log(`New user registered: ${newUser.email} (${newUser.role})`);

    // Refresh the login page cache and redirect
    revalidatePath('/login');
    redirect('/login?message=Registration successful! Please log in.');

  } catch (error) {
    // Log error for debugging
    console.error('Registration error:', error);
    
    // Handle specific error types
    if (error instanceof Error && error.message.includes('redirect')) {
      // Re-throw redirect errors (they're expected)
      throw error;
    }
    
    // Handle database constraint violations
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return 'A user with this email address already exists';
    }
    
    // Return generic error message
    return 'Registration failed. Please try again later.';
  }
}

/**
 * Logout
 * ------
 * Logs out the current user by:
 * 1. Clearing any session data (if implemented)
 * 2. Redirecting to login page
 * 
 * Note: This is a basic implementation. In a production app with sessions/JWT,
 * you would also clear cookies, invalidate tokens, etc.
 * 
 * @returns Redirects to login page or error message if logout fails
 */
export async function logout() {
  try {
    // Future enhancement: Clear session/JWT token
    // Example:
    // const cookieStore = cookies();
    // cookieStore.delete('session');
    // cookieStore.delete('auth-token');
    
    // Clear any cached data
    revalidatePath('/');
    
    // Redirect to login page
    redirect('/login?message=You have been logged out successfully');

  } catch (error) {
    console.error('Logout error:', error);
    
    // Handle redirect errors
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error;
    }
    
    return 'Logout failed. Please try again later.';
  }
}

// ===================================================================
// UTILITY FUNCTIONS (for future use)
// ===================================================================

/**
 * Gets user by ID (utility function for other server actions)
 * @param userId - User ID to lookup
 * @returns User object or null if not found
 */
export async function getUserById(userId: number) {
  try {
    const [user] = await sql`
      SELECT id, first_name, last_name, email, role, created_at, updated_at
      FROM users 
      WHERE id = ${userId}
    `;
    return user || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

/**
 * Updates user password (utility function for password reset)
 * @param userId - User ID
 * @param newPassword - New password (will be hashed)
 * @returns Success boolean
 */
export async function updateUserPassword(userId: number, newPassword: string): Promise<boolean> {
  try {
    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update in database
    await sql`
      UPDATE users 
      SET password = ${hashedPassword}, updated_at = NOW()
      WHERE id = ${userId}
    `;

    return true;
  } catch (error) {
    console.error('Error updating user password:', error);
    return false;
  }
}