-- Content seed data for learning platform

-- Insert courses (parent_id = NULL)
INSERT INTO content (type, name, description, code, grade_min, grade_max, order_num, published) VALUES
('course', 'GCSE Mathematics', 'Complete GCSE Mathematics curriculum', 'GCSE-MATH', 9, 11, 1, TRUE),
('course', 'A-Level Mathematics', 'Advanced Level Mathematics', 'AL-MATH', 11, 13, 2, TRUE),
('course', 'GCSE Physics', 'Complete GCSE Physics curriculum', 'GCSE-PHYS', 9, 11, 3, TRUE);

-- Insert topics for GCSE Mathematics (parent_id will be set after)
INSERT INTO content (type, name, description, code, grade_min, grade_max, order_num, published) VALUES
('topic', 'Algebra', 'Algebraic expressions and equations', 'ALG-001', 9, 11, 1, TRUE),
('topic', 'Geometry', 'Shapes, angles and measurements', 'GEO-001', 9, 11, 2, TRUE),
('topic', 'Statistics', 'Data handling and probability', 'STAT-001', 9, 11, 3, TRUE);

-- Insert topics for A-Level Mathematics
INSERT INTO content (type, name, description, code, grade_min, grade_max, order_num, published) VALUES
('topic', 'Calculus', 'Differentiation and integration', 'CALC-001', 11, 13, 1, TRUE),
('topic', 'Mechanics', 'Forces and motion', 'MECH-001', 11, 13, 2, TRUE);

-- Insert topics for GCSE Physics
INSERT INTO content (type, name, description, code, grade_min, grade_max, order_num, published) VALUES
('topic', 'Forces and Motion', 'Newton\'s laws and kinematics', 'FORCE-001', 9, 11, 1, TRUE),
('topic', 'Electricity', 'Current, voltage and resistance', 'ELEC-001', 9, 11, 2, TRUE);

-- Insert lessons for Algebra
INSERT INTO content (type, name, description, code, grade_min, grade_max, order_num, published) VALUES
('lesson', 'Solving Linear Equations', 'Basic equation solving techniques', 'ALG-LIN-001', 9, 10, 1, TRUE),
('lesson', 'Quadratic Equations', 'Factoring and quadratic formula', 'ALG-QUAD-001', 10, 11, 2, TRUE),
('lesson', 'Simultaneous Equations', 'Solving systems of equations', 'ALG-SIM-001', 10, 11, 3, TRUE);

-- Insert lessons for Geometry
INSERT INTO content (type, name, description, code, grade_min, grade_max, order_num, published) VALUES
('lesson', 'Pythagoras Theorem', 'Right-angled triangles', 'GEO-PYTH-001', 9, 10, 1, TRUE),
('lesson', 'Circle Theorems', 'Properties of circles', 'GEO-CIRC-001', 10, 11, 2, TRUE);

-- Insert lessons for Statistics
INSERT INTO content (type, name, description, code, grade_min, grade_max, order_num, published) VALUES
('lesson', 'Mean, Median, Mode', 'Measures of central tendency', 'STAT-AVG-001', 9, 10, 1, TRUE),
('lesson', 'Probability', 'Basic probability concepts', 'STAT-PROB-001', 10, 11, 2, TRUE);

-- Insert lessons for Calculus
INSERT INTO content (type, name, description, code, grade_min, grade_max, order_num, published) VALUES
('lesson', 'Differentiation Basics', 'Finding derivatives', 'CALC-DIFF-001', 11, 12, 1, TRUE),
('lesson', 'Integration Basics', 'Finding integrals', 'CALC-INT-001', 12, 13, 2, TRUE);

-- Insert lessons for Forces and Motion
INSERT INTO content (type, name, description, code, grade_min, grade_max, order_num, published) VALUES
('lesson', 'Speed and Velocity', 'Motion concepts', 'FORCE-VEL-001', 9, 10, 1, TRUE),
('lesson', 'Newton\'s Laws', 'Three laws of motion', 'FORCE-NEW-001', 10, 11, 2, TRUE);

-- Update parent_id for topics (link to courses)
UPDATE content SET parent_id = (SELECT id FROM content WHERE code = 'GCSE-MATH') 
WHERE code IN ('ALG-001', 'GEO-001', 'STAT-001');

UPDATE content SET parent_id = (SELECT id FROM content WHERE code = 'AL-MATH') 
WHERE code IN ('CALC-001', 'MECH-001');

UPDATE content SET parent_id = (SELECT id FROM content WHERE code = 'GCSE-PHYS') 
WHERE code IN ('FORCE-001', 'ELEC-001');

-- Update parent_id for lessons (link to topics)
UPDATE content SET parent_id = (SELECT id FROM content WHERE code = 'ALG-001') 
WHERE code IN ('ALG-LIN-001', 'ALG-QUAD-001', 'ALG-SIM-001');

UPDATE content SET parent_id = (SELECT id FROM content WHERE code = 'GEO-001') 
WHERE code IN ('GEO-PYTH-001', 'GEO-CIRC-001');

UPDATE content SET parent_id = (SELECT id FROM content WHERE code = 'STAT-001') 
WHERE code IN ('STAT-AVG-001', 'STAT-PROB-001');

UPDATE content SET parent_id = (SELECT id FROM content WHERE code = 'CALC-001') 
WHERE code IN ('CALC-DIFF-001', 'CALC-INT-001');

UPDATE content SET parent_id = (SELECT id FROM content WHERE code = 'FORCE-001') 
WHERE code IN ('FORCE-VEL-001', 'FORCE-NEW-001');