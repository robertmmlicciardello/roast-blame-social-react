
import { useState, useEffect } from 'react';
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
}

interface CreatePostData {
  content: string;
  celebrityName: string;
  imageFile?: File | null;
  videoFile?: File | null;
}

export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const loadPosts = () => {
      const mockPosts: Post[] = [
        {
          id: 'post_1',
          content: "Just saw Elon Musk's latest tweet about buying the moon. At this point, I wouldn't be surprised if he actually does it and then complains about the lack of WiFi up there! 🚀",
          celebrityName: 'Elon Musk',
          authorId: 'user_demo1',
          authorEmail: 'comedy_fan@example.com',
          createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 30) }, // 30 minutes ago
          reactions: {
            likes: 42,
            dislikes: 3,
            funny: 28
          },
          userReactions: {}
        },
        {
          id: 'post_2',
          content: "Taylor Swift probably has a song about her morning coffee by now. 'We Are Never Ever Getting Back Together (With Decaf)' coming to streaming platforms soon! ☕",
          celebrityName: 'Taylor Swift',
          authorId: 'anon_demo1',
          createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 60 * 2) }, // 2 hours ago
          reactions: {
            likes: 67,
            dislikes: 8,
            funny: 45
          },
          userReactions: {}
        },
        {
          id: 'post_3',
          content: "Gordon Ramsay would probably find a way to criticize how I'm reading this post right now. 'This reading technique is RAW! Absolutely RAW!' 👨‍🍳",
          celebrityName: 'Gordon Ramsay',
          authorId: 'user_demo2',
          authorEmail: 'foodie_joker@example.com',
          createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 60 * 4) }, // 4 hours ago
          reactions: {
            likes: 89,
            dislikes: 5,
            funny: 102
          },
          userReactions: {}
        }
      ];

      // Load saved posts from localStorage
      const savedPosts = localStorage.getItem('roastblame_posts');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts).map((post: any) => ({
          ...post,
          createdAt: { toDate: () => new Date(post.createdAt) }
        }));
        setPosts([...parsedPosts, ...mockPosts]);
      } else {
        setPosts(mockPosts);
      }
      
      setLoading(false);
    };

    setTimeout(loadPosts, 1000); // Simulate loading delay
  }, []);

  const createPost = async (postData: CreatePostData) => {
    if (!user) throw new Error('Must be logged in to create posts');

    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newPost: Post = {
      id: 'post_' + Math.random().toString(36).substr(2, 9),
      content: postData.content,
      celebrityName: postData.celebrityName,
      authorId: user.uid,
      authorEmail: user.isAnonymous ? undefined : user.email,
      imageUrl: postData.imageFile ? URL.createObjectURL(postData.imageFile) : undefined,
      videoUrl: postData.videoFile ? URL.createObjectURL(postData.videoFile) : undefined,
      createdAt: { toDate: () => new Date() },
      reactions: {
        likes: 0,
        dislikes: 0,
        funny: 0
      },
      userReactions: {}
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);

    // Save to localStorage (simulating database)
    const postsToSave = updatedPosts.map(post => ({
      ...post,
      createdAt: post.createdAt.toDate().toISOString()
    }));
    localStorage.setItem('roastblame_posts', JSON.stringify(postsToSave));

    setLoading(false);
  };

  const updatePostReaction = async (postId: string, reactionType: 'like' | 'dislike' | 'funny') => {
    if (!user) throw new Error('Must be logged in to react');

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

    // Save to localStorage
    const postsToSave = updatedPosts.map(post => ({
      ...post,
      createdAt: post.createdAt.toDate().toISOString()
    }));
    localStorage.setItem('roastblame_posts', JSON.stringify(postsToSave));
  };

  return {
    posts,
    loading,
    createPost,
    updatePostReaction
  };
};
