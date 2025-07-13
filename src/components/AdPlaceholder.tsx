
import { Star, Zap } from 'lucide-react';

export const AdPlaceholder = () => {
  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 my-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3">
            <Star className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Go Premium!</h3>
        <p className="text-white/80 mb-4">
          Enjoy ad-free browsing, exclusive reactions, and premium features
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-4 text-sm">
          <span className="bg-white/20 text-white px-3 py-1 rounded-full">Ad-free</span>
          <span className="bg-white/20 text-white px-3 py-1 rounded-full">Exclusive Emojis</span>
          <span className="bg-white/20 text-white px-3 py-1 rounded-full">Larger Uploads</span>
          <span className="bg-white/20 text-white px-3 py-1 rounded-full">Premium Badge</span>
        </div>
        
        <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Get Premium</span>
        </button>
        
        <p className="text-white/60 text-xs mt-2">Starting at $4.99/month</p>
      </div>
    </div>
  );
};
