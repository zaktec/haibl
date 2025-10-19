export async function seedUsers(sql: any) {
  const hashedPassword = '$2b$10$abcdefghijklmnopqrstuvwxyz123456'; // Pre-hashed '123'
  
  const adminUsers = await sql`
    INSERT INTO users (first_name, last_name, email, password, role) VALUES
    ('Sarah', 'Johnson', 'admin@mathstutorhelp.com', ${hashedPassword}, 'admin'),
    ('David', 'Miller', 'admin2@mathstutorhelp.com', ${hashedPassword}, 'admin')
    RETURNING id
  `;
  
  const tutorUsers = await sql`
    INSERT INTO users (first_name, last_name, email, password, role) VALUES
    ('Michael', 'Smith', 'tutor@mathstutorhelp.com', ${hashedPassword}, 'tutor'),
    ('Jennifer', 'Taylor', 'jennifer.taylor@mathstutorhelp.com', ${hashedPassword}, 'tutor'),
    ('Robert', 'Anderson', 'robert.anderson@mathstutorhelp.com', ${hashedPassword}, 'tutor')
    RETURNING id
  `;
  
  const studentUsers = await sql`
    INSERT INTO users (first_name, last_name, email, password, role, year_group, target_grade, school, parents_name) VALUES
    ('Emma', 'Wilson', 'student@mathstutorhelp.com', ${hashedPassword}, 'student', 10, 7.0, 'Greenfield High School', 'David Wilson'),
    ('James', 'Brown', 'james.brown@email.com', ${hashedPassword}, 'student', 11, 8.0, 'Riverside Academy', 'Lisa Brown'),
    ('Sophie', 'Davis', 'sophie.davis@email.com', ${hashedPassword}, 'student', 9, 6.0, 'Oakwood School', 'Mark Davis')
    RETURNING id
  `;
  
  return { adminUsers, tutorUsers, studentUsers };
}