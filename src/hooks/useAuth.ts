
import { useState, useEffect, createContext, useContext } from 'react';

// Mock user type for demonstration
interface User {
  uid: string;
  email?: string;
  isAnonymous: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginAsAdmin: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock authentication hook for demo purposes
export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuthState = () => {
      const savedUser = localStorage.getItem('roastblame_user');
      const savedAdmin = localStorage.getItem('roastblame_admin');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      if (savedAdmin) {
        setIsAdmin(true);
      }
      
      setLoading(false);
    };

    setTimeout(checkAuthState, 1000); // Simulate loading delay
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email === 'test@example.com' && password === 'password123') {
      const mockUser: User = {
        uid: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        isAnonymous: false
      };
      
      setUser(mockUser);
      localStorage.setItem('roastblame_user', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid email or password');
    }
    
    setLoading(false);
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      uid: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      isAnonymous: false
    };
    
    setUser(mockUser);
    localStorage.setItem('roastblame_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const loginAnonymously = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser: User = {
      uid: 'anon_' + Math.random().toString(36).substr(2, 9),
      isAnonymous: true
    };
    
    setUser(mockUser);
    localStorage.setItem('roastblame_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('roastblame_user');
    localStorage.removeItem('roastblame_admin');
  };

  const resetPassword = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app, this would send a password reset email
  };

  const loginAsAdmin = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock admin credentials
    const adminCredentials = [
      { email: 'admin@roastblame.com', password: 'admin123' },
      { email: 'moderator@roastblame.com', password: 'mod123' }
    ];
    
    const validAdmin = adminCredentials.find(admin => 
      admin.email === email && admin.password === password
    );
    
    if (validAdmin) {
      const adminUser: User = {
        uid: 'admin_' + Math.random().toString(36).substr(2, 9),
        email,
        isAnonymous: false
      };
      
      setUser(adminUser);
      setIsAdmin(true);
      localStorage.setItem('roastblame_user', JSON.stringify(adminUser));
      localStorage.setItem('roastblame_admin', 'true');
    } else {
      throw new Error('Invalid admin credentials');
    }
    
    setLoading(false);
  };

  return {
    user,
    loading,
    isAdmin,
    login,
    register,
    loginAnonymously,
    logout,
    resetPassword,
    loginAsAdmin
  };
};

// For the demo, we'll export the hook directly
export { useAuthProvider as useAuth };
