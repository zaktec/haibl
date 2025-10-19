export async function seedQuizzes(sql: any, content: any[]) {
  return await sql`
    INSERT INTO quizzes (name, code, content_id, time_limit, published, calculator_allowed, attempt_limit, shuffle_questions, pass_mark) VALUES
    ('GCSE Maths Paper 1H November 2022', 'GCSE2022H', ${content[content.length - 1].id}, 90, true, false, 3, false, 50),
    ('Number Skills Assessment', 'NUM001', ${content[0].id}, 30, true, true, 0, true, 60),
    ('Algebra Basics Quiz', 'ALG001', ${content[5].id}, 45, true, true, 2, false, 70),
    ('Geometry Practice Test', 'GEO001', ${content[8].id}, 60, true, false, 1, true, 65)
    RETURNING id
  `;
}