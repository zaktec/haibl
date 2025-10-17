/**
 * Database Seeding Route
 * 
 * This file handles database initialization and seeding for the math tutoring platform.
 * It creates the complete database schema and populates it with sample data for development.
 */

import { getDb } from './db';
import { seedUsers } from './users';
import { seedContent } from './content';
import { seedQuestions } from './questions';
import { seedQuizzes } from './quizzes';
import { seedQuizQuestions } from './quiz-questions';
import { seedBookings } from './bookings';
import { seedUserProgress } from './user-progress';

export const dynamic = 'force-dynamic';

async function dropAndRecreateSchema(sql: any) {
  await sql`DROP SCHEMA IF EXISTS public CASCADE`;
  await sql`CREATE SCHEMA public`;
  
  await sql`
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'tutor', 'admin')),
  year_group INTEGER,
  target_grade NUMERIC(3,1),
  school VARCHAR(100),
  contact_number VARCHAR(20),
  course VARCHAR(100),
  parents_name VARCHAR(200),
  image_url TEXT,
  attachment_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
  
  await sql`CREATE INDEX idx_users_email ON users(email)`;
  await sql`CREATE INDEX idx_users_role ON users(role)`;

  await sql`
CREATE TABLE content (
  id BIGSERIAL PRIMARY KEY,
  clip_number VARCHAR(10) DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  topic VARCHAR(100) DEFAULT NULL,
  content_type VARCHAR(50) NOT NULL DEFAULT 'lesson' CHECK (content_type IN ('lesson', 'quiz', 'topic')),
  tier VARCHAR(20) DEFAULT 'Foundation' CHECK (tier IN ('Foundation', 'Higher')),
  grade_min INTEGER DEFAULT 1,
  grade_max INTEGER DEFAULT 9,
  video_url TEXT DEFAULT NULL,
  image_url TEXT DEFAULT NULL,
  attachment_url TEXT DEFAULT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  author_id INTEGER NOT NULL DEFAULT 1 REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
  `;

  await sql`
CREATE TABLE questions (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'multiple_choice',
  correct_answer TEXT,
  options JSONB DEFAULT '[]',
  grade_min INTEGER DEFAULT 1,
  grade_max INTEGER DEFAULT 12,
  marks INTEGER DEFAULT 1 CHECK (marks >= 0),
  active BOOLEAN DEFAULT true,
  topic VARCHAR(100),
  difficulty_level VARCHAR(20),
  explanation TEXT,
  solution_url TEXT,
  randomize_options BOOLEAN DEFAULT false,
  image_url TEXT,
  attachment_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `;

  await sql`
CREATE TABLE quizzes (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  content_id BIGINT REFERENCES content(id) ON DELETE CASCADE,
  time_limit INTEGER DEFAULT 30 CHECK (time_limit >= 0),
  published BOOLEAN DEFAULT FALSE,
  calculator_allowed BOOLEAN DEFAULT TRUE,
  attempt_limit INTEGER DEFAULT 0,
  shuffle_questions BOOLEAN DEFAULT false,
  pass_mark INTEGER CHECK (pass_mark BETWEEN 0 AND 100),
  image_url TEXT,
  attachment_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `;

  await sql`
CREATE TABLE quiz_questions (
  quiz_id BIGINT REFERENCES quizzes(id) ON DELETE CASCADE,
  question_id BIGINT REFERENCES questions(id) ON DELETE CASCADE,
  order_num INTEGER DEFAULT 1,
  points_override INTEGER,
  PRIMARY KEY (quiz_id, question_id),
  UNIQUE (quiz_id, order_num)
);
  `;

    
  await sql`
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  tutor_id BIGINT REFERENCES users(id),
  student_id BIGINT REFERENCES users(id),
  session_type VARCHAR(20) NOT NULL DEFAULT 'individual',
  delivery_mode VARCHAR(20) NOT NULL DEFAULT 'online',
  scheduled_start TIMESTAMP NOT NULL,
  scheduled_end TIMESTAMP NOT NULL CHECK (scheduled_end > scheduled_start),
  location TEXT,
  meeting_link TEXT,
  session_topic TEXT,
  session_objectives TEXT,
  special_requirements TEXT,
  preparation_notes TEXT,
  content_id BIGINT REFERENCES content(id),
  expected_duration_minutes INTEGER,
  recurring_booking_id BIGINT,
  cancellation_reason TEXT,
  rescheduled_from_booking_id BIGINT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  max_participants INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
  
  await sql`CREATE INDEX idx_bookings_tutor_id ON bookings(tutor_id)`;
  await sql`CREATE INDEX idx_bookings_student_id ON bookings(student_id)`;
  await sql`CREATE INDEX idx_bookings_scheduled_start ON bookings(scheduled_start)`;

  await sql`
CREATE TABLE user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id BIGINT NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  quiz_id BIGINT REFERENCES quizzes(id) ON DELETE CASCADE,
  completion INTEGER DEFAULT 0 CHECK (completion BETWEEN 0 AND 100),
  status VARCHAR(20) DEFAULT 'not_started',
  grade NUMERIC(3,1),
  score INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  sessions_count INTEGER DEFAULT 0,
  answers JSONB DEFAULT '{}',
  answer_scores JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, content_id)
);
  `;

  await sql`
CREATE TABLE user_session_progress (
  id BIGSERIAL PRIMARY KEY,
  user_progress_id BIGINT NOT NULL REFERENCES user_progress(id) ON DELETE CASCADE,
  booking_id BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
  session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_number INTEGER,
  completion INTEGER CHECK (completion BETWEEN 0 AND 100),
  score INTEGER CHECK (score >= 0),
  grade NUMERIC(3,1),
  strengths TEXT,
  areas_for_improvement TEXT,
  student_reflection TEXT,
  tutor_feedback TEXT,
  homework TEXT,
  next_lesson_plan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_progress_id, session_number)
);
  `;
}

/**
 * Seeds the database with sample data for development and testing
 * Creates users, content, questions, quizzes, bookings, and progress records
 */
async function seedData(sql: any) {
  const { adminUsers, tutorUsers, studentUsers } = await seedUsers(sql);
  const content = await seedContent(sql, adminUsers);
  const questions = await seedQuestions(sql);
  const quizzes = await seedQuizzes(sql, content);
  
  await seedQuizQuestions(sql, quizzes, questions);
  await seedBookings(sql, tutorUsers, studentUsers);
  await seedUserProgress(sql, studentUsers, content, quizzes);
  
  return {
    users: adminUsers.length + tutorUsers.length + studentUsers.length,
    content: content.length,
    questions: questions.length,
    quizzes: quizzes.length,
    bookings: 4,
    progress: 7,
    sessions: 3
  };
}

/**
 * GET handler - serves a web interface for database seeding
 * Provides buttons to seed database and navigate to login
 */
export async function GET() {
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Database Seeding</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        .button:hover { background: #0056b3; }
        .result { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>Database Seeding</h1>
      <button class="button" onclick="seedNow()">Seed Database</button>
      <a href="/auth/login" class="button" style="text-decoration: none; margin-left: 10px;">Go to Login</a>
      <div id="result" class="result" style="display:none;"></div>
      
      <script>
        function seedNow() {
          document.getElementById('result').style.display = 'block';
          document.getElementById('result').innerHTML = 'Seeding database...';
          
          fetch('/seed', { method: 'POST' })
            .then(r => r.json())
            .then(d => {
              document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(d, null, 2) + '</pre>';
            })
            .catch(e => {
              document.getElementById('result').innerHTML = 'Error: ' + e.message;
            });
        }
      </script>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

/**
 * POST handler - executes database seeding
 * Drops existing schema, recreates tables, and populates with sample data
 * Disabled in production for security
 */
export async function POST() {
  const startTime = Date.now();
  
  try {
    if (process.env.NODE_ENV === 'production') {
      return Response.json({
        success: false,
        error: 'Seeding is disabled in production environment'
      }, { status: 403 });
    }

    const sql = getDb();
    const result = await sql.begin(async (sql: any) => {
      await dropAndRecreateSchema(sql);
      const stats = await seedData(sql);
      return stats;
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    return Response.json({
      success: true,
      message: '✅ Database seeded successfully!',
      duration: `${duration}s`,
      stats: result
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Seeding failed'
    }, { status: 500 });
  }
}