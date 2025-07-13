import { useState } from 'react';
import { Heart, ThumbsDown, Laugh, Share2, Flag, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { ReportModal } from './ReportModal';
import { ShareModal } from './ShareModal';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { CreatorTipping } from './crypto/CreatorTipping';
import { NFTMinting } from './crypto/NFTMinting';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    celebrityName: string;
    authorId: string;
    authorEmail?: string;
    imageUrl?: string;
    videoUrl?: string;
    createdAt: any;
    reactions: {
      likes: number;
      dislikes: number;
      funny: number;
    };
    userReactions?: {
      [userId: string]: 'like' | 'dislike' | 'funny';
    };
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const { updatePostReaction } = usePosts();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const getAuthorDisplay = () => {
    if (post.authorEmail) {
      return post.authorEmail;
    }
    return `Anonymous User #${post.authorId.slice(-4).toUpperCase()}`;
  };

  const getUserReaction = () => {
    if (!user || !post.userReactions) return null;
    return post.userReactions[user.uid] || null;
  };

  const handleReaction = async (reactionType: 'like' | 'dislike' | 'funny') => {
    if (!user) {
      toast({ title: "Login required", description: "Please log in to react to posts", variant: "destructive" });
      return;
    }

    try {
      await updatePostReaction(post.id, reactionType);
    } catch (error) {
      console.error('Error updating reaction:', error);
      toast({ title: "Error", description: "Failed to update reaction", variant: "destructive" });
    }
  };

  const userReaction = getUserReaction();

  const handleTipSent = (amount: number, currency: string) => {
    console.log(`Tip sent: ${amount} ${currency} to post ${post.id}`);
    // You could update the post with tip information here
  };

  const handleNFTMinted = (nftData: any) => {
    console.log('NFT minted for post:', post.id, nftData);
    // You could update the post to show it's been minted as NFT
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-white/80 text-sm">{getAuthorDisplay()}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/60 text-sm">
                {formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}
              </span>
            </div>
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1 rounded-full text-sm font-medium inline-block">
              Roasting: {post.celebrityName}
            </div>
          </div>
          
          <button
            onClick={() => setShowReportModal(true)}
            className="text-white/40 hover:text-red-400 transition-colors"
            title="Report post"
          >
            <Flag className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="text-white mb-4">
          <p className="text-lg leading-relaxed">{post.content}</p>
        </div>

        {/* Media */}
        {post.imageUrl && (
          <div className="mb-4">
            <img
              src={post.imageUrl}
              alt="Post image"
              className="w-full max-w-md rounded-lg object-cover"
            />
          </div>
        )}

        {post.videoUrl && (
          <div className="mb-4">
            <video
              src={post.videoUrl}
              controls
              className="w-full max-w-md rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-6">
            {/* Like */}
            <button
              onClick={() => handleReaction('like')}
              className={`flex items-center space-x-2 transition-colors ${
                userReaction === 'like' 
                  ? 'text-pink-400' 
                  : 'text-white/60 hover:text-pink-400'
              }`}
            >
              <Heart className={`h-5 w-5 ${userReaction === 'like' ? 'fill-current' : ''}`} />
              <span>{post.reactions.likes}</span>
            </button>

            {/* Dislike */}
            <button
              onClick={() => handleReaction('dislike')}
              className={`flex items-center space-x-2 transition-colors ${
                userReaction === 'dislike' 
                  ? 'text-red-400' 
                  : 'text-white/60 hover:text-red-400'
              }`}
            >
              <ThumbsDown className={`h-5 w-5 ${userReaction === 'dislike' ? 'fill-current' : ''}`} />
              <span>{post.reactions.dislikes}</span>
            </button>

            {/* Funny */}
            <button
              onClick={() => handleReaction('funny')}
              className={`flex items-center space-x-2 transition-colors ${
                userReaction === 'funny' 
                  ? 'text-yellow-400' 
                  : 'text-white/60 hover:text-yellow-400'
              }`}
            >
              <Laugh className={`h-5 w-5 ${userReaction === 'funny' ? 'fill-current' : ''}`} />
              <span>{post.reactions.funny}</span>
            </button>

            {/* Creator Tipping */}
            <CreatorTipping
              postId={post.id}
              creatorId={post.authorId}
              creatorWallet="0x742B2f61F0b3b8fE26e726e43D73B9F0B1b65d0d" // This would come from user profile
              onTipSent={handleTipSent}
            />

            {/* NFT Minting (Admin only) */}
            <NFTMinting
              postId={post.id}
              postContent={post.content}
              postImage={post.imageUrl}
              creatorId={post.authorId}
              onMintSuccess={handleNFTMinted}
            />
          </div>

          {/* Share */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center space-x-2 text-white/60 hover:text-blue-400 transition-colors"
          >
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showReportModal && (
        <ReportModal
          postId={post.id}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {showShareModal && (
        <ShareModal
          post={post}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
};
