
import { useState } from 'react';
import { Search, Filter, Trash2, Eye, Flag, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const AdminPosts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Mock posts data
  const [posts, setPosts] = useState([
    {
      id: 'post_1',
      content: "Just saw Elon Musk's latest tweet about buying the moon. At this point, I wouldn't be surprised if he actually does it and then complains about the lack of WiFi up there! 🚀",
      celebrityName: 'Elon Musk',
      author: 'comedy_fan@example.com',
      authorId: 'user_123',
      createdAt: new Date('2024-01-15T10:30:00'),
      reactions: { likes: 42, dislikes: 3, funny: 28 },
      reports: 0,
      status: 'active',
      hasMedia: false
    },
    {
      id: 'post_2',
      content: "Taylor Swift probably has a song about her morning coffee by now. 'We Are Never Ever Getting Back Together (With Decaf)' coming to streaming platforms soon! ☕",
      celebrityName: 'Taylor Swift',
      author: 'Anonymous User #A1B2',
      authorId: 'anon_456',
      createdAt: new Date('2024-01-15T08:15:00'),
      reactions: { likes: 67, dislikes: 8, funny: 45 },
      reports: 1,
      status: 'reported',
      hasMedia: false
    },
    {
      id: 'post_3',
      content: "Gordon Ramsay would probably find a way to criticize how I'm reading this post right now. 'This reading technique is RAW! Absolutely RAW!' 👨‍🍳",
      celebrityName: 'Gordon Ramsay',
      author: 'foodie_joker@example.com',
      authorId: 'user_789',
      createdAt: new Date('2024-01-15T06:45:00'),
      reactions: { likes: 89, dislikes: 5, funny: 102 },
      reports: 0,
      status: 'active',
      hasMedia: true
    }
  ]);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.celebrityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || post.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleDeletePost = (post: any) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const confirmDeletePost = (reason: string) => {
    setPosts(posts.filter(p => p.id !== selectedPost.id));
    toast({ 
      title: "Post deleted", 
      description: `Post by ${selectedPost.author} has been removed. Reason: ${reason}` 
    });
    setShowDeleteModal(false);
    setSelectedPost(null);
  };

  const getStatusBadge = (status: string, reports: number) => {
    if (reports > 0) {
      return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">Reported ({reports})</span>;
    }
    
    switch (status) {
      case 'active':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Active</span>;
      case 'deleted':
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs">Deleted</span>;
      default:
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
        <p className="text-gray-400">Manage posts, review content, and moderate discussions</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search posts, celebrities, or authors..."
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
              <option value="all">All Posts</option>
              <option value="active">Active</option>
              <option value="reported">Reported</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            Posts ({filteredPosts.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-700">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-6 hover:bg-gray-750 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Post Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                      Roasting: {post.celebrityName}
                    </span>
                    {getStatusBadge(post.status, post.reports)}
                    {post.hasMedia && (
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                        Has Media
                      </span>
                    )}
                  </div>

                  {/* Post Content */}
                  <p className="text-white mb-3 leading-relaxed">{post.content}</p>

                  {/* Post Meta */}
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div>Author: <span className="text-white">{post.author}</span></div>
                    <div>
                      Reactions: <span className="text-green-400">{post.reactions.likes + post.reactions.funny}</span>
                    </div>
                    {post.reports > 0 && (
                      <div className="flex items-center space-x-1 text-red-400">
                        <Flag className="h-4 w-4" />
                        <span>{post.reports} report{post.reports > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={() => handleDeletePost(post)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete Post"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-2">No posts found</div>
            <div className="text-gray-500 text-sm">Try adjusting your search or filter criteria</div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedPost && (
        <DeletePostModal
          post={selectedPost}
          onConfirm={confirmDeletePost}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

const DeletePostModal = ({ post, onConfirm, onCancel }: any) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const deleteReasons = [
    'Inappropriate content',
    'Harassment or bullying',
    'Spam',
    'False information',
    'Hate speech',
    'Copyright violation',
    'Violates community guidelines',
    'Other'
  ];

  const handleConfirm = () => {
    const finalReason = reason === 'Other' ? customReason : reason;
    if (!finalReason) {
      toast({ title: "Please select or provide a reason", variant: "destructive" });
      return;
    }
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Delete Post</h3>
        
        <div className="mb-4">
          <p className="text-gray-300 mb-2">You are about to delete this post:</p>
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-white text-sm">{post.content.substring(0, 100)}...</p>
            <p className="text-gray-400 text-xs mt-1">by {post.author}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Reason for deletion:
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {deleteReasons.map((deleteReason) => (
              <label key={deleteReason} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="reason"
                  value={deleteReason}
                  checked={reason === deleteReason}
                  onChange={(e) => setReason(e.target.value)}
                  className="text-red-500 focus:ring-red-500"
                />
                <span className="text-gray-300 text-sm">{deleteReason}</span>
              </label>
            ))}
          </div>
        </div>

        {reason === 'Other' && (
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
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Delete Post
          </button>
        </div>
      </div>
    </div>
  );
};
