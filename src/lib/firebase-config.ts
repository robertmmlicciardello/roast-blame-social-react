
// Firebase Configuration Helper
// This file helps manage Firebase configuration in Lovable environment

/**
 * Firebase Configuration Guide for Lovable Platform
 * 
 * To set up Firebase in Lovable, you need to configure these environment variables:
 * 
 * 1. __app_id: Your Firebase App ID
 * 2. __firebase_config: Complete Firebase configuration object as JSON string
 * 3. __initial_auth_token: (Optional) Initial authentication token
 * 
 * Example configuration in Lovable:
 * __firebase_config = {
 *   "apiKey": "your-api-key",
 *   "authDomain": "your-project.firebaseapp.com",
 *   "projectId": "your-project-id",
 *   "storageBucket": "your-project.appspot.com",
 *   "messagingSenderId": "123456789",
 *   "appId": "1:123456789:web:abcdef123456"
 * }
 */

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Mock configuration for development
const mockFirebaseConfig: FirebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "roastblame-demo.firebaseapp.com",
  projectId: "roastblame-demo",
  storageBucket: "roastblame-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:mock-app-id"
};

/**
 * Gets Firebase configuration from environment variables or returns mock config
 */
export const getFirebaseConfig = (): FirebaseConfig => {
  try {
    // In Lovable, environment variables are available via import.meta.env
    const configString = import.meta.env.VITE_FIREBASE_CONFIG || 
                        (window as any).__firebase_config;
    
    if (configString) {
      const config = typeof configString === 'string' 
        ? JSON.parse(configString) 
        : configString;
      
      return config as FirebaseConfig;
    }
  } catch (error) {
    console.warn('Failed to parse Firebase config, using mock config:', error);
  }
  
  // Return mock config for development/demo
  return mockFirebaseConfig;
};

/**
 * Validates Firebase configuration
 */
export const validateFirebaseConfig = (config: FirebaseConfig): boolean => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  
  return requiredFields.every(field => {
    const hasField = Boolean(config[field as keyof FirebaseConfig]);
    if (!hasField) {
      console.warn(`Missing required Firebase config field: ${field}`);
    }
    return hasField;
  });
};

/**
 * Gets the app ID from environment or config
 */
export const getAppId = (): string => {
  return import.meta.env.VITE_APP_ID || 
         (window as any).__app_id || 
         'roastblame-demo';
};

/**
 * Checks if we're running in production environment
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD || process.env.NODE_ENV === 'production';
};

/**
 * Firestore Security Rules Reference
 * 
 * Copy these rules to your Firebase Console -> Firestore Database -> Rules:
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Users can read/write their own user document
 *     match /users/{userId} {
 *       allow read, write: if request.auth != null && request.auth.uid == userId;
 *     }
 *     
 *     // Posts are readable by all authenticated users
 *     match /posts/{postId} {
 *       allow read: if request.auth != null;
 *       allow create: if request.auth != null && 
 *         request.auth.uid == resource.data.authorId;
 *       allow update, delete: if request.auth != null && 
 *         (request.auth.uid == resource.data.authorId || 
 *          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
 *     }
 *     
 *     // Reports can be created by authenticated users, managed by admins
 *     match /reports/{reportId} {
 *       allow read: if request.auth != null && 
 *         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
 *       allow create: if request.auth != null;
 *       allow update: if request.auth != null && 
 *         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
 *     }
 *     
 *     // Site settings only accessible by admins
 *     match /settings/{settingId} {
 *       allow read, write: if request.auth != null && 
 *         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
 *     }
 *     
 *     // Admin logs only accessible by admins
 *     match /admin-logs/{logId} {
 *       allow read, write: if request.auth != null && 
 *         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
 *     }
 *   }
 * }
 */

/**
 * Firebase Storage Security Rules Reference
 * 
 * Copy these rules to your Firebase Console -> Storage -> Rules:
 * 
 * rules_version = '2';
 * service firebase.storage {
 *   match /b/{bucket}/o {
 *     // Users can upload images/videos for their posts
 *     match /posts/{userId}/{fileName} {
 *       allow read: if true; // Posts are public
 *       allow write: if request.auth != null && 
 *         request.auth.uid == userId &&
 *         request.resource.size < 10 * 1024 * 1024 && // 10MB limit
 *         request.resource.contentType.matches('image/.*|video/.*');
 *     }
 *     
 *     // Site assets (logos, etc.) only writable by admins
 *     match /site/{fileName} {
 *       allow read: if true;
 *       allow write: if request.auth != null && 
 *         firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin == true;
 *     }
 *   }
 * }
 */
