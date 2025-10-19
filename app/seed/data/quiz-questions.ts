export async function seedQuizQuestions(sql: any, quizzes: any[], questions: any[]) {
  return await sql`
    INSERT INTO quiz_questions (quiz_id, question_id, order_num) VALUES
    (${quizzes[0].id}, ${questions[0].id}, 1),
    (${quizzes[0].id}, ${questions[1].id}, 2),
    (${quizzes[0].id}, ${questions[2].id}, 3),
    (${quizzes[0].id}, ${questions[3].id}, 4),
    (${quizzes[0].id}, ${questions[4].id}, 5),
    (${quizzes[0].id}, ${questions[5].id}, 6),
    (${quizzes[0].id}, ${questions[6].id}, 7),
    (${quizzes[0].id}, ${questions[7].id}, 8),
    (${quizzes[0].id}, ${questions[8].id}, 9),
    (${quizzes[0].id}, ${questions[9].id}, 10),
    (${quizzes[1].id}, ${questions[0].id}, 1),
    (${quizzes[1].id}, ${questions[3].id}, 2),
    (${quizzes[2].id}, ${questions[2].id}, 1),
    (${quizzes[2].id}, ${questions[5].id}, 2),
    (${quizzes[3].id}, ${questions[8].id}, 1)
  `;
}