import { getAllUsers, getAllProgress, getAllBookings, getAllContent, getAllQuizzes } from '../lib/actions';

export default async function ActivityPanel() {
  const [users, progress, bookings, content, quizzes] = await Promise.all([
    getAllUsers(),
    getAllProgress(),
    getAllBookings(),
    getAllContent(),
    getAllQuizzes()
  ]);

  // Get recent activities (last 10 items sorted by date)
  const activities = [
    ...users.slice(0, 3).map(user => ({
      type: 'user_created',
      message: `New ${user.role} registered: ${user.first_name} ${user.last_name}`,
      time: new Date(user.created_at),
      icon: '👤'
    })),
    ...progress.slice(0, 3).map(prog => ({
      type: 'progress_updated',
      message: `Progress updated: ${prog.user_name} - ${prog.content_name} (${prog.completion}%)`,
      time: new Date(prog.updated_at),
      icon: '📊'
    })),
    ...bookings.slice(0, 3).map(booking => ({
      type: 'booking_created',
      message: `New booking: ${booking.tutor_first_name} ${booking.tutor_last_name} → ${booking.student_first_name} ${booking.student_last_name}`,
      time: new Date(booking.created_at),
      icon: '📅'
    })),
    ...content.slice(0, 2).map(item => ({
      type: 'content_created',
      message: `New content added: ${item.name} (${item.type})`,
      time: new Date(item.created_at),
      icon: '📚'
    }))
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div key={index} className="px-6 py-4 flex items-start space-x-3">
            <span className="text-lg">{activity.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}