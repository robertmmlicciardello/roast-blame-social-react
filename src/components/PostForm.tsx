
import { useState, useRef } from 'react';
import { Image, Video, Send, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { toast } from '@/hooks/use-toast';

export const PostForm = () => {
  const { user } = useAuth();
  const { createPost, loading } = usePosts();
  const [content, setContent] = useState('');
  const [celebrityName, setCelebrityName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [videoPreview, setVideoPreview] = useState<string>('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File too large", description: "Please select an image under 5MB", variant: "destructive" });
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setSelectedVideo(null);
      setVideoPreview('');
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({ title: "File too large", description: "Please select a video under 10MB", variant: "destructive" });
        return;
      }
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
      setSelectedImage(null);
      setImagePreview('');
    }
  };

  const removeMedia = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
    setImagePreview('');
    setVideoPreview('');
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({ title: "Content required", description: "Please enter some content for your roast!", variant: "destructive" });
      return;
    }

    if (!celebrityName.trim()) {
      toast({ title: "Celebrity name required", description: "Please specify which celebrity you're roasting!", variant: "destructive" });
      return;
    }

    try {
      await createPost({
        content: content.trim(),
        celebrityName: celebrityName.trim(),
        imageFile: selectedImage,
        videoFile: selectedVideo,
      });

      // Reset form
      setContent('');
      setCelebrityName('');
      removeMedia();
      
      toast({ title: "Roast posted!", description: "Your celebrity roast has been shared with the world!" });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({ title: "Error", description: "Failed to post your roast. Please try again.", variant: "destructive" });
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Create a New Roast</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Celebrity Name Input */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Target Celebrity
          </label>
          <input
            type="text"
            value={celebrityName}
            onChange={(e) => setCelebrityName(e.target.value)}
            placeholder="e.g., Taylor Swift, Elon Musk, etc."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>

        {/* Content Input */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Your Roast Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your humorous take... Keep it fun and respectful!"
            rows={4}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
            required
          />
          <div className="text-right text-white/60 text-sm mt-1">
            {content.length}/500
          </div>
        </div>

        {/* Media Upload */}
        <div className="flex flex-wrap gap-4">
          <div>
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Image className="h-4 w-4" />
              <span>Add Image</span>
            </button>
          </div>
          
          <div>
            <input
              type="file"
              ref={videoInputRef}
              onChange={handleVideoSelect}
              accept="video/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Video className="h-4 w-4" />
              <span>Add Video</span>
            </button>
          </div>
        </div>

        {/* Media Preview */}
        {(imagePreview || videoPreview) && (
          <div className="relative">
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {videoPreview && (
              <div className="relative inline-block">
                <video
                  src={videoPreview}
                  controls
                  className="max-w-full h-48 rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !content.trim() || !celebrityName.trim()}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Post Roast</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
