
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md w-full text-center border border-white/20">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-red-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Oops! Something went wrong
        </h2>
        
        <p className="text-purple-200 mb-6">
          We encountered an unexpected error. Don't worry, this happens sometimes in development!
        </p>
        
        <details className="mb-6 text-left">
          <summary className="text-sm text-purple-300 cursor-pointer hover:text-purple-200">
            Show error details
          </summary>
          <pre className="text-xs text-red-300 mt-2 p-3 bg-black/20 rounded overflow-auto max-h-32">
            {error.message}
          </pre>
        </details>
        
        <div className="space-y-3">
          <Button 
            onClick={resetErrorBoundary}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
          >
            Reload Page
          </Button>
        </div>
        
        <p className="text-xs text-purple-300 mt-4">
          If this error persists, check the browser console for more details.
        </p>
      </div>
    </div>
  );
};
