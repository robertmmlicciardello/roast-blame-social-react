
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Default configuration for development/demo
const defaultConfig: FirebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "roastblame-demo.firebaseapp.com",
  projectId: "roastblame-demo",
  storageBucket: "roastblame-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:demo123456789"
};

// Get Firebase configuration from environment variables or use defaults
const getFirebaseConfig = (): FirebaseConfig => {
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  // Check if all required environment variables are present
  const hasAllEnvVars = Object.values(envConfig).every(value => value && value.trim() !== '');
  
  if (hasAllEnvVars) {
    console.log('Using Firebase configuration from environment variables');
    return envConfig as FirebaseConfig;
  } else {
    console.log('Using default Firebase configuration for development');
    return defaultConfig;
  }
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  const config = getFirebaseConfig();
  
  // Initialize Firebase app if it hasn't been initialized yet
  if (!getApps().length) {
    app = initializeApp(config);
  } else {
    app = getApps()[0];
  }
  
  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Create mock services for development
  auth = null as any;
  db = null as any;
  storage = null as any;
}

// Export Firebase services
export { auth, db, storage };
export default app;

// Utility function to check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  return !!(auth && db && storage);
};

// Mock data enabler
export const useMockData = (): boolean => {
  return import.meta.env.VITE_USE_MOCK_DATA === 'true' || !isFirebaseConfigured();
};
