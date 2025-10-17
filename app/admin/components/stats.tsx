/**
 * Admin Statistics Component
 * 
 * Displays key metrics and statistics for the admin dashboard.
 * Shows counts for users and content items in colored cards.
 */
import { getUserCount, getContentCount } from '@/app/admin/lib/queries';

export default async function AdminStats() {
  // Fetch statistics data from database
  const userCount = await getUserCount();
  const contentCount = await getContentCount();

  // Configuration for statistics cards with colors
  const statCards = [
    { name: 'Total Users', count: userCount, color: 'bg-blue-500' },
    { name: 'Content Items', count: contentCount, color: 'bg-green-500' },
  ];

  return (
    // Grid container for statistics cards
    <div className="grid grid-cols-2 gap-4 mb-6">
      {/* Map through stat cards to display each metric */}
      {statCards.map((stat) => (
        <div key={stat.name} className={`${stat.color} text-white p-4 rounded`}>
          {/* Statistic label */}
          <h3>{stat.name}</h3>
          {/* Statistic value in large text */}
          <p className="text-2xl">{stat.count}</p>
        </div>
      ))}
    </div>
  );
}