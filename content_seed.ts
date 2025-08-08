export const courses = [
  { type: 'course', name: 'GCSE Mathematics', description: 'Complete GCSE Mathematics curriculum', code: 'GCSE-MATH', grade_min: 9, grade_max: 11, order_num: 1, published: true },
  { type: 'course', name: 'A-Level Mathematics', description: 'Advanced Level Mathematics', code: 'AL-MATH', grade_min: 11, grade_max: 13, order_num: 2, published: true },
  { type: 'course', name: 'GCSE Physics', description: 'Complete GCSE Physics curriculum', code: 'GCSE-PHYS', grade_min: 9, grade_max: 11, order_num: 3, published: true }
];

export const topics = [
  { type: 'topic', name: 'Algebra', description: 'Algebraic expressions and equations', code: 'ALG-001', grade_min: 9, grade_max: 11, order_num: 1, published: true, parent_code: 'GCSE-MATH' },
  { type: 'topic', name: 'Geometry', description: 'Shapes, angles and measurements', code: 'GEO-001', grade_min: 9, grade_max: 11, order_num: 2, published: true, parent_code: 'GCSE-MATH' },
  { type: 'topic', name: 'Statistics', description: 'Data handling and probability', code: 'STAT-001', grade_min: 9, grade_max: 11, order_num: 3, published: true, parent_code: 'GCSE-MATH' },
  { type: 'topic', name: 'Calculus', description: 'Differentiation and integration', code: 'CALC-001', grade_min: 11, grade_max: 13, order_num: 1, published: true, parent_code: 'AL-MATH' },
  { type: 'topic', name: 'Mechanics', description: 'Forces and motion', code: 'MECH-001', grade_min: 11, grade_max: 13, order_num: 2, published: true, parent_code: 'AL-MATH' },
  { type: 'topic', name: 'Forces and Motion', description: 'Newton\'s laws and kinematics', code: 'FORCE-001', grade_min: 9, grade_max: 11, order_num: 1, published: true, parent_code: 'GCSE-PHYS' },
  { type: 'topic', name: 'Electricity', description: 'Current, voltage and resistance', code: 'ELEC-001', grade_min: 9, grade_max: 11, order_num: 2, published: true, parent_code: 'GCSE-PHYS' }
];

export const lessons = [
  { type: 'lesson', name: 'Solving Linear Equations', description: 'Basic equation solving techniques', code: 'ALG-LIN-001', grade_min: 9, grade_max: 10, order_num: 1, published: true, parent_code: 'ALG-001' },
  { type: 'lesson', name: 'Quadratic Equations', description: 'Factoring and quadratic formula', code: 'ALG-QUAD-001', grade_min: 10, grade_max: 11, order_num: 2, published: true, parent_code: 'ALG-001' },
  { type: 'lesson', name: 'Simultaneous Equations', description: 'Solving systems of equations', code: 'ALG-SIM-001', grade_min: 10, grade_max: 11, order_num: 3, published: true, parent_code: 'ALG-001' },
  { type: 'lesson', name: 'Pythagoras Theorem', description: 'Right-angled triangles', code: 'GEO-PYTH-001', grade_min: 9, grade_max: 10, order_num: 1, published: true, parent_code: 'GEO-001' },
  { type: 'lesson', name: 'Circle Theorems', description: 'Properties of circles', code: 'GEO-CIRC-001', grade_min: 10, grade_max: 11, order_num: 2, published: true, parent_code: 'GEO-001' },
  { type: 'lesson', name: 'Mean, Median, Mode', description: 'Measures of central tendency', code: 'STAT-AVG-001', grade_min: 9, grade_max: 10, order_num: 1, published: true, parent_code: 'STAT-001' },
  { type: 'lesson', name: 'Probability', description: 'Basic probability concepts', code: 'STAT-PROB-001', grade_min: 10, grade_max: 11, order_num: 2, published: true, parent_code: 'STAT-001' },
  { type: 'lesson', name: 'Differentiation Basics', description: 'Finding derivatives', code: 'CALC-DIFF-001', grade_min: 11, grade_max: 12, order_num: 1, published: true, parent_code: 'CALC-001' },
  { type: 'lesson', name: 'Integration Basics', description: 'Finding integrals', code: 'CALC-INT-001', grade_min: 12, grade_max: 13, order_num: 2, published: true, parent_code: 'CALC-001' },
  { type: 'lesson', name: 'Speed and Velocity', description: 'Motion concepts', code: 'FORCE-VEL-001', grade_min: 9, grade_max: 10, order_num: 1, published: true, parent_code: 'FORCE-001' },
  { type: 'lesson', name: 'Newton\'s Laws', description: 'Three laws of motion', code: 'FORCE-NEW-001', grade_min: 10, grade_max: 11, order_num: 2, published: true, parent_code: 'FORCE-001' }
];