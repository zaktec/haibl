export async function seedQuestions(sql: any) {
  return await sql`
    INSERT INTO questions (text, type, correct_answer, marks, grade_min, grade_max, topic, difficulty_level, explanation, image_url) VALUES
    ('Write 500 as a product of powers of its prime factors.', 'open', '2² × 5³', 3, 9, 12, 'number', 'easy', 'Prime factorisation of 500 = 2² × 5³', NULL),
    ('Work out 1/3 5 + 2 1/4 as a mixed number. Show that 2 2/3 ÷ 6 = 4/9.', 'open', '7 7/12', 4, 9, 12, 'fractions', 'easy', 'Convert to improper fractions, add, and simplify.', NULL),
    ('Simplify (2−5 × 28)². Give your answer as a power of 2.', 'open', '2⁶', 2, 9, 12, 'indices', 'medium', 'Apply index laws carefully.', NULL),
    ('Work out 0.004 × 0.32.', 'open', '0.00128', 2, 9, 12, 'decimals', 'easy', 'Multiply decimals directly.', NULL),
    ('Car factory survey: A=23, B=15, C=30, D=12 out of 80. 40,000 cars planned. How many model B?', 'word_problem', '7500', 2, 9, 12, 'proportion', 'easy', 'Scale up from sample to total.', NULL),
    ('Rizwan writes a:b=1:3, b:c=6:5. (i) Find a:b:c. (ii) Express a as fraction of total. Emma has n=2m, p=5n. Find m:p.', 'ratio', '2:6:5, 2/13, 1:10', 6, 9, 12, 'ratios', 'medium', 'Use equivalent ratios and algebra.', NULL),
    ('Storage tank exerts 10,000N on ground. Base is 4m by 2m. Work out pressure.', 'formula', '1250 N/m²', 2, 9, 12, 'pressure', 'easy', 'Pressure = Force / Area.', NULL),
    ('m multiple of 5, n even, HCF(m,n)=7. Give one possible m and n.', 'open', 'm=35, n=14', 2, 9, 12, 'factors', 'medium', 'Choose numbers divisible by 5 and 7 (m) and even multiples of 7 (n).', NULL),
    ('Complete the table for y=6x−x³ and draw the graph for -3≤x≤3.', 'graph', 'See graph', 4, 9, 12, 'graphs', 'medium', 'Substitute values, plot, and sketch cubic.', 'https://example.com/images/q9-graph.png'),
    ('Spinner results: 40 trials. Red=12, Blue=8, Green=20. Find P(Red).', 'probability', '0.3', 2, 9, 12, 'probability', 'easy', 'P(Red) = 12/40 = 3/10 = 0.3', NULL)
    RETURNING id
  `;
}