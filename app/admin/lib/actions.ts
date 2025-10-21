/**
 * Database Actions Module (Enhanced with Type Safety)
 * 
 * This module contains all server-side database operations for the math tutoring platform.
 * It provides CRUD operations for users, content, quizzes, questions, bookings, and progress.
 * All functions use PostgreSQL with the 'postgres' library and include proper error handling.
 * 
 * Key Features:
 * - Centralized database operations
 * - Server-side form actions with type-safe form data extraction
 * - Path revalidation for cache management
 * - Comprehensive error handling
 * - Support for all database tables
 * - Protection against SQL injection and form data type issues
 */
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/app/seed/db';

// Initialize database connection only when needed
function getSql() {
  try {
    return getDb();
  } catch (error) {
    console.error('Database connection failed:', error);
    return null;
  }
}

// =============================================================================
// FORM DATA EXTRACTION HELPERS
// =============================================================================

/**
 * Safely extracts a string field from FormData
 * @param formData - The FormData object from the form submission
 * @param key - The field name to extract
 * @returns Trimmed string value
 * @throws Error if field is missing or not a string
 */
function getStringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  
  if (!value || typeof value !== 'string') {
    throw new Error(`Invalid or missing form field: ${key}`);
  }
  
  return value.trim();
}

/**
 * Safely extracts an optional string field from FormData
 * @param formData - The FormData object from the form submission
 * @param key - The field name to extract
 * @param defaultValue - Default value if field is missing or empty
 * @returns String value or default (can be null for database nullable fields)
 */
function getOptionalStringField(formData: FormData, key: string, defaultValue: string | null = ''): string | null {
  const value = formData.get(key);
  
  if (!value || typeof value !== 'string') {
    return defaultValue;
  }
  
  const trimmed = value.trim();
  return trimmed || defaultValue;
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
 * Safely extracts an optional number field from FormData
 * @param formData - The FormData object from the form submission
 * @param key - The field name to extract
 * @returns Parsed number value or null
 */
function getOptionalNumberField(formData: FormData, key: string): number | null {
  const value = formData.get(key);
  
  if (!value || typeof value !== 'string') {
    return null;
  }
  
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  
  const num = parseFloat(trimmed);
  return isNaN(num) ? null : num;
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
 * Safely extracts an integer field from FormData
 * @param formData - The FormData object from the form submission
 * @param key - The field name to extract
 * @returns Parsed integer value
 * @throws Error if field is missing, not a string, or not a valid integer
 */
function getIntegerField(formData: FormData, key: string): number {
  const value = formData.get(key);
  
  if (!value || typeof value !== 'string') {
    throw new Error(`Invalid or missing form field: ${key}`);
  }
  
  const num = parseInt(value.trim(), 10);
  if (isNaN(num)) {
    throw new Error(`Field ${key} must be a valid integer`);
  }
  
  return num;
}

/**
 * Safely extracts an optional integer field from FormData
 * @param formData - The FormData object from the form submission
 * @param key - The field name to extract
 * @returns Parsed integer value or null
 */
function getOptionalIntegerField(formData: FormData, key: string): number | null {
  const value = formData.get(key);
  
  if (!value || typeof value !== 'string') {
    return null;
  }
  
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  
  const num = parseInt(trimmed, 10);
  return isNaN(num) ? null : num;
}

// =============================================================================
// DATABASE QUERY FUNCTIONS
// =============================================================================

/**
 * Retrieves all users from the database
 * @returns Promise<Array> - Array of user objects ordered by creation date (newest first)
 */
export async function getAllUsers() {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`SELECT * FROM users ORDER BY created_at DESC`;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

/**
 * Retrieves all content items from the database
 * @returns Promise<Array> - Array of content objects ordered by creation date (newest first)
 */
export async function getAllContent() {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`SELECT * FROM content ORDER BY created_at DESC`;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw new Error('Failed to fetch content');
  }
}

/**
 * Retrieves all bookings with tutor and student names
 * Uses LEFT JOINs to include tutor and student information
 * @returns Promise<Array> - Array of booking objects with tutor/student names
 */
export async function getAllBookings() {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`
      SELECT b.*, 
             u1.first_name as tutor_first_name, u1.last_name as tutor_last_name,
             u2.first_name as student_first_name, u2.last_name as student_last_name
      FROM bookings b
      LEFT JOIN users u1 ON b.tutor_id = u1.id
      LEFT JOIN users u2 ON b.student_id = u2.id
      ORDER BY b.created_at DESC
    `;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

/**
 * Retrieves all quizzes with associated content names
 * Uses LEFT JOIN to include content information
 * @returns Promise<Array> - Array of quiz objects with content names
 */
export async function getAllQuizzes() {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`
      SELECT q.*, c.name as content_name
      FROM quizzes q
      LEFT JOIN content c ON q.content_id = c.id
      ORDER BY q.id DESC
    `;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw new Error('Failed to fetch quizzes');
  }
}

/**
 * Retrieves all quizzes for dropdown selection
 * @returns Promise<Array> - Array of quiz objects with id, name, and code
 */
export async function getAllQuizzesForSelect() {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`
      SELECT id, name, code
      FROM quizzes
      ORDER BY name ASC
    `;
  } catch (error) {
    console.error('Error fetching quizzes for select:', error);
    throw new Error('Failed to fetch quizzes');
  }
}

/**
 * Retrieves all unique topics from questions
 * @returns Promise<Array> - Array of unique topic strings
 */
export async function getAllTopics() {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`
      SELECT DISTINCT topic
      FROM questions
      WHERE topic IS NOT NULL AND topic != ''
      ORDER BY topic ASC
    `;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw new Error('Failed to fetch topics');
  }
}

/**
 * Retrieves all questions from the database
 * @returns Promise<Array> - Array of question objects ordered by ID (newest first)
 */
export async function getAllQuestions() {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`SELECT * FROM questions ORDER BY id DESC`;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw new Error('Failed to fetch questions');
  }
}

/**
 * Retrieves all questions with their associated quiz information
 * @returns Promise<Array> - Array of question objects with quiz names
 */
export async function getAllQuestionsWithQuizzes() {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`
      SELECT q.*, 
             STRING_AGG(DISTINCT qz.name, ', ') as quiz_names,
             STRING_AGG(DISTINCT qz.code, ', ') as quiz_codes
      FROM questions q
      LEFT JOIN quiz_questions qq ON q.id = qq.question_id
      LEFT JOIN quizzes qz ON qq.quiz_id = qz.id
      GROUP BY q.id, q.text, q.type, q.correct_answer, q.options, q.grade_min, q.grade_max, 
               q.marks, q.active, q.topic, q.difficulty_level, q.explanation, q.solution_url, 
               q.randomize_options, q.image_url, q.attachment_url, q.created_at, q.updated_at
      ORDER BY q.id DESC
    `;
  } catch (error) {
    console.error('Error fetching questions with quizzes:', error);
    throw new Error('Failed to fetch questions with quizzes');
  }
}

/**
 * Generates database summary statistics for admin dashboard
 * Counts records in all major tables for overview display
 * @returns Promise<Object> - Object containing count statistics for each table
 */
export async function getDatabaseSummary() {
  const defaultSummary = {
    users: 0,
    content: 0,
    quizzes: 0,
    questions: 0,
    quiz_questions: 0,
    bookings: 0,
    progress: 0,
    session_progress: 0
  };
  
  try {
    const sql = getSql();
    if (!sql) return defaultSummary;
    const counts = await Promise.allSettled([
      sql`SELECT COUNT(*) as count FROM users`,
      sql`SELECT COUNT(*) as count FROM content`,
      sql`SELECT COUNT(*) as count FROM quizzes`,
      sql`SELECT COUNT(*) as count FROM questions`,
      sql`SELECT COUNT(*) as count FROM quiz_questions`,
      sql`SELECT COUNT(*) as count FROM bookings`,
      sql`SELECT COUNT(*) as count FROM user_progress`,
      sql`SELECT COUNT(*) as count FROM user_session_progress`
    ]);
    
    const getCount = (index: number) => 
      counts[index].status === 'fulfilled' ? parseInt(counts[index].value[0].count as string) : 0;
    
    return {
      users: getCount(0),
      content: getCount(1),
      quizzes: getCount(2),
      questions: getCount(3),
      quiz_questions: getCount(4),
      bookings: getCount(5),
      progress: getCount(6),
      session_progress: getCount(7)
    };
  } catch (error) {
    console.error('Error fetching database summary:', error);
    return defaultSummary;
  }
}

// =============================================================================
// USER MANAGEMENT ACTIONS
// =============================================================================

/**
 * Creates a new user in the database
 * Extracts form data and inserts into users table with validation
 * @param {FormData} formData - Form data containing user information
 * @returns {Promise<Object>} - Success/error response object
 */
export async function createUserAction(formData: FormData) {
  try {
    const firstName = getStringField(formData, 'firstName');
    const lastName = getStringField(formData, 'lastName');
    const email = getStringField(formData, 'email');
    const password = getStringField(formData, 'password');
    const role = getStringField(formData, 'role');
    const yearGroup = getOptionalIntegerField(formData, 'yearGroup');
    const targetGrade = getOptionalIntegerField(formData, 'targetGrade');
    const school = getOptionalStringField(formData, 'school', null);
    const course = getOptionalStringField(formData, 'course', null);
    const contactNumber = getOptionalStringField(formData, 'contactNumber', null);
    const parentsName = getOptionalStringField(formData, 'parentsName', null);
    const imageUrl = getOptionalStringField(formData, 'imageUrl', null);
    const attachmentUrl = getOptionalStringField(formData, 'attachmentUrl', null);
    
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    
    const userFields = [
      'first_name', 'last_name', 'email', 'password', 'role', 'year_group', 
      'target_grade', 'school', 'course', 'contact_number', 'parents_name', 
      'image_url', 'attachment_url'
    ];
    
    const userValues = [
      firstName, lastName, email, password, role, yearGroup, 
      targetGrade, school, course, contactNumber, parentsName, 
      imageUrl, attachmentUrl
    ];
    
    await sql`
      INSERT INTO users (${sql(userFields)})
      VALUES (${sql(userValues)})
    `;
    
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create user' };
  }
}

/**
 * Updates an existing user's information
 * Extracts form data and updates user record with comprehensive field support
 * @param {number} id - User ID to update
 * @param {FormData} formData - Form data containing updated user information
 * @returns {Promise<Object>} - Success/error response object
 */
export async function updateUserAction(id: number, formData: FormData) {
  try {
    const firstName = getStringField(formData, 'firstName');
    const lastName = getStringField(formData, 'lastName');
    const email = getStringField(formData, 'email');
    const role = getStringField(formData, 'role');
    const yearGroup = getOptionalIntegerField(formData, 'yearGroup');
    const targetGrade = getOptionalIntegerField(formData, 'targetGrade');
    const currentGrade = getOptionalIntegerField(formData, 'currentGrade');
    const examBoard = getOptionalStringField(formData, 'examBoard', null);
    const school = getOptionalStringField(formData, 'school', null);
    const contactNumber = getOptionalStringField(formData, 'contactNumber', null);
    const classPreference = getOptionalStringField(formData, 'classPreference', null);
    const bookingOption = getOptionalStringField(formData, 'bookingOption', null);
    const paymentPreference = getOptionalStringField(formData, 'paymentPreference', null);
    const travelArrangement = getOptionalStringField(formData, 'travelArrangement', null);
    const communicationMethod = getOptionalStringField(formData, 'communicationMethod', null);
    const communicationOther = getOptionalStringField(formData, 'communicationOther', null);
    const parentsName = getOptionalStringField(formData, 'parentsName', null);
    const imageUrl = getOptionalStringField(formData, 'imageUrl', null);
    const attachmentUrl = getOptionalStringField(formData, 'attachmentUrl', null);
    
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`
      UPDATE users SET 
        first_name = ${firstName}, 
        last_name = ${lastName}, 
        email = ${email}, 
        role = ${role}, 
        year_group = ${yearGroup}, 
        target_grade = ${targetGrade}, 
        school = ${school}, 
        contact_number = ${contactNumber}, 
        parents_name = ${parentsName},
        image_url = ${imageUrl},
        attachment_url = ${attachmentUrl},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update user' };
  }
}

/**
 * Deletes a user from the database
 * Permanently removes user record (CASCADE will handle related records)
 * @param {number} id - User ID to delete
 * @returns {Promise<Object>} - Success/error response object
 */
export async function deleteUserAction(id: number) {
  try {
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`DELETE FROM users WHERE id = ${id}`;
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { error: 'Failed to delete user' };
  }
}

// =============================================================================
// CONTENT MANAGEMENT ACTIONS
// =============================================================================

/**
 * Creates new learning content in the database
 * Supports different content types (lesson, exercise, quiz) with grade ranges
 * @param {FormData} formData - Form data containing content information
 * @returns {Promise<Object>} - Success/error response object
 */
export async function createContentAction(formData: FormData) {
  try {
    const clipNumber = getOptionalStringField(formData, 'clipNumber', null);
    const name = getStringField(formData, 'name');
    const topic = getOptionalStringField(formData, 'topic', null);
    const contentType = getStringField(formData, 'contentType');
    const tier = getOptionalStringField(formData, 'tier', 'Foundation');
    const gradeMin = getIntegerField(formData, 'gradeMin');
    const gradeMax = getIntegerField(formData, 'gradeMax');
    const videoUrl = getOptionalStringField(formData, 'videoUrl', null);
    const imageUrl = getOptionalStringField(formData, 'imageUrl', null);
    const attachmentUrl = getOptionalStringField(formData, 'attachmentUrl', null);
    const published = getBooleanField(formData, 'published');
    
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`
      INSERT INTO content (clip_number, name, topic, content_type, tier, grade_min, grade_max, video_url, image_url, attachment_url, published)
      VALUES (${clipNumber}, ${name}, ${topic}, ${contentType}, ${tier}, ${gradeMin}, ${gradeMax}, ${videoUrl}, ${imageUrl}, ${attachmentUrl}, ${published})
    `;
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    console.error('Error creating content:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create content' };
  }
}

export async function updateContentAction(id: number, formData: FormData) {
  try {
    const clipNumber = getOptionalStringField(formData, 'clipNumber', null);
    const name = getStringField(formData, 'name');
    const topic = getOptionalStringField(formData, 'topic', null);
    const contentType = getStringField(formData, 'contentType');
    const tier = getOptionalStringField(formData, 'tier', 'Foundation');
    const gradeMin = getIntegerField(formData, 'gradeMin');
    const gradeMax = getIntegerField(formData, 'gradeMax');
    const videoUrl = getOptionalStringField(formData, 'videoUrl', null);
    const imageUrl = getOptionalStringField(formData, 'imageUrl', null);
    const attachmentUrl = getOptionalStringField(formData, 'attachmentUrl', null);
    const published = getBooleanField(formData, 'published');
    
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`
      UPDATE content SET 
        clip_number = ${clipNumber}, 
        name = ${name}, 
        topic = ${topic}, 
        content_type = ${contentType}, 
        tier = ${tier}, 
        grade_min = ${gradeMin}, 
        grade_max = ${gradeMax}, 
        video_url = ${videoUrl}, 
        image_url = ${imageUrl}, 
        attachment_url = ${attachmentUrl}, 
        published = ${published},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    console.error('Error updating content:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update content' };
  }
}

export async function deleteContentAction(id: number) {
  try {
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`DELETE FROM content WHERE id = ${id}`;
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    console.error('Error deleting content:', error);
    return { error: 'Failed to delete content' };
  }
}

// =============================================================================
// BOOKING MANAGEMENT ACTIONS
// =============================================================================

/**
 * Creates a new tutoring session booking
 * Links tutor and student with scheduled time slots and session details
 * @param {FormData} formData - Form data containing booking information
 * @returns {Promise<Object>} - Success/error response object
 */
export async function createBookingAction(formData: FormData) {
  try {
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    
    const tutorId = getIntegerField(formData, 'tutorId');
    const studentId = getIntegerField(formData, 'studentId');
    const sessionType = getStringField(formData, 'sessionType');
    const deliveryMode = getStringField(formData, 'deliveryMode');
    const scheduledStart = getStringField(formData, 'scheduledStart');
    const scheduledEnd = getStringField(formData, 'scheduledEnd');
    const location = getOptionalStringField(formData, 'location', null);
    const meetingLink = getOptionalStringField(formData, 'meetingLink', null);
    const sessionTopic = getOptionalStringField(formData, 'sessionTopic', null);
    const sessionObjectives = getOptionalStringField(formData, 'sessionObjectives', null);
    const specialRequirements = getOptionalStringField(formData, 'specialRequirements', null);
    const preparationNotes = getOptionalStringField(formData, 'preparationNotes', null);
    const expectedDuration = getOptionalIntegerField(formData, 'expectedDuration') || 60;
    const maxParticipants = getOptionalIntegerField(formData, 'maxParticipants') || 1;
    const status = getStringField(formData, 'status');
    const notes = getOptionalStringField(formData, 'notes', null);
    
    await sql`
      INSERT INTO bookings (tutor_id, student_id, session_type, delivery_mode, scheduled_start, scheduled_end, location, meeting_link, session_topic, session_objectives, special_requirements, preparation_notes, expected_duration_minutes, max_participants, status, notes)
      VALUES (${tutorId}, ${studentId}, ${sessionType}, ${deliveryMode}, ${scheduledStart}, ${scheduledEnd}, ${location}, ${meetingLink}, ${sessionTopic}, ${sessionObjectives}, ${specialRequirements}, ${preparationNotes}, ${expectedDuration}, ${maxParticipants}, ${status}, ${notes})
    `;
    revalidatePath('/admin/bookings');
    return { success: true };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create booking' };
  }
}

export async function updateBookingAction(id: number, formData: FormData) {
  try {
    const tutorId = getIntegerField(formData, 'tutorId');
    const studentId = getIntegerField(formData, 'studentId');
    const sessionType = getStringField(formData, 'sessionType');
    const deliveryMode = getStringField(formData, 'deliveryMode');
    const scheduledStart = getStringField(formData, 'scheduledStart');
    const scheduledEnd = getStringField(formData, 'scheduledEnd');
    const location = getOptionalStringField(formData, 'location', null);
    const maxParticipants = getOptionalIntegerField(formData, 'maxParticipants') || 1;
    const status = getStringField(formData, 'status');
    const notes = getOptionalStringField(formData, 'notes', null);
    
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`
      UPDATE bookings SET 
        tutor_id = ${tutorId}, 
        student_id = ${studentId}, 
        session_type = ${sessionType}, 
        delivery_mode = ${deliveryMode}, 
        scheduled_start = ${scheduledStart}, 
        scheduled_end = ${scheduledEnd}, 
        location = ${location}, 
        max_participants = ${maxParticipants}, 
        status = ${status}, 
        notes = ${notes},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    revalidatePath('/admin/bookings');
    return { success: true };
  } catch (error) {
    console.error('Error updating booking:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update booking' };
  }
}

export async function deleteBookingAction(id: number) {
  try {
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`DELETE FROM bookings WHERE id = ${id}`;
    revalidatePath('/admin/bookings');
    return { success: true };
  } catch (error) {
    console.error('Error deleting booking:', error);
    return { error: 'Failed to delete booking' };
  }
}

// =============================================================================
// QUIZ MANAGEMENT ACTIONS
// =============================================================================

/**
 * Creates a new quiz with associated content
 * Supports time limits, calculator settings, and publication status
 * @param {FormData} formData - Form data containing quiz information
 * @returns {Promise<Object>} - Success/error response object
 */
export async function createQuizAction(formData: FormData) {
  try {
    const name = getStringField(formData, 'name');
    const code = getStringField(formData, 'code');
    const contentId = getIntegerField(formData, 'contentId');
    const timeLimit = getIntegerField(formData, 'timeLimit');
    const published = getBooleanField(formData, 'published');
    const calculatorAllowed = getBooleanField(formData, 'calculatorAllowed');
    const attemptLimit = getOptionalIntegerField(formData, 'attemptLimit') || 0;
    const shuffleQuestions = getBooleanField(formData, 'shuffleQuestions');
    const passMark = getOptionalIntegerField(formData, 'passMark');
    const imageUrl = getOptionalStringField(formData, 'imageUrl', null);
    const attachmentUrl = getOptionalStringField(formData, 'attachmentUrl', null);
    
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`
      INSERT INTO quizzes (name, code, content_id, time_limit, published, calculator_allowed, attempt_limit, shuffle_questions, pass_mark, image_url, attachment_url)
      VALUES (${name}, ${code}, ${contentId}, ${timeLimit}, ${published}, ${calculatorAllowed}, ${attemptLimit}, ${shuffleQuestions}, ${passMark}, ${imageUrl}, ${attachmentUrl})
    `;
    revalidatePath('/admin/quizzes');
    return { success: true };
  } catch (error) {
    console.error('Error creating quiz:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create quiz' };
  }
}

export async function updateQuizAction(id: number, formData: FormData) {
  try {
    const name = getStringField(formData, 'name');
    const code = getStringField(formData, 'code');
    const contentId = getIntegerField(formData, 'contentId');
    const timeLimit = getIntegerField(formData, 'timeLimit');
    const published = getBooleanField(formData, 'published');
    const calculatorAllowed = getBooleanField(formData, 'calculatorAllowed');
    const attemptLimit = getOptionalIntegerField(formData, 'attemptLimit') || 0;
    const shuffleQuestions = getBooleanField(formData, 'shuffleQuestions');
    const passMark = getOptionalIntegerField(formData, 'passMark');
    const imageUrl = getOptionalStringField(formData, 'imageUrl', null);
    const attachmentUrl = getOptionalStringField(formData, 'attachmentUrl', null);
    
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`
      UPDATE quizzes SET 
        name = ${name}, 
        code = ${code}, 
        content_id = ${contentId}, 
        time_limit = ${timeLimit}, 
        published = ${published}, 
        calculator_allowed = ${calculatorAllowed}, 
        attempt_limit = ${attemptLimit}, 
        shuffle_questions = ${shuffleQuestions}, 
        pass_mark = ${passMark}, 
        image_url = ${imageUrl}, 
        attachment_url = ${attachmentUrl},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    revalidatePath('/admin/quizzes');
    return { success: true };
  } catch (error) {
    console.error('Error updating quiz:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update quiz' };
  }
}

export async function deleteQuizAction(id: number) {
  try {
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`DELETE FROM quizzes WHERE id = ${id}`;
    revalidatePath('/admin/quizzes');
    return { success: true };
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return { error: 'Failed to delete quiz' };
  }
}

// =============================================================================
// QUESTION MANAGEMENT ACTIONS
// =============================================================================

/**
 * Creates a new question for quizzes
 * Supports multiple question types with options, explanations, and grade ranges
 * @param {FormData} formData - Form data containing question information
 * @returns {Promise<Object>} - Success/error response object
 */
export async function createQuestionAction(formData: FormData) {
  try {
    const contentId = getOptionalIntegerField(formData, 'contentId');
    const text = getStringField(formData, 'text');
    const type = getStringField(formData, 'type');
    const correctAnswer = getStringField(formData, 'correctAnswer');
    const gradeMin = getIntegerField(formData, 'gradeMin');
    const gradeMax = getIntegerField(formData, 'gradeMax');
    const marks = getIntegerField(formData, 'marks');
    const options = getOptionalStringField(formData, 'options', '[]');
    const active = getBooleanField(formData, 'active');
    const topic = getOptionalStringField(formData, 'topic', null);
    const difficultyLevel = getOptionalStringField(formData, 'difficultyLevel', null);
    const explanation = getOptionalStringField(formData, 'explanation', null);
    const solutionUrl = getOptionalStringField(formData, 'solutionUrl', null);
    const randomizeOptions = getBooleanField(formData, 'randomizeOptions');
    const imageUrl = getOptionalStringField(formData, 'imageUrl', null);
    const attachmentUrl = getOptionalStringField(formData, 'attachmentUrl', null);
    
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`
      INSERT INTO questions (content_id, text, type, correct_answer, options, grade_min, grade_max, marks, active, topic, difficulty_level, explanation, solution_url, randomize_options, image_url, attachment_url)
      VALUES (${contentId}, ${text}, ${type}, ${correctAnswer}, ${options}, ${gradeMin}, ${gradeMax}, ${marks}, ${active}, ${topic}, ${difficultyLevel}, ${explanation}, ${solutionUrl}, ${randomizeOptions}, ${imageUrl}, ${attachmentUrl})
    `;
    revalidatePath('/admin/questions');
    return { success: true };
  } catch (error) {
    console.error('Error creating question:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create question' };
  }
}

export async function updateQuestionAction(id: number, formData: FormData) {
  try {
    const contentId = getOptionalIntegerField(formData, 'contentId');
    const text = getStringField(formData, 'text');
    const type = getStringField(formData, 'type');
    const correctAnswer = getStringField(formData, 'correctAnswer');
    const gradeMin = getIntegerField(formData, 'gradeMin');
    const gradeMax = getIntegerField(formData, 'gradeMax');
    const marks = getIntegerField(formData, 'marks');
    const options = getOptionalStringField(formData, 'options', '[]');
    const active = getBooleanField(formData, 'active');
    const topic = getOptionalStringField(formData, 'topic', null);
    const difficultyLevel = getOptionalStringField(formData, 'difficultyLevel', null);
    const explanation = getOptionalStringField(formData, 'explanation', null);
    const solutionUrl = getOptionalStringField(formData, 'solutionUrl', null);
    const randomizeOptions = getBooleanField(formData, 'randomizeOptions');
    const imageUrl = getOptionalStringField(formData, 'imageUrl', null);
    const attachmentUrl = getOptionalStringField(formData, 'attachmentUrl', null);
    
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`
      UPDATE questions SET 
        content_id = ${contentId},
        text = ${text}, 
        type = ${type}, 
        correct_answer = ${correctAnswer}, 
        options = ${options}, 
        grade_min = ${gradeMin}, 
        grade_max = ${gradeMax}, 
        marks = ${marks}, 
        active = ${active}, 
        topic = ${topic}, 
        difficulty_level = ${difficultyLevel}, 
        explanation = ${explanation}, 
        solution_url = ${solutionUrl}, 
        randomize_options = ${randomizeOptions}, 
        image_url = ${imageUrl}, 
        attachment_url = ${attachmentUrl}
      WHERE id = ${id}
    `;
    revalidatePath('/admin/questions');
    return { success: true };
  } catch (error) {
    console.error('Error updating question:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update question' };
  }
}

export async function deleteQuestionAction(id: number) {
  try {
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`DELETE FROM questions WHERE id = ${id}`;
    revalidatePath('/admin/questions');
    return { success: true };
  } catch (error) {
    console.error('Error deleting question:', error);
    return { error: 'Failed to delete question' };
  }
}

// =============================================================================
// QUIZ QUESTIONS JUNCTION TABLE ACTIONS
// =============================================================================

/**
 * Retrieves all quiz-question relationships with detailed information
 * Joins quiz_questions with quizzes and questions tables for complete data
 * @returns {Promise<Array>} - Array of quiz-question relationship objects
 */
export async function getAllQuizQuestions() {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`
      SELECT qq.quiz_id, qq.question_id, qq.order_num,
             q.name as quiz_name, q.code as quiz_code,
             qs.text as question_text, qs.type as question_type, 
             qs.marks as question_marks, qs.correct_answer
      FROM quiz_questions qq
      LEFT JOIN quizzes q ON qq.quiz_id = q.id
      LEFT JOIN questions qs ON qq.question_id = qs.id
      ORDER BY q.name, qq.order_num
    `;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw new Error('Failed to fetch quiz questions');
  }
}

export async function getQuizWithQuestions(quizId: number) {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`
      SELECT qq.quiz_id, qq.question_id, qq.order_num,
             q.name as quiz_name, q.code as quiz_code, q.time_limit, q.published, q.calculator_allowed,
             qs.id as question_id, qs.text as question_text, qs.type as question_type, 
             qs.marks as question_marks, qs.correct_answer, qs.options
      FROM quiz_questions qq
      LEFT JOIN quizzes q ON qq.quiz_id = q.id
      LEFT JOIN questions qs ON qq.question_id = qs.id
      WHERE qq.quiz_id = ${quizId}
      ORDER BY qq.order_num
    `;
  } catch (error) {
    console.error('Error fetching quiz with questions:', error);
    throw new Error('Failed to fetch quiz with questions');
  }
}

export async function createQuizQuestionAction(formData: FormData) {
  try {
    const quizId = getIntegerField(formData, 'quizId');
    const questionId = getIntegerField(formData, 'questionId');
    const orderNum = getIntegerField(formData, 'orderNum');
    
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`
      INSERT INTO quiz_questions (quiz_id, question_id, order_num)
      VALUES (${quizId}, ${questionId}, ${orderNum})
    `;
    revalidatePath('/admin/quiz-questions');
    return { success: true };
  } catch (error) {
    console.error('Error creating quiz question:', error);
    return { error: error instanceof Error ? error.message : 'Failed to add question to quiz' };
  }
}

export async function deleteQuizQuestionAction(quizId: number, questionId: number) {
  try {
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`DELETE FROM quiz_questions WHERE quiz_id = ${quizId} AND question_id = ${questionId}`;
    revalidatePath('/admin/quiz-questions');
    return { success: true };
  } catch (error) {
    console.error('Error deleting quiz question:', error);
    return { error: 'Failed to remove question from quiz' };
  }
}

// =============================================================================
// PROGRESS TRACKING ACTIONS
// =============================================================================

/**
 * Retrieves all student progress records with user and content information
 * Joins user_progress with users and content tables for complete data
 * @returns {Promise<Array>} - Array of progress objects with user/content names
 */
export async function getAllProgress() {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`
      SELECT p.id, p.user_id, p.content_id, p.quiz_id, p.completion, p.status, 
             p.grade, p.score, p.completed, p.sessions_count, p.created_at, p.updated_at,
             u.first_name || ' ' || u.last_name as user_name,
             c.name as content_name
      FROM user_progress p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN content c ON p.content_id = c.id
      ORDER BY p.updated_at DESC
    `;
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw new Error('Failed to fetch progress');
  }
}

/**
 * Retrieves all session progress records with related information
 * Joins user_session_progress with user_progress, users, and content tables
 * @returns {Promise<Array>} - Array of session progress objects with complete data
 */
export async function getAllSessionProgress() {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`
      SELECT sp.id, sp.session_number, sp.session_date, sp.completion, sp.score, sp.grade,
             sp.strengths, sp.areas_for_improvement, sp.student_reflection, sp.tutor_feedback,
             sp.homework, sp.next_lesson_plan, sp.created_at, sp.updated_at,
             u.first_name || ' ' || u.last_name as student_name,
             c.name as content_name,
             p.id as progress_id
      FROM user_session_progress sp
      LEFT JOIN user_progress p ON sp.user_progress_id = p.id
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN content c ON p.content_id = c.id
      ORDER BY sp.session_date DESC, sp.session_number DESC
    `;
  } catch (error) {
    console.error('Error fetching session progress:', error);
    return [];
  }
}

export async function createProgressAction(formData: FormData) {
  try {
    const userId = getIntegerField(formData, 'userId');
    const assignmentType = getOptionalStringField(formData, 'assignmentType', 'content');
    
    // Handle assignment type logic
    let contentId = null;
    let quizId = null;
    
    if (assignmentType === 'quiz') {
      quizId = getOptionalIntegerField(formData, 'quizId');
      if (!quizId) {
        return { error: 'Quiz is required for quiz assignments' };
      }
    } else {
      contentId = getOptionalIntegerField(formData, 'contentId');
      quizId = getOptionalIntegerField(formData, 'quizId'); // Optional for content assignments
      if (!contentId) {
        return { error: 'Content is required for content assignments' };
      }
    }
    
    const completion = getOptionalIntegerField(formData, 'completion') || 0;
    const status = getStringField(formData, 'status');
    const grade = getOptionalNumberField(formData, 'grade');
    const score = getOptionalIntegerField(formData, 'score');
    const completed = getBooleanField(formData, 'completed');
    const sessionsCount = getOptionalIntegerField(formData, 'sessionsCount') || 0;
    
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`
      INSERT INTO user_progress (
        user_id, content_id, quiz_id, completion, status, grade, score, completed, sessions_count
      )
      VALUES (
        ${userId}, ${contentId}, ${quizId}, ${completion}, ${status}, ${grade}, 
        ${score}, ${completed}, ${sessionsCount}
      )
    `;
    revalidatePath('/admin/progress');
    revalidatePath('/tutor/student');
    return { success: true };
  } catch (error) {
    console.error('Error creating progress:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create progress' };
  }
}

export async function updateProgressAction(id: number, formData: FormData) {
  try {
    const completion = getIntegerField(formData, 'completion');
    const status = getStringField(formData, 'status');
    const grade = getOptionalNumberField(formData, 'grade');
    const score = getOptionalIntegerField(formData, 'score');
    const completed = getBooleanField(formData, 'completed');
    const sessionsCount = getOptionalIntegerField(formData, 'sessionsCount') || 0;
    
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`
      UPDATE user_progress SET 
        completion = ${completion}, 
        status = ${status}, 
        grade = ${grade}, 
        score = ${score}, 
        completed = ${completed}, 
        sessions_count = ${sessionsCount},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    revalidatePath('/admin/progress');
    return { success: true };
  } catch (error) {
    console.error('Error updating progress:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update progress' };
  }
}

export async function deleteProgressAction(id: number) {
  try {
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`DELETE FROM user_progress WHERE id = ${id}`;
    revalidatePath('/admin/progress');
    return { success: true };
  } catch (error) {
    console.error('Error deleting progress:', error);
    return { error: 'Failed to delete progress' };
  }
}

/**
 * Saves quiz answers to user progress and calculates scores
 * @param formData - Form data containing quiz answers
 * @returns Success/error response object
 */
export async function saveQuizAnswersAction(formData: FormData) {
  try {
    const userId = getIntegerField(formData, 'userId');
    const quizId = getIntegerField(formData, 'quizId');
    const contentId = getIntegerField(formData, 'contentId');
    
    // Extract all answers from form data
    const answers: Record<string, { working_out: string; final_answer: string; need_help?: boolean }> = {};
    
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('working_out_')) {
        const questionId = key.replace('working_out_', '');
        if (!answers[questionId]) answers[questionId] = { working_out: '', final_answer: '' };
        answers[questionId].working_out = value.toString();
      } else if (key.startsWith('final_answer_')) {
        const questionId = key.replace('final_answer_', '');
        if (!answers[questionId]) answers[questionId] = { working_out: '', final_answer: '' };
        answers[questionId].final_answer = value.toString();
      } else if (key.startsWith('need_help_')) {
        const questionId = key.replace('need_help_', '');
        if (!answers[questionId]) answers[questionId] = { working_out: '', final_answer: '' };
        answers[questionId].need_help = value === 'on';
      }
    }
    
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    
    // Get correct answers for comparison
    const questions = await sql`
      SELECT q.id, q.correct_answer, q.marks
      FROM questions q
      JOIN quiz_questions qq ON q.id = qq.question_id
      WHERE qq.quiz_id = ${quizId}
    `;
    
    // Compare answers and calculate scores
    const answerScores: Record<string, { is_correct: boolean; marks_awarded: number; max_marks: number }> = {};
    let totalScore = 0;
    let maxScore = 0;
    
    for (const question of questions) {
      const questionId = question.id.toString();
      const studentAnswer = answers[questionId]?.final_answer?.toLowerCase().trim() || '';
      const correctAnswer = question.correct_answer.toLowerCase().trim();
      const isCorrect = studentAnswer === correctAnswer;
      const marksAwarded = isCorrect ? question.marks : 0;
      
      answerScores[questionId] = {
        is_correct: isCorrect,
        marks_awarded: marksAwarded,
        max_marks: question.marks
      };
      
      totalScore += marksAwarded;
      maxScore += question.marks;
    }
    
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    
    // Upsert user progress with answers and scores
    await sql`
      INSERT INTO user_progress (user_id, content_id, quiz_id, answers, answer_scores, score, status, updated_at)
      VALUES (${userId}, ${contentId}, ${quizId}, ${JSON.stringify(answers)}, ${JSON.stringify(answerScores)}, ${percentage}, 'completed', CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, content_id)
      DO UPDATE SET 
        answers = ${JSON.stringify(answers)},
        answer_scores = ${JSON.stringify(answerScores)},
        score = ${percentage},
        status = 'completed',
        updated_at = CURRENT_TIMESTAMP
    `;
    
    revalidatePath('/admin/users');
    revalidatePath('/student');
    redirect('/student');
  } catch (error) {
    console.error('Error saving quiz answers:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to save answers');
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Gets users by role (utility function for forms and dropdowns)
 * @param role - User role to filter by
 * @returns Array of users with the specified role
 */
export async function getUsersByRole(role: string) {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`
      SELECT id, first_name, last_name, email 
      FROM users 
      WHERE role = ${role} 
      ORDER BY first_name, last_name
    `;
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw new Error(`Failed to fetch ${role}s`);
  }
}

/**
 * Gets a single user by ID (utility function)
 * @param id - User ID to lookup
 * @returns User object or null if not found
 */
export async function getUserById(id: number) {
  try {
    const sql = getSql();
    if (!sql) return null;
    const [user] = await sql`
      SELECT id, first_name, last_name, email, role, year_group, target_grade, 
             current_grade, exam_board, school, contact_number, class_preference,
             booking_option, payment_preference, travel_arrangement, 
             communication_method, communication_other, parents_name,
             promotional_consent, homework_required, active, notes, 
             created_at, updated_at
      FROM users 
      WHERE id = ${id}
    `;
    return user || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

/**
 * Gets all data related to a specific user
 * @param userId - User ID to get related data for
 * @returns Object containing user's bookings, progress, and sessions
 */
export async function getUserRelatedData(userId: number) {
  try {
    const sql = getSql();
    if (!sql) return { bookings: [], progress: [], sessions: [], authoredContent: [] };
    
    // Get user's bookings (as student or tutor)
    const bookings = await sql`
      SELECT b.*, 
             u1.first_name as tutor_first_name, u1.last_name as tutor_last_name,
             u2.first_name as student_first_name, u2.last_name as student_last_name
      FROM bookings b
      LEFT JOIN users u1 ON b.tutor_id = u1.id
      LEFT JOIN users u2 ON b.student_id = u2.id
      WHERE b.tutor_id = ${userId} OR b.student_id = ${userId}
      ORDER BY b.scheduled_start DESC
    `;

    // Get user's progress records
    const progress = await sql`
      SELECT p.*, c.name as content_name, q.name as quiz_name, q.code as quiz_code
      FROM user_progress p
      LEFT JOIN content c ON p.content_id = c.id
      LEFT JOIN quizzes q ON p.quiz_id = q.id
      WHERE p.user_id = ${userId}
      ORDER BY p.updated_at DESC
    `;

    // Get user's session progress
    const sessions = await sql`
      SELECT sp.*, c.name as content_name
      FROM user_session_progress sp
      LEFT JOIN user_progress p ON sp.user_progress_id = p.id
      LEFT JOIN content c ON p.content_id = c.id
      WHERE p.user_id = ${userId}
      ORDER BY sp.session_date DESC
    `;

    // Get authored content (for tutors/admins)
    const authoredContent = await sql`
      SELECT * FROM content
      WHERE author_id = ${userId}
      ORDER BY created_at DESC
    `;

    return {
      bookings,
      progress,
      sessions,
      authoredContent
    };
  } catch (error) {
    console.error('Error fetching user related data:', error);
    return {
      bookings: [],
      progress: [],
      sessions: [],
      authoredContent: []
    };
  }
}

/**
 * Gets a single content item by ID (utility function)
 * @param id - Content ID to lookup
 * @returns Content object or null if not found
 */
export async function getContentById(id: number) {
  try {
    const sql = getSql();
    if (!sql) return null;
    const [content] = await sql`
      SELECT id, name, type, grade_min, grade_max, published, created_at, updated_at
      FROM content 
      WHERE id = ${id}
    `;
    return content || null;
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    return null;
  }
}

/**
 * Gets a single quiz by ID with its questions (utility function)
 * @param id - Quiz ID to lookup
 * @returns Quiz object with questions or null if not found
 */
export async function getQuizById(id: number) {
  try {
    const sql = getSql();
    if (!sql) return null;
    const [quiz] = await sql`
      SELECT q.*, c.name as content_name
      FROM quizzes q
      LEFT JOIN content c ON q.content_id = c.id
      WHERE q.id = ${id}
    `;
    
    if (!quiz) return null;
    
    const questions = await sql`
      SELECT qs.*, qq.order_num
      FROM questions qs
      INNER JOIN quiz_questions qq ON qs.id = qq.question_id
      WHERE qq.quiz_id = ${id}
      ORDER BY qq.order_num
    `;
    
    return { ...quiz, questions };
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    return null;
  }
}

/**
 * Gets published content for student access (utility function)
 * @param gradeLevel - Optional grade level filter
 * @returns Array of published content items
 */
export async function getPublishedContent(gradeLevel?: number) {
  try {
    const sql = getSql();
    if (!sql) return [];
    if (gradeLevel) {
      return await sql`
        SELECT * FROM content 
        WHERE published = true 
        AND grade_min <= ${gradeLevel} 
        AND grade_max >= ${gradeLevel}
        ORDER BY name
      `;
    } else {
      return await sql`
        SELECT * FROM content 
        WHERE published = true 
        ORDER BY name
      `;
    }
  } catch (error) {
    console.error('Error fetching published content:', error);
    throw new Error('Failed to fetch published content');
  }
}

/**
 * Gets user progress for a specific user (utility function for student/tutor dashboards)
 * @param userId - User ID to get progress for
 * @returns Array of progress records for the user
 */
export async function getUserProgress(userId: number) {
  try {
    const sql = getSql();
    if (!sql) return [];
    return await sql`
      SELECT p.*, c.name as content_name, c.type as content_type,
             q.name as quiz_name, q.code as quiz_code
      FROM user_progress p
      LEFT JOIN content c ON p.content_id = c.id
      LEFT JOIN quizzes q ON p.quiz_id = q.id
      WHERE p.user_id = ${userId}
      ORDER BY p.updated_at DESC
    `;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw new Error('Failed to fetch user progress');
  }
}

/**
 * Gets upcoming bookings for a user (utility function)
 * @param userId - User ID to get bookings for
 * @param role - User role (tutor or student)
 * @returns Array of upcoming bookings
 */
export async function getUpcomingBookings(userId: number, role: 'tutor' | 'student') {
  try {
    const roleColumn = role === 'tutor' ? 'tutor_id' : 'student_id';
    const otherRoleColumn = role === 'tutor' ? 'student_id' : 'tutor_id';
    const otherRolePrefix = role === 'tutor' ? 'student' : 'tutor';
    
    const sql = getSql();
    if (!sql) return [];
    return await sql`
      SELECT b.*, 
             u.first_name as ${otherRolePrefix}_first_name, 
             u.last_name as ${otherRolePrefix}_last_name,
             u.email as ${otherRolePrefix}_email
      FROM bookings b
      LEFT JOIN users u ON b.${otherRoleColumn} = u.id
      WHERE b.${roleColumn} = ${userId}
      AND b.scheduled_start > NOW()
      AND b.status IN ('confirmed', 'pending')
      ORDER BY b.scheduled_start ASC
    `;
  } catch (error) {
    console.error('Error fetching upcoming bookings:', error);
    throw new Error('Failed to fetch upcoming bookings');
  }
}

/**
 * Resets quiz progress for a user to allow retaking
 * @param userId - User ID to reset progress for
 * @param quizId - Quiz ID to reset
 * @returns Success/error response object
 */
export async function resetQuizProgressAction(userId: number, quizId: number) {
  try {
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`
      DELETE FROM user_progress 
      WHERE user_id = ${userId} AND quiz_id = ${quizId}
    `;
    revalidatePath('/admin/users');
    revalidatePath('/tutor/student');
    return { success: true };
  } catch (error) {
    console.error('Error resetting quiz progress:', error);
    return { error: 'Failed to reset quiz progress' };
  }
}

export async function resetAllProgressAction(userId: number) {
  try {
    const sql = getSql();
    if (!sql) return { error: 'Database not available' };
    await sql`
      DELETE FROM user_session_progress 
      WHERE user_progress_id IN (
        SELECT id FROM user_progress WHERE user_id = ${userId}
      )
    `;
    await sql`
      DELETE FROM user_progress WHERE user_id = ${userId}
    `;
    revalidatePath('/tutor/student');
    return { success: true };
  } catch (error) {
    console.error('Error resetting all progress:', error);
    return { error: 'Failed to reset all progress' };
  }
}