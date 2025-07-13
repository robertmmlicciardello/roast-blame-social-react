
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

interface Post {
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
  isDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: Date;
  deletedReason?: string;
}

interface CreatePostData {
  content: string;
  celebrityName: string;
  imageFile?: File | null;
  videoFile?: File | null;
}

interface PostsError {
  message: string;
  type: 'network' | 'auth' | 'validation' | 'storage' | 'unknown';
}

export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostsError | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Memoized mock data to prevent recreation on every render
  const mockPosts = useMemo(() => [
    {
      id: 'post_1',
      content: "Just saw Elon Musk's latest tweet about buying the moon. At this point, I wouldn't be surprised if he actually does it and then complains about the lack of WiFi up there! 🚀",
      celebrityName: 'Elon Musk',
      authorId: 'user_demo1',
      authorEmail: 'comedy_fan@example.com',
      createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 30) },
      reactions: { likes: 42, dislikes: 3, funny: 28 },
      userReactions: {}
    },
    {
      id: 'post_2',
      content: "Taylor Swift probably has a song about her morning coffee by now. 'We Are Never Ever Getting Back Together (With Decaf)' coming to streaming platforms soon! ☕",
      celebrityName: 'Taylor Swift',
      authorId: 'anon_demo1',
      createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 60 * 2) },
      reactions: { likes: 67, dislikes: 8, funny: 45 },
      userReactions: {}
    },
    {
      id: 'post_3',
      content: "Gordon Ramsay would probably find a way to criticize how I'm reading this post right now. 'This reading technique is RAW! Absolutely RAW!' 👨‍🍳",
      celebrityName: 'Gordon Ramsay',
      authorId: 'user_demo2',
      authorEmail: 'foodie_joker@example.com',
      createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 60 * 4) },
      reactions: { likes: 89, dislikes: 5, funny: 102 },
      userReactions: {}
    }
  ], []);

  // Load posts with error handling
  const loadPosts = useCallback(async (pageNum: number = 1) => {
    try {
      setError(null);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (pageNum === 1) {
        // Load saved posts from localStorage
        const savedPosts = localStorage.getItem('roastblame_posts');
        if (savedPosts) {
          try {
            const parsedPosts = JSON.parse(savedPosts)
              .filter((post: any) => !post.isDeleted) // Filter out deleted posts
              .map((post: any) => ({
                ...post,
                createdAt: { toDate: () => new Date(post.createdAt) }
              }));
            setPosts([...parsedPosts, ...mockPosts]);
          } catch (parseError) {
            console.warn('Failed to parse saved posts:', parseError);
            setPosts(mockPosts);
          }
        } else {
          setPosts(mockPosts);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError({
        message: 'Failed to load posts. Please check your internet connection and try again.',
        type: 'network'
      });
      setLoading(false);
    }
  }, [mockPosts]);

  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  // Create post with comprehensive error handling
  const createPost = useCallback(async (postData: CreatePostData) => {
    if (!user) {
      const error: PostsError = {
        message: 'You must be logged in to create posts',
        type: 'auth'
      };
      setError(error);
      throw new Error(error.message);
    }

    // Validate post content
    if (!postData.content.trim()) {
      const error: PostsError = {
        message: 'Post content cannot be empty',
        type: 'validation'
      };
      setError(error);
      throw new Error(error.message);
    }

    if (postData.content.length > 500) {
      const error: PostsError = {
        message: 'Post content cannot exceed 500 characters',
        type: 'validation'
      };
      setError(error);
      throw new Error(error.message);
    }

    if (!postData.celebrityName.trim()) {
      const error: PostsError = {
        message: 'Celebrity name is required',
        type: 'validation'
      };
      setError(error);
      throw new Error(error.message);
    }

    // Validate file sizes
    if (postData.imageFile && postData.imageFile.size > 5 * 1024 * 1024) {
      const error: PostsError = {
        message: 'Image file size cannot exceed 5MB',
        type: 'validation'
      };
      setError(error);
      throw new Error(error.message);
    }

    if (postData.videoFile && postData.videoFile.size > 10 * 1024 * 1024) {
      const error: PostsError = {
        message: 'Video file size cannot exceed 10MB',
        type: 'validation'
      };
      setError(error);
      throw new Error(error.message);
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In production, this would upload files to Firebase Storage
      let imageUrl: string | undefined;
      let videoUrl: string | undefined;

      if (postData.imageFile) {
        // Simulate file upload
        imageUrl = URL.createObjectURL(postData.imageFile);
      }

      if (postData.videoFile) {
        // Simulate file upload
        videoUrl = URL.createObjectURL(postData.videoFile);
      }

      const newPost: Post = {
        id: 'post_' + Math.random().toString(36).substr(2, 9),
        content: postData.content.trim(),
        celebrityName: postData.celebrityName.trim(),
        authorId: user.uid,
        authorEmail: user.isAnonymous ? undefined : user.email,
        imageUrl,
        videoUrl,
        createdAt: { toDate: () => new Date() },
        reactions: { likes: 0, dislikes: 0, funny: 0 },
        userReactions: {}
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);

      // Save to localStorage (simulating Firestore)
      const postsToSave = updatedPosts.map(post => ({
        ...post,
        createdAt: post.createdAt.toDate().toISOString()
      }));
      localStorage.setItem('roastblame_posts', JSON.stringify(postsToSave));

      setLoading(false);
      return newPost;
    } catch (err) {
      console.error('Error creating post:', err);
      const error: PostsError = {
        message: 'Failed to create post. Please try again.',
        type: 'unknown'
      };
      setError(error);
      setLoading(false);
      throw new Error(error.message);
    }
  }, [user, posts]);

  // Update post reaction with optimistic updates
  const updatePostReaction = useCallback(async (postId: string, reactionType: 'like' | 'dislike' | 'funny') => {
    if (!user) {
      const error: PostsError = {
        message: 'You must be logged in to react to posts',
        type: 'auth'
      };
      setError(error);
      throw new Error(error.message);
    }

    // Optimistic update
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const currentUserReaction = post.userReactions?.[user.uid];
        const newUserReactions = { ...post.userReactions };
        const newReactions = { ...post.reactions };

        // Remove old reaction if exists
        if (currentUserReaction) {
          newReactions[currentUserReaction]--;
        }

        // Add new reaction or toggle off if same
        if (currentUserReaction === reactionType) {
          delete newUserReactions[user.uid];
        } else {
          newUserReactions[user.uid] = reactionType;
          newReactions[reactionType]++;
        }

        return {
          ...post,
          reactions: newReactions,
          userReactions: newUserReactions
        };
      }
      return post;
    });

    setPosts(updatedPosts);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // Save to localStorage
      const postsToSave = updatedPosts.map(post => ({
        ...post,
        createdAt: post.createdAt.toDate().toISOString()
      }));
      localStorage.setItem('roastblame_posts', JSON.stringify(postsToSave));
    } catch (err) {
      console.error('Error updating reaction:', err);
      // Revert optimistic update on error
      loadPosts(1);
      const error: PostsError = {
        message: 'Failed to update reaction. Please try again.',
        type: 'network'
      };
      setError(error);
      throw new Error(error.message);
    }
  }, [user, posts, loadPosts]);

  // Delete post (admin function)
  const deletePost = useCallback(async (postId: string, reason: string, adminId: string) => {
    try {
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedPosts = posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isDeleted: true, 
              deletedBy: adminId,
              deletedAt: new Date(),
              deletedReason: reason
            }
          : post
      );

      setPosts(updatedPosts.filter(post => !post.isDeleted));

      // Save to localStorage
      const postsToSave = updatedPosts.map(post => ({
        ...post,
        createdAt: post.createdAt.toDate().toISOString()
      }));
      localStorage.setItem('roastblame_posts', JSON.stringify(postsToSave));

      // Log admin action
      const adminLog = {
        id: 'log_' + Math.random().toString(36).substr(2, 9),
        action: 'DELETE_POST',
        adminId,
        targetId: postId,
        reason,
        timestamp: new Date().toISOString()
      };

      const existingLogs = localStorage.getItem('roastblame_admin_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(adminLog);
      localStorage.setItem('roastblame_admin_logs', JSON.stringify(logs));

    } catch (err) {
      console.error('Error deleting post:', err);
      const error: PostsError = {
        message: 'Failed to delete post. Please try again.',
        type: 'unknown'
      };
      setError(error);
      throw new Error(error.message);
    }
  }, [posts]);

  // Retry function for error recovery
  const retry = useCallback(() => {
    setError(null);
    loadPosts(page);
  }, [loadPosts, page]);

  // Memoized return value to prevent unnecessary re-renders
  return useMemo(() => ({
    posts,
    loading,
    error,
    hasMore,
    createPost,
    updatePostReaction,
    deletePost,
    retry,
    loadMore: () => setPage(prev => prev + 1)
  }), [posts, loading, error, hasMore, createPost, updatePostReaction, deletePost, retry]);
};
