import { getDb } from "./db";
import { seedUsers } from "./data/users";
import { seedContent } from "./data/content";
import { seedQuestions } from "./data/questions";
import { seedQuizzes } from "./data/quizzes";
import { seedBookings } from "./data/bookings";
import { seedUserProgress } from "./data/user-progress";
import { seedQuizQuestions } from "./data/quiz-questions";

const createTables = async (sql: any) => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'student',
      year_group INTEGER,
      target_grade INTEGER,
      current_grade INTEGER,
      exam_board VARCHAR(50),
      school VARCHAR(100),
      contact_number VARCHAR(20),
      class_preference VARCHAR(50),
      booking_option VARCHAR(50),
      payment_preference VARCHAR(50),
      travel_arrangement VARCHAR(100),
      communication_method VARCHAR(50),
      communication_other TEXT,
      parents_name VARCHAR(100),
      promotional_consent BOOLEAN DEFAULT false,
      homework_required BOOLEAN DEFAULT true,
      active BOOLEAN DEFAULT true,
      notes TEXT,
      image_url TEXT,
      attachment_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS content (
      id SERIAL PRIMARY KEY,
      clip_number VARCHAR(20),
      name VARCHAR(200) NOT NULL,
      topic VARCHAR(100),
      content_type VARCHAR(50) DEFAULT 'lesson',
      tier VARCHAR(20) DEFAULT 'Foundation',
      grade_min INTEGER NOT NULL,
      grade_max INTEGER NOT NULL,
      video_url TEXT,
      image_url TEXT,
      attachment_url TEXT,
      published BOOLEAN DEFAULT false,
      author_id INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      content_id INTEGER REFERENCES content(id),
      text TEXT NOT NULL,
      type VARCHAR(50) DEFAULT 'multiple_choice',
      correct_answer TEXT NOT NULL,
      options TEXT DEFAULT '[]',
      grade_min INTEGER NOT NULL,
      grade_max INTEGER NOT NULL,
      marks INTEGER DEFAULT 1,
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
    )`,
    `CREATE TABLE IF NOT EXISTS quizzes (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      code VARCHAR(50) UNIQUE NOT NULL,
      content_id INTEGER REFERENCES content(id),
      time_limit INTEGER DEFAULT 60,
      published BOOLEAN DEFAULT false,
      calculator_allowed BOOLEAN DEFAULT false,
      attempt_limit INTEGER DEFAULT 0,
      shuffle_questions BOOLEAN DEFAULT false,
      pass_mark INTEGER,
      image_url TEXT,
      attachment_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS quiz_questions (
      quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
      question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
      order_num INTEGER DEFAULT 1,
      PRIMARY KEY (quiz_id, question_id)
    )`,
    `CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      tutor_id INTEGER REFERENCES users(id),
      student_id INTEGER REFERENCES users(id),
      session_type VARCHAR(50) DEFAULT 'individual',
      delivery_mode VARCHAR(50) DEFAULT 'online',
      scheduled_start TIMESTAMP,
      scheduled_end TIMESTAMP,
      location TEXT,
      meeting_link TEXT,
      session_topic VARCHAR(200),
      session_objectives TEXT,
      special_requirements TEXT,
      preparation_notes TEXT,
      expected_duration_minutes INTEGER DEFAULT 60,
      max_participants INTEGER DEFAULT 1,
      status VARCHAR(20) DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS user_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      content_id INTEGER REFERENCES content(id),
      quiz_id INTEGER REFERENCES quizzes(id),
      completion INTEGER DEFAULT 0,
      status VARCHAR(50) DEFAULT 'not_started',
      grade DECIMAL(5,2),
      score INTEGER,
      completed BOOLEAN DEFAULT false,
      sessions_count INTEGER DEFAULT 0,
      answers JSONB,
      answer_scores JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, content_id)
    )`,
    `CREATE TABLE IF NOT EXISTS user_session_progress (
      id SERIAL PRIMARY KEY,
      user_progress_id INTEGER REFERENCES user_progress(id) ON DELETE CASCADE,
      session_number INTEGER NOT NULL,
      session_date DATE NOT NULL,
      completion INTEGER DEFAULT 0,
      score INTEGER,
      grade DECIMAL(5,2),
      strengths TEXT,
      areas_for_improvement TEXT,
      student_reflection TEXT,
      tutor_feedback TEXT,
      homework TEXT,
      next_lesson_plan TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  for (const table of tables) {
    await sql.unsafe(table);
  }
  
  // Add indexes for performance
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
    'CREATE INDEX IF NOT EXISTS idx_content_published ON content(published)',
    'CREATE INDEX IF NOT EXISTS idx_questions_content_id ON questions(content_id)',
    'CREATE INDEX IF NOT EXISTS idx_quizzes_content_id ON quizzes(content_id)',
    'CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id)'
  ];
  
  for (const index of indexes) {
    try {
      await sql.unsafe(index);
    } catch (error) {
      console.log('Index creation skipped:', error.message);
    }
  }
};

const seedData = async (sql: any) => {
  let users, content, questions, quizzes;

  try {
    users = await seedUsers(sql);
    console.log("Users seeded successfully");
  } catch (e) {
    console.error("Users seeding failed:", e);
    throw new Error("Users seeding failed");
  }

  try {
    content = await seedContent(sql, users.adminUsers);
    console.log("Content seeded successfully");
  } catch (e) {
    console.error("Content seeding failed:", e);
  }

  try {
    questions = await seedQuestions(sql, content);
    console.log("Questions seeded successfully");
  } catch (e) {
    console.error("Questions seeding failed:", e);
  }

  try {
    quizzes = await seedQuizzes(sql, content);
    console.log("Quizzes seeded successfully");
  } catch (e) {
    console.error("Quizzes seeding failed:", e);
  }

  try {
    await seedQuizQuestions(sql, quizzes, questions);
    console.log("Quiz questions seeded successfully");
  } catch (e) {
    console.error("Quiz questions seeding failed:", e);
  }

  try {
    await seedBookings(sql, users.tutorUsers, users.studentUsers);
    console.log("Bookings seeded successfully");
  } catch (e) {
    console.error("Bookings seeding failed:", e);
  }

  try {
    await seedUserProgress(sql, users.studentUsers, content, quizzes);
    console.log("User progress seeded successfully");
  } catch (e) {
    console.error("User progress seeding failed:", e);
  }

  return { users, content, questions, quizzes };
};

export async function GET() {
  try {
    console.log('Environment variables:', {
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD ? '***' : 'missing'
    });
    
    // Return debug info if no database connection
    if (!process.env.DB_HOST) {
      return Response.json({
        error: "Environment variables missing",
        debug: {
          DB_HOST: process.env.DB_HOST || 'missing',
          DB_PORT: process.env.DB_PORT || 'missing',
          DB_NAME: process.env.DB_NAME || 'missing',
          DB_USER: process.env.DB_USER || 'missing',
          DB_PASSWORD: process.env.DB_PASSWORD ? 'set' : 'missing'
        }
      }, { status: 500 });
    }
    
    // Test direct connection
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
      });
      
      const client = await pool.connect();
      const result = await client.query('SELECT NOW() as connection_time');
      client.release();
      
      console.log('✅ Direct DB connection successful');
    } catch (dbError: any) {
      console.error('❌ Direct DB connection failed:', dbError.message);
      return Response.json({
        error: "Database connection failed",
        details: dbError.message,
        code: dbError.code
      }, { status: 500 });
    }
    
    const sql = getDb();
    if (!sql) {
      return Response.json(
        { error: "Database not available - check environment variables and database connection" },
        { status: 500 }
      );
    }

    const result = await sql`SELECT current_database(), version()`;
    await createTables(sql);

    // Clear existing data first
    await sql`TRUNCATE TABLE user_progress, quiz_questions, bookings, quizzes, questions, content, users RESTART IDENTITY CASCADE`;

    const seedResult = await seedData(sql);

    return Response.json({
      message: "Database tables created and seeded successfully",
      database: result[0].current_database,
      tables_created: [
        "users",
        "content",
        "questions",
        "quizzes",
        "quiz_questions",
        "bookings",
        "user_progress",
        "user_session_progress",
      ],
      data_seeded: {
        users: seedResult.users
          ? seedResult.users.adminUsers.length +
            seedResult.users.tutorUsers.length +
            seedResult.users.studentUsers.length
          : 0,
        content: seedResult.content ? seedResult.content.length : 0,
        questions: seedResult.questions ? seedResult.questions.length : 0,
        quizzes: seedResult.quizzes ? seedResult.quizzes.length : 0,
      },
    });
  } catch (error: any) {
    console.error("Database error:", error);
    return Response.json(
      {
        error: "Database setup failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET(); // Same functionality
}