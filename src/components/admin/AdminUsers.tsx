
import { useState } from 'react';
import { Search, Filter, Ban, UserCheck, Mail, Calendar, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Mock users data
  const [users, setUsers] = useState([
    {
      id: 'user_123',
      email: 'comedy_fan@example.com',
      displayName: 'comedy_fan@example.com',
      isAnonymous: false,
      joinedAt: new Date('2024-01-10T09:00:00'),
      lastActive: new Date('2024-01-15T14:30:00'),
      postsCount: 12,
      reactionsGiven: 89,
      reportsReceived: 0,
      status: 'active',
      role: 'user'
    },
    {
      id: 'anon_456',
      email: null,
      displayName: 'Anonymous User #A1B2',
      isAnonymous: true,
      joinedAt: new Date('2024-01-14T16:20:00'),
      lastActive: new Date('2024-01-15T11:15:00'),
      postsCount: 3,
      reactionsGiven: 24,
      reportsReceived: 1,
      status: 'active',
      role: 'user'
    },
    {
      id: 'user_789',
      email: 'foodie_joker@example.com',
      displayName: 'foodie_joker@example.com',
      isAnonymous: false,
      joinedAt: new Date('2024-01-08T12:45:00'),
      lastActive: new Date('2024-01-15T09:30:00'),
      postsCount: 8,
      reactionsGiven: 156,
      reportsReceived: 0,
      status: 'active',
      role: 'user'
    },
    {
      id: 'user_banned',
      email: 'spammer@test.com',
      displayName: 'spammer@test.com',
      isAnonymous: false,
      joinedAt: new Date('2024-01-12T08:00:00'),
      lastActive: new Date('2024-01-13T20:00:00'),
      postsCount: 45,
      reactionsGiven: 12,
      reportsReceived: 8,
      status: 'banned',
      role: 'user',
      banReason: 'Repeated spam posting'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleBanUser = (user: any) => {
    setSelectedUser(user);
    setShowBanModal(true);
  };

  const confirmBanUser = (reason: string) => {
    setUsers(users.map(u => 
      u.id === selectedUser.id 
        ? { ...u, status: 'banned', banReason: reason }
        : u
    ));
    toast({ 
      title: selectedUser.status === 'banned' ? "User unbanned" : "User banned", 
      description: `${selectedUser.displayName} has been ${selectedUser.status === 'banned' ? 'unbanned' : 'banned'}` 
    });
    setShowBanModal(false);
    setSelectedUser(null);
  };

  const getStatusBadge = (status: string, reportsReceived: number) => {
    if (status === 'banned') {
      return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">Banned</span>;
    }
    
    if (reportsReceived > 0) {
      return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">Flagged ({reportsReceived})</span>;
    }
    
    return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Active</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-gray-400">Manage user accounts, review activity, and handle moderation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{users.filter(u => u.status === 'active').length}</div>
          <div className="text-gray-400 text-sm">Active Users</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{users.filter(u => u.isAnonymous).length}</div>
          <div className="text-gray-400 text-sm">Anonymous Users</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{users.filter(u => u.status === 'banned').length}</div>
          <div className="text-gray-400 text-sm">Banned Users</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{users.filter(u => u.reportsReceived > 0).length}</div>
          <div className="text-gray-400 text-sm">Flagged Users</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users by email or display name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-8 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[150px]"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            Users ({filteredUsers.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-700">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-6 hover:bg-gray-750 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* User Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-2">
                      {user.isAnonymous ? (
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <Shield className="h-4 w-4 text-gray-400" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-white font-medium">{user.displayName}</div>
                        {user.email && (
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(user.status, user.reportsReceived)}
                    {user.isAnonymous && (
                      <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                        Anonymous
                      </span>
                    )}
                  </div>

                  {/* User Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{user.postsCount}</div>
                      <div className="text-gray-400 text-xs">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{user.reactionsGiven}</div>
                      <div className="text-gray-400 text-xs">Reactions</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${user.reportsReceived > 0 ? 'text-red-400' : 'text-white'}`}>
                        {user.reportsReceived}
                      </div>
                      <div className="text-gray-400 text-xs">Reports</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {Math.floor((new Date().getTime() - user.joinedAt.getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-gray-400 text-xs">Days</div>
                    </div>
                  </div>

                  {/* User Meta */}
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {user.joinedAt.toLocaleDateString()}</span>
                    </div>
                    <div>
                      Last active: {user.lastActive.toLocaleDateString()}
                    </div>
                    {user.banReason && (
                      <div className="text-red-400">
                        Ban reason: {user.banReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {user.email && (
                    <button
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Send Email"
                    >
                      <Mail className="h-5 w-5" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleBanUser(user)}
                    className={`p-2 hover:bg-gray-700 rounded-lg transition-colors ${
                      user.status === 'banned' 
                        ? 'text-gray-400 hover:text-green-400' 
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                    title={user.status === 'banned' ? 'Unban User' : 'Ban User'}
                  >
                    {user.status === 'banned' ? <UserCheck className="h-5 w-5" /> : <Ban className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-2">No users found</div>
            <div className="text-gray-500 text-sm">Try adjusting your search or filter criteria</div>
          </div>
        )}
      </div>

      {/* Ban/Unban Modal */}
      {showBanModal && selectedUser && (
        <BanUserModal
          user={selectedUser}
          onConfirm={confirmBanUser}
          onCancel={() => setShowBanModal(false)}
        />
      )}
    </div>
  );
};

const BanUserModal = ({ user, onConfirm, onCancel }: any) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const isBanned = user.status === 'banned';
  const banReasons = [
    'Spam posting',
    'Harassment or bullying',
    'Inappropriate content',
    'Hate speech',
    'False information',
    'Multiple rule violations',
    'Other'
  ];

  const handleConfirm = () => {
    if (!isBanned) {
      const finalReason = reason === 'Other' ? customReason : reason;
      if (!finalReason) {
        toast({ title: "Please select or provide a reason", variant: "destructive" });
        return;
      }
      onConfirm(finalReason);
    } else {
      onConfirm('Unbanned by admin');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">
          {isBanned ? 'Unban User' : 'Ban User'}
        </h3>
        
        <div className="mb-4">
          <p className="text-gray-300 mb-2">
            {isBanned 
              ? 'You are about to unban this user:' 
              : 'You are about to ban this user:'
            }
          </p>
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-white font-medium">{user.displayName}</p>
            {user.email && <p className="text-gray-400 text-sm">{user.email}</p>}
            {isBanned && user.banReason && (
              <p className="text-red-400 text-sm mt-1">Current reason: {user.banReason}</p>
            )}
          </div>
        </div>

        {!isBanned && (
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              Reason for ban:
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {banReasons.map((banReason) => (
                <label key={banReason} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={banReason}
                    checked={reason === banReason}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-red-500 focus:ring-red-500"
                  />
                  <span className="text-gray-300 text-sm">{banReason}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {reason === 'Other' && !isBanned && (
          <div className="mb-4">
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Please specify the reason..."
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors text-white ${
              isBanned 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isBanned ? 'Unban User' : 'Ban User'}
          </button>
        </div>
      </div>
    </div>
  );
};
