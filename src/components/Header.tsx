
import { useState } from 'react';
import { LogOut, Settings, Crown, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onAuthClick: () => void;
  onAdminClick: () => void;
}

export const Header = ({ onAuthClick, onAdminClick }: HeaderProps) => {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDisplayName = () => {
    if (!user) return '';
    if (user.isAnonymous) {
      return `Anonymous User #${user.uid.slice(-4).toUpperCase()}`;
    }
    return user.email || 'User';
  };

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              RoastBlame
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white/80 text-sm">
                  Welcome, {getDisplayName()}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => window.location.href = '/admin'}
                    className="flex items-center space-x-2 bg-yellow-500/20 text-yellow-400 px-3 py-2 rounded-lg hover:bg-yellow-500/30 transition-colors"
                  >
                    <Crown className="h-4 w-4" />
                    <span>Admin</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onAuthClick}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Login / Sign Up
                </button>
                <button
                  onClick={onAdminClick}
                  className="flex items-center space-x-2 text-white/60 hover:text-white/80 transition-colors text-sm"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/40 backdrop-blur-md border-t border-white/10 py-4">
            {user ? (
              <div className="space-y-3">
                <div className="text-white/80 text-sm px-4">
                  Welcome, {getDisplayName()}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => {
                      window.location.href = '/admin';
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500/30 transition-colors w-full"
                  >
                    <Crown className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors w-full px-4 py-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onAuthClick();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 w-full"
                >
                  Login / Sign Up
                </button>
                <button
                  onClick={() => {
                    onAdminClick();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-white/60 hover:text-white/80 transition-colors px-4 py-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin Login</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
