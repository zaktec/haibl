import { getDb } from './db';
import { seedUsers } from './users';
import { seedContent } from './content';
import { seedQuestions } from './questions';
import { seedQuizzes } from './quizzes';
import { seedBookings } from './bookings';
import { seedUserProgress } from './user-progress';
import { seedQuizQuestions } from './quiz-questions';

export async function GET() {
  try {
    const sql = getDb();
    if (!sql) {
      return Response.json({ error: 'Database not available' }, { status: 500 });
    }
    
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS content (
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS quizzes (
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
        question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
        order_num INTEGER DEFAULT 1,
        PRIMARY KEY (quiz_id, question_id)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_progress (
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_session_progress (
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
      )
    `;

    return Response.json({ message: 'Database tables created successfully' });
  } catch (error) {
    console.error('Database setup error:', error);
    return Response.json({ error: 'Failed to create tables' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const sql = getDb();
    if (!sql) {
      return Response.json({ error: 'Database not available' }, { status: 500 });
    }
    
    // Seed data using functions in correct order
    let users, content, questions, quizzes;
    
    try { 
      users = await seedUsers(sql); 
      console.log('Users seeded successfully');
    } catch (e) { 
      console.log('Users seeding failed:', e); 
      return Response.json({ error: 'Users seeding failed' }, { status: 500 });
    }
    
    try { 
      content = await seedContent(sql, users.adminUsers); 
      console.log('Content seeded successfully');
    } catch (e) { 
      console.log('Content seeding failed:', e); 
    }
    
    try { 
      questions = await seedQuestions(sql); 
      console.log('Questions seeded successfully');
    } catch (e) { 
      console.log('Questions seeding failed:', e); 
    }
    
    try { 
      quizzes = await seedQuizzes(sql, content); 
      console.log('Quizzes seeded successfully');
    } catch (e) { 
      console.log('Quizzes seeding failed:', e); 
    }
    
    try { 
      await seedQuizQuestions(sql, quizzes, questions); 
      console.log('Quiz questions seeded successfully');
    } catch (e) { 
      console.log('Quiz questions seeding failed:', e); 
    }
    
    try { 
      await seedBookings(sql, users.tutorUsers, users.studentUsers); 
      console.log('Bookings seeded successfully');
    } catch (e) { 
      console.log('Bookings seeding failed:', e); 
    }
    
    try { 
      await seedUserProgress(sql, users.studentUsers, content, quizzes); 
      console.log('User progress seeded successfully');
    } catch (e) { 
      console.log('User progress seeding failed:', e); 
    }

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Database seeding error:', error);
    return Response.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}