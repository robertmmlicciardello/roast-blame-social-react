
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PostForm } from '@/components/PostForm';
import { PostFeed } from '@/components/PostFeed';
import { AuthModal } from '@/components/auth/AuthModal';
import { AdminLoginModal } from '@/components/admin/AdminLoginModal';
import { useAuth } from '@/hooks/useAuth';
import { AdPlaceholder } from '@/components/AdPlaceholder';

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900">
      <Header 
        onAuthClick={() => setShowAuthModal(true)}
        onAdminClick={() => setShowAdminLogin(true)}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center text-white mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              RoastBlame
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              The ultimate platform for celebrity roasts and humorous takes. Share, react, and have fun responsibly!
            </p>
          </div>

          {/* Post Form Section */}
          {user ? (
            <PostForm />
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center text-white border border-white/20">
              <h3 className="text-2xl font-semibold mb-4">Ready to roast?</h3>
              <p className="text-purple-200 mb-6">Please log in to start posting your celebrity roasts!</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Login / Sign Up
              </button>
            </div>
          )}

          {/* Ad Placeholder */}
          <AdPlaceholder />

          {/* Posts Feed */}
          <PostFeed />
        </div>
      </main>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      
      {showAdminLogin && (
        <AdminLoginModal onClose={() => setShowAdminLogin(false)} />
      )}
    </div>
  );
};

export default Index;
