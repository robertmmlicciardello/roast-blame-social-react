# RoastBlame - Deployment Guide

## Overview

This guide covers various deployment options for the RoastBlame platform, from development setup to production deployment with CI/CD pipelines.

## Prerequisites

Before deploying RoastBlame, ensure you have:

- Node.js (v16 or higher) installed
- npm or yarn package manager
- Firebase CLI installed globally
- Git for version control
- A Firebase project set up

## Development Deployment

### Local Development Setup

1. **Clone and Setup Project:**
   ```bash
   git clone <your-repo-url>
   cd roastblame
   npm install
   ```

2. **Environment Configuration:**
   Configure your Firebase settings in Lovable Platform:
   ```javascript
   __firebase_config = {
     "apiKey": "your-development-api-key",
     "authDomain": "roastblame-dev.firebaseapp.com",
     "projectId": "roastblame-dev",
     "storageBucket": "roastblame-dev.appspot.com",
     "messagingSenderId": "123456789",
     "appId": "1:123456789:web:abcdef123456"
   }
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Firebase Emulator Setup (Optional)

For local development with Firebase emulators:

1. **Initialize Firebase Emulators:**
   ```bash
   firebase init emulators
   ```

2. **Select Services:**
   - Authentication
   - Firestore
   - Storage
   - Functions (if using)

3. **Start Emulators:**
   ```bash
   firebase emulators:start
   ```

4. **Configure App for Emulators:**
   ```javascript
   // In src/lib/firebase-config.ts
   if (process.env.NODE_ENV === 'development') {
     connectAuthEmulator(auth, 'http://localhost:9099');
     connectFirestoreEmulator(db, 'localhost', 8080);
     connectStorageEmulator(storage, 'localhost', 9199);
   }
   ```

## Staging Deployment

### Firebase Hosting (Staging)

1. **Create Staging Firebase Project:**
   - Go to Firebase Console
   - Create new project: `roastblame-staging`
   - Enable required services

2. **Configure Firebase for Staging:**
   ```bash
   firebase use --add
   # Select staging project and give it an alias
   firebase use staging
   ```

3. **Build and Deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

4. **Environment Variables for Staging:**
   ```javascript
   __firebase_config = {
     "apiKey": "staging-api-key",
     "authDomain": "roastblame-staging.firebaseapp.com",
     "projectId": "roastblame-staging",
     // ... staging config
   }
   ```

## Production Deployment

### Firebase Hosting (Production)

1. **Create Production Firebase Project:**
   ```bash
   # Create production project in Firebase Console
   firebase use --add
   firebase use production
   ```

2. **Production Environment Variables:**
   ```javascript
   __firebase_config = {
     "apiKey": "production-api-key",
     "authDomain": "roastblame.com", // Custom domain
     "projectId": "roastblame-prod",
     "storageBucket": "roastblame-prod.appspot.com",
     "messagingSenderId": "987654321",
     "appId": "1:987654321:web:production123456"
   }
   ```

3. **Production Build:**
   ```bash
   # Install dependencies
   npm ci --production

   # Build application
   npm run build

   # Deploy to Firebase
   firebase deploy
   ```

### Custom Domain Setup

1. **Configure Custom Domain:**
   ```bash
   firebase hosting:channel:deploy production --expires 30d
   ```

2. **Add Domain in Firebase Console:**
   - Go to Hosting section
   - Click "Add custom domain"
   - Follow DNS configuration instructions

3. **Update Firebase Configuration:**
   ```javascript
   __firebase_config = {
     // ... other config
     "authDomain": "roastblame.com", // Your custom domain
   }
   ```

### Alternative Deployment Options

#### Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Environment Variables in Vercel:**
   ```bash
   vercel env add VITE_FIREBASE_CONFIG
   # Paste your Firebase config JSON
   ```

#### Netlify Deployment

1. **Build Settings:**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Environment Variables:**
   Set in Netlify dashboard under Site settings > Environment variables

#### AWS S3 + CloudFront

1. **Build Application:**
   ```bash
   npm run build
   ```

2. **S3 Bucket Setup:**
   ```bash
   aws s3 mb s3://roastblame-prod
   aws s3 sync dist/ s3://roastblame-prod --delete
   ```

3. **CloudFront Distribution:**
   ```json
   {
     "Origins": [{
       "DomainName": "roastblame-prod.s3.amazonaws.com",
       "Id": "S3-roastblame-prod"
     }],
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-roastblame-prod"
     }
   }
   ```

## CI/CD Pipeline Setup

### GitHub Actions

1. **Create Workflow File:**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to Firebase

   on:
     push:
       branches: [ main, develop ]
     pull_request:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       
       steps:
       - name: Checkout code
         uses: actions/checkout@v3

       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           cache: 'npm'

       - name: Install dependencies
         run: npm ci

       - name: Run tests
         run: npm run test:ci

       - name: Build application
         run: npm run build
         env:
           VITE_FIREBASE_CONFIG: ${{ secrets.FIREBASE_CONFIG }}

       - name: Deploy to Firebase (Staging)
         if: github.ref == 'refs/heads/develop'
         uses: FirebaseExtended/action-hosting-deploy@v0
         with:
           repoToken: ${{ secrets.GITHUB_TOKEN }}
           firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_STAGING }}
           projectId: roastblame-staging

       - name: Deploy to Firebase (Production)
         if: github.ref == 'refs/heads/main'
         uses: FirebaseExtended/action-hosting-deploy@v0
         with:
           repoToken: ${{ secrets.GITHUB_TOKEN }}
           firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_PROD }}
           projectId: roastblame-prod
   ```

2. **Required Secrets:**
   Add these secrets in GitHub repository settings:
   - `FIREBASE_CONFIG`: Your Firebase configuration JSON
   - `FIREBASE_SERVICE_ACCOUNT_STAGING`: Service account for staging
   - `FIREBASE_SERVICE_ACCOUNT_PROD`: Service account for production

3. **Service Account Setup:**
   ```bash
   # Generate service account key
   firebase service-accounts:create firebase-adminsdk
   
   # Download the service account key
   firebase service-accounts:generate-key firebase-adminsdk
   ```

### GitLab CI/CD

1. **Create Pipeline Configuration:**
   ```yaml
   # .gitlab-ci.yml
   stages:
     - test
     - build
     - deploy

   variables:
     NODE_VERSION: "18"

   cache:
     paths:
       - node_modules/

   test:
     stage: test
     image: node:$NODE_VERSION
     script:
       - npm ci
       - npm run test:ci
       - npm run lint

   build:
     stage: build
     image: node:$NODE_VERSION
     script:
       - npm ci
       - npm run build
     artifacts:
       paths:
         - dist/
       expire_in: 1 hour

   deploy_staging:
     stage: deploy
     image: node:$NODE_VERSION
     script:
       - npm install -g firebase-tools
       - firebase use staging
       - firebase deploy --only hosting
     environment:
       name: staging
       url: https://roastblame-staging.web.app
     only:
       - develop

   deploy_production:
     stage: deploy
     image: node:$NODE_VERSION
     script:
       - npm install -g firebase-tools
       - firebase use production
       - firebase deploy --only hosting
     environment:
       name: production
       url: https://roastblame.com
     only:
       - main
     when: manual
   ```

2. **Environment Variables:**
   Set in GitLab project settings > CI/CD > Variables:
   - `FIREBASE_TOKEN`: Firebase CI token
   - `VITE_FIREBASE_CONFIG`: Firebase configuration

### Docker Deployment

1. **Create Dockerfile:**
   ```dockerfile
   # Build stage
   FROM node:18-alpine AS builder

   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .
   RUN npm run build

   # Production stage
   FROM nginx:alpine

   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf

   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Nginx Configuration:**
   ```nginx
   # nginx.conf
   server {
       listen 80;
       server_name localhost;
       root /usr/share/nginx/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /static/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. **Build and Deploy:**
   ```bash
   # Build Docker image
   docker build -t roastblame:latest .

   # Run container
   docker run -p 80:80 roastblame:latest

   # Deploy to registry
   docker tag roastblame:latest your-registry/roastblame:latest
   docker push your-registry/roastblame:latest
   ```

## Performance Optimization

### Build Optimization

1. **Vite Configuration:**
   ```javascript
   // vite.config.ts
   export default {
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
           }
         }
       },
       chunkSizeWarningLimit: 1000
     }
   }
   ```

2. **Code Splitting:**
   ```javascript
   // Lazy load admin components
   const AdminPanel = lazy(() => import('./pages/Admin'));
   
   // Use Suspense for loading states
   <Suspense fallback={<div>Loading...</div>}>
     <AdminPanel />
   </Suspense>
   ```

### CDN Configuration

1. **Firebase Hosting CDN:**
   ```json
   // firebase.json
   {
     "hosting": {
       "headers": [
         {
           "source": "**/*.@(js|css)",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "max-age=31536000"
             }
           ]
         },
         {
           "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "max-age=31536000"
             }
           ]
         }
       ]
     }
   }
   ```

## Monitoring and Analytics

### Firebase Analytics

1. **Enable Analytics:**
   ```javascript
   // src/lib/firebase-config.ts
   import { getAnalytics } from 'firebase/analytics';
   
   const analytics = getAnalytics(app);
   ```

2. **Custom Events:**
   ```javascript
   import { logEvent } from 'firebase/analytics';
   
   // Track user actions
   logEvent(analytics, 'post_created', {
     celebrity_name: celebrityName,
     post_length: content.length
   });
   ```

### Error Monitoring

1. **Sentry Integration:**
   ```bash
   npm install @sentry/react
   ```

   ```javascript
   // src/main.tsx
   import * as Sentry from '@sentry/react';
   
   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: process.env.NODE_ENV,
   });
   ```

### Performance Monitoring

1. **Web Vitals:**
   ```javascript
   // src/utils/performance.ts
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
   
   export const initPerformanceMonitoring = () => {
     getCLS(console.log);
     getFID(console.log);
     getFCP(console.log);
     getLCP(console.log);
     getTTFB(console.log);
   };
   ```

## Security Considerations

### Environment Variables Security

1. **Never commit sensitive data:**
   ```bash
   # .gitignore
   .env
   .env.local
   .env.production
   firebase-adminsdk-*.json
   ```

2. **Use secure environment variables:**
   - Store in CI/CD platform secrets
   - Use Firebase Functions config for server-side secrets
   - Validate and sanitize all inputs

### Firebase Security Rules

1. **Production Firestore Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only access their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Posts are publicly readable, but only creators can modify
       match /posts/{postId} {
         allow read: if true;
         allow create: if request.auth != null;
         allow update, delete: if request.auth != null && 
           request.auth.uid == resource.data.authorId;
       }
       
       // Admin-only collections
       match /admin/{document=**} {
         allow read, write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
       }
     }
   }
   ```

2. **Storage Security Rules:**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /posts/{userId}/{fileName} {
         allow read: if true;
         allow write: if request.auth != null && 
           request.auth.uid == userId &&
           request.resource.size < 10 * 1024 * 1024;
       }
     }
   }
   ```

## Rollback Procedures

### Firebase Hosting Rollback

1. **List Previous Releases:**
   ```bash
   firebase hosting:releases:list
   ```

2. **Rollback to Previous Version:**
   ```bash
   firebase hosting:rollback
   ```

### Database Backup

1. **Firestore Export:**
   ```bash
   gcloud firestore export gs://your-bucket/backups/$(date +%Y%m%d-%H%M%S)
   ```

2. **Automated Backup:**
   ```javascript
   // Cloud Function for automated backups
   export const scheduleBackup = functions.pubsub
     .schedule('0 2 * * *') // Daily at 2 AM
     .onRun(async () => {
       const projectId = process.env.GCLOUD_PROJECT;
       const client = new FirestoreAdminClient();
       
       await client.exportDocuments({
         name: client.databasePath(projectId, '(default)'),
         outputUriPrefix: `gs://${projectId}-backups/${new Date().toISOString()}`,
         collectionIds: []
       });
     });
   ```

This deployment guide provides comprehensive coverage of various deployment scenarios and best practices for the RoastBlame platform. Choose the deployment method that best fits your infrastructure requirements and team capabilities.
