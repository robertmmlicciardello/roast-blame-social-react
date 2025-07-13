
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from './PostCard';
import { AdPlaceholder } from './AdPlaceholder';

export const PostFeed = () => {
  const { posts, loading } = usePosts();

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 animate-pulse">
            <div className="h-4 bg-white/20 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-white/60 py-12">
        <h3 className="text-2xl font-semibold mb-4">No roasts yet!</h3>
        <p>Be the first to share a celebrity roast and get the conversation started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <div key={post.id}>
          <PostCard post={post} />
          {/* Insert ad every 3 posts */}
          {(index + 1) % 3 === 0 && <AdPlaceholder />}
        </div>
      ))}
    </div>
  );
};
