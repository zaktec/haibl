export async function seedBookings(sql: any, tutorUsers: any[], studentUsers: any[]) {
  return await sql`
    INSERT INTO bookings (tutor_id, student_id, session_type, delivery_mode, location, scheduled_start, scheduled_end, status, max_participants, notes) VALUES
    (${tutorUsers[0].id}, ${studentUsers[0].id}, 'individual', 'online', 'Zoom Meeting', '2024-01-15 14:00:00', '2024-01-15 15:00:00', 'completed', 1, 'Algebra revision session'),
    (${tutorUsers[0].id}, ${studentUsers[1].id}, 'individual', 'face_to_face', 'Library Room 3', '2024-01-16 10:00:00', '2024-01-16 11:30:00', 'confirmed', 1, 'GCSE preparation'),
    (${tutorUsers[1].id}, ${studentUsers[2].id}, 'group', 'online', 'Teams Meeting', '2024-01-17 16:00:00', '2024-01-17 17:00:00', 'pending', 3, 'Group study session'),
    (${tutorUsers[2].id}, ${studentUsers[0].id}, 'individual', 'online', 'Google Meet', '2024-01-18 13:00:00', '2024-01-18 14:00:00', 'confirmed', 1, 'Geometry practice')
    RETURNING id
  `;
}