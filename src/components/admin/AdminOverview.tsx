
import { Users, FileText, Flag, TrendingUp, Eye, Heart, MessageSquare, AlertTriangle } from 'lucide-react';

export const AdminOverview = () => {
  // Mock statistics data
  const stats = {
    totalUsers: 1247,
    totalPosts: 3856,
    pendingReports: 12,
    newUsersToday: 23,
    totalViews: 45782,
    totalReactions: 8934,
    activeReports: 12,
    deletedPosts: 45
  };

  const topPosts = [
    {
      id: 1,
      content: "Just saw Elon Musk's latest tweet about buying the moon...",
      celebrity: 'Elon Musk',
      author: 'comedy_fan@example.com',
      reactions: 142,
      reports: 0
    },
    {
      id: 2,
      content: "Taylor Swift probably has a song about her morning coffee...",
      celebrity: 'Taylor Swift',
      author: 'Anonymous User #A1B2',
      reactions: 120,
      reports: 1
    },
    {
      id: 3,
      content: "Gordon Ramsay would probably find a way to criticize...",
      celebrity: 'Gordon Ramsay',
      author: 'foodie_joker@example.com',
      reactions: 196,
      reports: 0
    }
  ];

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value.toLocaleString()}</p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change > 0 ? '+' : ''}{change}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Monitor your RoastBlame platform's performance and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={FileText}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="Pending Reports"
          value={stats.pendingReports}
          icon={Flag}
          color="bg-red-500"
          change={-15}
        />
        <StatCard
          title="New Users Today"
          value={stats.newUsersToday}
          icon={TrendingUp}
          color="bg-purple-500"
          change={23}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon={Eye}
          color="bg-indigo-500"
        />
        <StatCard
          title="Total Reactions"
          value={stats.totalReactions}
          icon={Heart}
          color="bg-pink-500"
        />
        <StatCard
          title="Active Reports"
          value={stats.activeReports}
          icon={AlertTriangle}
          color="bg-orange-500"
        />
        <StatCard
          title="Deleted Posts"
          value={stats.deletedPosts}
          icon={MessageSquare}
          color="bg-gray-500"
        />
      </div>

      {/* Top Posts */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Top Performing Posts</h2>
        <div className="space-y-4">
          {topPosts.map((post, index) => (
            <div key={post.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                  <span className="text-purple-400 text-sm">Roasting: {post.celebrity}</span>
                </div>
                <p className="text-white font-medium mb-1">
                  {post.content.length > 60 ? `${post.content.substring(0, 60)}...` : post.content}
                </p>
                <p className="text-gray-400 text-sm">by {post.author}</p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="text-green-400 font-bold">{post.reactions}</div>
                  <div className="text-gray-400">reactions</div>
                </div>
                <div className="text-center">
                  <div className={`font-bold ${post.reports > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {post.reports}
                  </div>
                  <div className="text-gray-400">reports</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-3">Recent Activity</h3>
          <div className="space-y-2 text-sm">
            <div className="text-gray-300">• New user registered: user_abc123</div>
            <div className="text-gray-300">• Post reported: "Inappropriate content"</div>
            <div className="text-gray-300">• User banned: spam_account@test.com</div>
            <div className="text-gray-300">• New post: Celebrity roast by anonymous user</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-3">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Database</span>
              <span className="text-green-400">●</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">File Storage</span>
              <span className="text-green-400">●</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Authentication</span>
              <span className="text-green-400">●</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">CDN</span>
              <span className="text-yellow-400">●</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
              Review Reports
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
              Manage Users
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
              Site Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
