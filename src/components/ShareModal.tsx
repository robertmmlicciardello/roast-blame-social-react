
import { useState } from 'react';
import { X, Copy, Facebook, Twitter, MessageCircle, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareModalProps {
  post: {
    id: string;
    content: string;
    celebrityName: string;
  };
  onClose: () => void;
}

export const ShareModal = ({ post, onClose }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  const postUrl = `${window.location.origin}/post/${post.id}`;
  const shareText = `Check out this hilarious roast about ${post.celebrityName} on RoastBlame! "${post.content.slice(0, 100)}${post.content.length > 100 ? '...' : ''}"`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast({ title: "Link copied!", description: "Share link has been copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({ title: "Error", description: "Failed to copy link", variant: "destructive" });
    }
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${postUrl}`)}`;
    window.open(url, '_blank');
  };

  const shareViaEmail = () => {
    const subject = `Funny roast about ${post.celebrityName}`;
    const body = `${shareText}\n\n${postUrl}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-md rounded-xl p-6 w-full max-w-md border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Share this roast</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          {/* Copy Link */}
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center space-x-3 bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors"
          >
            <Copy className={`h-5 w-5 ${copied ? 'text-green-400' : 'text-white/80'}`} />
            <span className="text-white font-medium">
              {copied ? 'Link copied!' : 'Copy link'}
            </span>
          </button>

          {/* Facebook */}
          <button
            onClick={shareToFacebook}
            className="w-full flex items-center space-x-3 bg-blue-600/20 hover:bg-blue-600/30 p-4 rounded-lg transition-colors"
          >
            <Facebook className="h-5 w-5 text-blue-400" />
            <span className="text-white font-medium">Share on Facebook</span>
          </button>

          {/* Twitter */}
          <button
            onClick={shareToTwitter}
            className="w-full flex items-center space-x-3 bg-sky-500/20 hover:bg-sky-500/30 p-4 rounded-lg transition-colors"
          >
            <Twitter className="h-5 w-5 text-sky-400" />
            <span className="text-white font-medium">Share on Twitter</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={shareToWhatsApp}
            className="w-full flex items-center space-x-3 bg-green-600/20 hover:bg-green-600/30 p-4 rounded-lg transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-green-400" />
            <span className="text-white font-medium">Share on WhatsApp</span>
          </button>

          {/* Email */}
          <button
            onClick={shareViaEmail}
            className="w-full flex items-center space-x-3 bg-orange-600/20 hover:bg-orange-600/30 p-4 rounded-lg transition-colors"
          >
            <Mail className="h-5 w-5 text-orange-400" />
            <span className="text-white font-medium">Share via Email</span>
          </button>
        </div>

        {/* Preview */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white/80 text-sm font-medium mb-2">Preview:</h3>
          <p className="text-white/60 text-sm">{shareText}</p>
        </div>
      </div>
    </div>
  );
};
