
import { ExternalLink, Zap } from 'lucide-react';

export const AdPlaceholder = () => {
  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 text-center">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Zap className="h-6 w-6 text-yellow-400" />
        <h3 className="text-xl font-semibold text-white">Sponsored Content</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="text-lg font-medium text-white mb-2">Advertisement Space</h4>
          <p className="text-gray-300 text-sm mb-3">
            Your brand could be here! Reach engaged users who love entertainment content.
          </p>
          <div className="flex items-center justify-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer">
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm font-medium">Learn More</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-400">
          Premium users enjoy an ad-free experience
        </div>
      </div>
    </div>
  );
};
