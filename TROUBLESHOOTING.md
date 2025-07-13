# RoastBlame - Troubleshooting Guide

## Common Issues and Solutions

### Firebase Connection Issues

#### Problem: "Firebase configuration not found" or connection errors

**Symptoms:**
- App fails to load with Firebase errors in console
- Authentication not working
- Database operations failing

**Solutions:**

1. **Check Environment Variables:**
   ```javascript
   // Verify these are set in Lovable Platform:
   __firebase_config = {
     "apiKey": "your-api-key",
     "authDomain": "your-project.firebaseapp.com",
     "projectId": "your-project-id",
     // ... other config
   }
   __app_id = "your-app-id"
   ```

2. **Verify Firebase Project Setup:**
   - Go to Firebase Console
   - Check if Authentication, Firestore, and Storage are enabled
   - Verify domain is added to authorized domains

3. **Check Security Rules:**
   ```javascript
   // Firestore rules should allow authenticated users
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

#### Problem: "Permission denied" errors

**Solutions:**
1. Update Firestore Security Rules (see above)
2. Ensure user is properly authenticated
3. Check Firebase project permissions

### Authentication Issues

#### Problem: Users can't log in or sign up

**Symptoms:**
- "User not found" errors
- "Invalid email/password" errors
- Sign up process not working

**Solutions:**

1. **Check Firebase Auth Configuration:**
   - Verify Email/Password provider is enabled
   - Check if Anonymous authentication is enabled (if using)

2. **Debug Authentication Flow:**
   ```javascript
   // Add to AuthModal.tsx for debugging
   console.log('Auth attempt:', { email, password });
   console.log('Firebase auth state:', user);
   ```

3. **Clear Browser Data:**
   - Clear localStorage and sessionStorage
   - Clear cookies for the domain
   - Try incognito/private browsing mode

#### Problem: Anonymous users not working

**Solutions:**
1. Enable Anonymous authentication in Firebase Console
2. Check useAuth hook implementation
3. Verify anonymous user creation logic

### UI Rendering Issues

#### Problem: Styles not loading or components look broken

**Symptoms:**
- Missing styles
- Layout appears broken
- Tailwind classes not working

**Solutions:**

1. **Check Tailwind CSS Build:**
   ```bash
   # Rebuild CSS
   npm run build
   # or
   npm run dev
   ```

2. **Verify Tailwind Configuration:**
   ```javascript
   // tailwind.config.ts should include all content paths
   content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
   ],
   ```

3. **Browser Cache Issues:**
   - Hard refresh (Ctrl+F5)
   - Clear browser cache
   - Disable browser cache in DevTools

#### Problem: Components not rendering or showing errors

**Solutions:**
1. **Check Browser Console for Errors:**
   - Look for JavaScript errors
   - Check for missing imports
   - Verify component syntax

2. **Common React Errors:**
   ```javascript
   // Missing key props in lists
   {posts.map(post => (
     <PostCard key={post.id} post={post} /> // Add key prop
   ))}
   
   // Conditional rendering issues
   {user && <PostForm />} // Ensure proper conditional rendering
   ```

### Performance Issues

#### Problem: App loading slowly or freezing

**Symptoms:**
- Long loading times
- UI becomes unresponsive
- High memory usage

**Solutions:**

1. **Check Network Tab:**
   - Look for slow API calls
   - Check for large file downloads
   - Verify Firebase connection speed

2. **Optimize Components:**
   ```javascript
   // Use React.memo for expensive components
   const PostCard = React.memo(({ post }) => {
     // Component logic
   });
   
   // Use useCallback for functions
   const handleClick = useCallback(() => {
     // Handler logic
   }, [dependencies]);
   ```

3. **Database Query Optimization:**
   ```javascript
   // Limit query results
   const postsQuery = query(
     collection(db, 'posts'),
     orderBy('createdAt', 'desc'),
     limit(20) // Add limit
   );
   ```

#### Problem: Images or videos not loading

**Solutions:**
1. **Check File Sizes:**
   - Images should be under 5MB
   - Videos should be under 10MB

2. **Verify Firebase Storage Rules:**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

3. **Check File Formats:**
   - Supported image formats: JPG, PNG, GIF
   - Supported video formats: MP4, MOV

### Admin Panel Issues

#### Problem: Admin features not working

**Solutions:**
1. **Verify Admin Permissions:**
   ```javascript
   // Check user document in Firestore
   {
     uid: "admin-user-id",
     email: "admin@roastblame.com",
     isAdmin: true, // This field must be present
     isModerator: true // Optional
   }
   ```

2. **Check Admin Routes:**
   - Verify `/admin` route is accessible
   - Check if admin authentication is working

3. **Debug Admin Actions:**
   ```javascript
   // Add logging to admin functions
   console.log('Admin action:', { action, userId, reason });
   ```

### Build and Deployment Issues

#### Problem: Build fails with TypeScript errors

**Common TypeScript Errors:**

1. **Type Mismatches:**
   ```typescript
   // Fix type errors
   interface Post {
     id: string;
     content: string;
     // Ensure all properties are properly typed
   }
   ```

2. **Missing Imports:**
   ```typescript
   // Ensure all imports are present and correct
   import { Post } from '@/types/post';
   import { useAuth } from '@/hooks/useAuth';
   ```

3. **Async/Await Issues:**
   ```typescript
   // Properly handle async operations
   const handleSubmit = async () => {
     try {
       await createPost(postData);
     } catch (error) {
       console.error('Error creating post:', error);
     }
   };
   ```

#### Problem: Deployment fails

**Solutions:**
1. **Check Build Process:**
   ```bash
   # Test build locally
   npm run build
   
   # Check for build errors
   npm run type-check
   ```

2. **Verify Dependencies:**
   ```bash
   # Install all dependencies
   npm install
   
   # Check for dependency conflicts
   npm audit
   ```

3. **Environment Variables:**
   - Ensure all required environment variables are set
   - Check Firebase configuration in production

### Data Issues

#### Problem: Posts not saving or loading

**Solutions:**
1. **Check Firestore Connection:**
   ```javascript
   // Test Firestore connection
   import { db } from '@/lib/firebase-config';
   import { collection, getDocs } from 'firebase/firestore';
   
   const testConnection = async () => {
     try {
       const snapshot = await getDocs(collection(db, 'posts'));
       console.log('Connection successful:', snapshot.size);
     } catch (error) {
       console.error('Connection failed:', error);
     }
   };
   ```

2. **Verify Data Structure:**
   ```javascript
   // Ensure proper data structure
   const postData = {
     id: 'unique-id',
     content: 'Post content',
     celebrityName: 'Celebrity Name',
     authorId: 'user-id',
     createdAt: new Date(),
     reactions: { likes: 0, dislikes: 0, funny: 0 }
   };
   ```

3. **Check Security Rules:**
   - Verify users can read/write posts
   - Check admin permissions for management operations

#### Problem: User data not persisting

**Solutions:**
1. **Check User Document Creation:**
   ```javascript
   // Ensure user document is created on signup
   const createUserDocument = async (user) => {
     const userRef = doc(db, 'users', user.uid);
     await setDoc(userRef, {
       email: user.email,
       createdAt: new Date(),
       isAdmin: false
     });
   };
   ```

2. **Verify localStorage Usage:**
   ```javascript
   // Check if data is being saved locally
   console.log('Saved posts:', localStorage.getItem('roastblame_posts'));
   ```

### Mobile and Responsive Issues

#### Problem: App not working properly on mobile

**Solutions:**
1. **Check Responsive Design:**
   ```css
   /* Ensure proper mobile styles */
   @media (max-width: 768px) {
     .container {
       padding: 1rem;
     }
   }
   ```

2. **Touch Events:**
   ```javascript
   // Ensure touch events work properly
   const handleTouchStart = (e) => {
     // Handle touch interactions
   };
   ```

3. **Viewport Configuration:**
   ```html
   <!-- Ensure proper viewport meta tag -->
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

## Debugging Tools and Techniques

### Browser Developer Tools

1. **Console Logging:**
   ```javascript
   // Add strategic console logs
   console.log('Component rendered:', { props, state });
   console.error('Error occurred:', error);
   console.warn('Warning:', warning);
   ```

2. **Network Tab:**
   - Monitor API calls
   - Check response times
   - Verify request/response data

3. **React Developer Tools:**
   - Install React DevTools extension
   - Monitor component state and props
   - Profile component performance

### Firebase Debugging

1. **Firebase Console:**
   - Check Authentication users
   - Verify Firestore data
   - Monitor Storage usage

2. **Firebase Emulator:**
   ```bash
   # Run local Firebase emulators
   firebase emulators:start
   ```

3. **Firebase Debug Mode:**
   ```javascript
   // Enable Firebase debug logging
   import { connectFirestoreEmulator } from 'firebase/firestore';
   
   if (process.env.NODE_ENV === 'development') {
     // Connect to emulator for debugging
   }
   ```

### Performance Monitoring

1. **React Profiler:**
   ```javascript
   import { Profiler } from 'react';
   
   const onRenderCallback = (id, phase, actualDuration) => {
     console.log('Component render:', { id, phase, actualDuration });
   };
   
   <Profiler id="PostFeed" onRender={onRenderCallback}>
     <PostFeed />
   </Profiler>
   ```

2. **Web Vitals:**
   ```javascript
   // Monitor Core Web Vitals
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
   
   getCLS(console.log);
   getFID(console.log);
   getFCP(console.log);
   getLCP(console.log);
   getTTFB(console.log);
   ```

## Getting Help

### Before Seeking Support

1. **Check Browser Console:**
   - Look for error messages
   - Note the exact error text
   - Check the line number and file

2. **Try Basic Troubleshooting:**
   - Clear browser cache
   - Try incognito/private mode
   - Test on different browsers
   - Check internet connection

3. **Gather Information:**
   - Browser version and type
   - Operating system
   - Steps to reproduce the issue
   - Screenshots or screen recordings

### Support Channels

1. **Documentation:**
   - Review INSTALLATION.md
   - Check USER_GUIDE.md
   - Review this troubleshooting guide

2. **Firebase Support:**
   - Firebase Console Help Center
   - Firebase Documentation
   - Stack Overflow (firebase tag)

3. **React/Web Development:**
   - React Documentation
   - Stack Overflow
   - MDN Web Docs

### Reporting Bugs

When reporting bugs, please include:

1. **Environment Information:**
   - Browser and version
   - Operating system
   - Screen resolution (for UI issues)

2. **Steps to Reproduce:**
   - Detailed step-by-step instructions
   - Expected behavior
   - Actual behavior

3. **Error Information:**
   - Console error messages
   - Network tab information
   - Screenshots or videos

4. **Code Context:**
   - Relevant code snippets
   - Configuration files
   - Any modifications made

Remember: Most issues can be resolved by checking the browser console for error messages and following the solutions in this guide. Always test in a clean browser environment before reporting bugs.
