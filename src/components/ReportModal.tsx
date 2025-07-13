
import { useState } from 'react';
import { X, Flag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReportModalProps {
  postId: string;
  onClose: () => void;
}

export const ReportModal = ({ postId, onClose }: ReportModalProps) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);

  const reportReasons = [
    'Inappropriate content',
    'Harassment or bullying',
    'Spam',
    'False information',
    'Hate speech',
    'Copyright violation',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      toast({ title: "Please select a reason", variant: "destructive" });
      return;
    }

    if (reason === 'Other' && !customReason.trim()) {
      toast({ title: "Please provide details for 'Other'", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send the report to the backend
      console.log('Report submitted:', {
        postId,
        reason: reason === 'Other' ? customReason : reason,
        timestamp: new Date().toISOString()
      });

      toast({ title: "Report submitted", description: "Thank you for helping keep our community safe." });
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({ title: "Error", description: "Failed to submit report. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-red-900/90 to-pink-900/90 backdrop-blur-md rounded-xl p-6 w-full max-w-md border border-red-500/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Flag className="h-5 w-5 text-red-400" />
            <h2 className="text-xl font-bold text-white">Report Post</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Selection */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-3">
              Why are you reporting this post?
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {reportReasons.map((reportReason) => (
                <label key={reportReason} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={reportReason}
                    checked={reason === reportReason}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-red-500 focus:ring-red-500 focus:ring-2"
                  />
                  <span className="text-white/90">{reportReason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Reason */}
          {reason === 'Other' && (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Please specify
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Describe the issue..."
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
