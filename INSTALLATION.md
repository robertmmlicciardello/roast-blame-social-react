
# RoastBlame - Installation & Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 16.0 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
- **npm** (comes with Node.js) or **yarn**
  - Verify npm: `npm --version`
  - Or install yarn: `npm install -g yarn`
- **Git** (for version control)
  - Download from: https://git-scm.com/

## Local Development Setup

### 1. Project Installation

```bash
# Clone or extract the project
cd roastblame-project

# Install dependencies
npm install
# or if using yarn
yarn install
```

### 2. Environment Setup

The application works out of the box with mock data, but for full functionality, you'll need to configure Firebase.

#### Option A: Run with Mock Data (Quick Start)
The app includes comprehensive mock data and will work immediately:

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:5173 in your browser.

#### Option B: Firebase Configuration (Production Setup)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Create a project"
   - Follow the setup wizard

2. **Enable Required Services**
   - **Authentication**: Email/Password + Anonymous
   - **Firestore Database**: Start in test mode
   - **Storage**: Start in test mode

3. **Get Firebase Configuration**
   - Project Settings → General → Your apps
   - Click "Config" for Web app configuration
   - Copy the configuration object

4. **Configure in Lovable Platform**
   
   In Lovable, set these environment variables:
   
   ```javascript
   // Set __firebase_config to your complete Firebase config:
   __firebase_config = {
     "apiKey": "your-api-key-here",
     "authDomain": "your-project.firebaseapp.com",
     "projectId": "your-project-id",
     "storageBucket": "your-project.appspot.com",
     "messagingSenderId": "123456789012",
     "appId": "1:123456789012:web:abcdef123456789"
   }
   
   // Set your app identifier:
   __app_id = "your-unique-app-id"
   
   // Optional: Set initial auth token if needed:
   __initial_auth_token = "your-token-here"
   ```

5. **Firebase Security Rules**

   **Firestore Rules** (Firebase Console → Firestore → Rules):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own user document
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Posts are readable by all authenticated users
       match /posts/{postId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null && 
           request.auth.uid == resource.data.authorId;
         allow update, delete: if request.auth != null && 
           (request.auth.uid == resource.data.authorId || 
            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
       }
       
       // Reports manageable by admins
       match /reports/{reportId} {
         allow read: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
         allow create: if request.auth != null;
         allow update: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
       }
       
       // Site settings - admin only
       match /settings/{settingId} {
         allow read, write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
       }
     }
   }
   ```

   **Storage Rules** (Firebase Console → Storage → Rules):
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Post media uploads
       match /posts/{userId}/{fileName} {
         allow read: if true;
         allow write: if request.auth != null && 
           request.auth.uid == userId &&
           request.resource.size < 10 * 1024 * 1024 &&
           request.resource.contentType.matches('image/.*|video/.*');
       }
       
       // Site assets - admin only
       match /site/{fileName} {
         allow read: if true;
         allow write: if request.auth != null && 
           firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin == true;
       }
     }
   }
   ```

### 3. Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests (if configured)
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## Production Deployment

### Option 1: Deploy to Lovable (Recommended)

1. Use the Publish button in Lovable interface
2. Configure custom domain in Project Settings
3. Set up environment variables in Lovable dashboard

### Option 2: Manual Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service:
   - Netlify: Drag and drop the `dist` folder
   - Vercel: Use Vercel CLI or GitHub integration
   - Firebase Hosting: Use `firebase deploy`
   - Any static hosting service

### Option 3: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## Admin Setup

### Creating Admin Users

1. **Register a normal user** through the app
2. **Manually update Firestore**:
   - Go to Firebase Console → Firestore
   - Find the user document in `/users/{userId}`
   - Add field: `isAdmin: true`
   - Save the changes

### Demo Admin Credentials

For testing purposes, use these credentials:
- **Admin**: admin@roastblame.com / admin123
- **Moderator**: moderator@roastblame.com / mod123

## Troubleshooting

### Common Issues

1. **Firebase connection errors**
   - Verify your Firebase configuration
   - Check if services are enabled in Firebase Console
   - Ensure security rules are properly set

2. **Build failures**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear cache: `npm start -- --reset-cache`
   - Check for TypeScript errors: `npm run type-check`

3. **Authentication issues**
   - Verify Firebase Auth configuration
   - Check browser console for detailed errors
   - Ensure correct Firebase project is selected

4. **Performance issues**
   - Enable React DevTools Profiler
   - Check for unnecessary re-renders
   - Optimize large lists with virtualization

### Getting Help

1. Check the browser console for errors
2. Review Firebase Console logs
3. Check network tab for failed requests
4. Enable React Developer Tools for debugging

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `__firebase_config` | Complete Firebase configuration object | Yes (for production) |
| `__app_id` | Unique application identifier | Optional |
| `__initial_auth_token` | Initial authentication token | Optional |
| `VITE_FIREBASE_CONFIG` | Alternative Firebase config for Vite | Optional |
| `VITE_APP_ID` | Alternative app ID for Vite | Optional |

## Project Structure

```
roastblame/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin panel components
│   │   ├── auth/           # Authentication components
│   │   └── ui/             # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   └── styles/             # Global styles
├── public/                 # Static assets
├── docs/                   # Documentation
└── package.json           # Dependencies and scripts
```

## Next Steps

1. **Customize the application** (see CUSTOMIZATION.md)
2. **Configure monitoring** and analytics
3. **Set up CI/CD pipeline** (see DEPLOYMENT.md)
4. **Review security settings**
5. **Test all functionality** with real users

## Support

For technical support:
1. Check the TROUBLESHOOTING.md file
2. Review Firebase documentation
3. Check React and Vite documentation
4. Submit bug reports with detailed information
