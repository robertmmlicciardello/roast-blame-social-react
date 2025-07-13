# RoastBlame - Customization Guide

## Overview

This guide explains how to customize various aspects of the RoastBlame platform to match your brand and requirements.

## UI/UX Customization

### Colors and Theming

The application uses Tailwind CSS with a custom color scheme. Main colors are defined in the components using gradients and can be customized:

**Primary Gradient Colors:**
- Purple: `from-purple-900 via-pink-800 to-indigo-900`
- Accent: `from-pink-500 to-purple-600`

**Customizing Colors:**
1. Open `tailwind.config.ts`
2. Modify the color palette in the `extend` section
3. Update gradient combinations throughout components

**Example Color Customization:**
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          500: '#ec4899',
          900: '#831843',
        }
      }
    }
  }
}
```

### Typography

**Font Customization:**
- Default: System fonts (sans-serif)
- To add custom fonts, update `index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
```

### Layout and Spacing

**Container Sizes:**
- Main content: `max-w-4xl` (can be changed to `max-w-6xl` for wider layout)
- Card components: Consistent padding and margins

**Responsive Breakpoints:**
- Mobile: `sm:` (640px)
- Tablet: `md:` (768px)
- Desktop: `lg:` (1024px)
- Large: `xl:` (1280px)

## Feature Configuration

### Enabling/Disabling Features

Create a feature flags system by adding a `config/features.ts` file:

```typescript
export const FEATURES = {
  ANONYMOUS_POSTING: true,
  VIDEO_UPLOADS: true,
  ADMIN_PANEL: true,
  PREMIUM_FEATURES: false,
  SOCIAL_SHARING: true,
  REPORTING_SYSTEM: true,
};
```

**Usage in Components:**
```typescript
import { FEATURES } from '@/config/features';

{FEATURES.VIDEO_UPLOADS && (
  <VideoUploadComponent />
)}
```

### Content Moderation Settings

**Automatic Content Filtering:**
Add content filtering rules in `src/utils/contentFilter.ts`:

```typescript
export const BANNED_WORDS = [
  // Add inappropriate words here
];

export const MAX_POST_LENGTH = 500;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB
```

### Rate Limiting

Configure posting limits in `src/config/rateLimits.ts`:

```typescript
export const RATE_LIMITS = {
  POSTS_PER_HOUR: 10,
  REACTIONS_PER_MINUTE: 30,
  REPORTS_PER_DAY: 5,
};
```

## Data Model Customization

### Adding New Fields to Posts

1. **Update the Post Interface** (`src/types/post.ts`):
```typescript
interface Post {
  id: string;
  content: string;
  celebrityName: string;
  // Add new fields here
  category?: string;
  tags?: string[];
  location?: string;
  // ... existing fields
}
```

2. **Update Firestore Collection Structure:**
```javascript
// In your Firebase console, posts collection structure:
{
  id: "post_123",
  content: "Post content",
  celebrityName: "Celebrity Name",
  category: "entertainment", // New field
  tags: ["funny", "trending"], // New field
  location: "Los Angeles", // New field
  // ... other fields
}
```

3. **Update Components:**
- Modify `PostForm.tsx` to include new input fields
- Update `PostCard.tsx` to display new information
- Adjust `usePosts.ts` hook to handle new fields

### Adding User Profile Fields

1. **Extend User Interface:**
```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  // Add new fields
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
  };
}
```

2. **Create Profile Management Component:**
```typescript
// src/components/UserProfile.tsx
const UserProfile = () => {
  // Profile editing logic
};
```

## API Customization

### Adding Custom Cloud Functions

1. **Initialize Firebase Functions:**
```bash
firebase init functions
```

2. **Example Function** (`functions/src/index.ts`):
```typescript
import { onCall } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

// Triggered when a new post is created
export const onPostCreated = onDocumentCreated(
  'posts/{postId}',
  async (event) => {
    // Custom logic for new posts
    const post = event.data?.data();
    
    // Example: Send notification to moderators
    // Example: Check for inappropriate content
    // Example: Update user statistics
  }
);

// Custom callable function
export const generatePostSummary = onCall(async (request) => {
  const { postContent } = request.data;
  
  // Custom logic to generate post summary
  return { summary: 'Generated summary' };
});
```

### Integrating Third-Party APIs

**Example: Social Media Sharing API**
```typescript
// src/services/socialShare.ts
export const shareToSocialMedia = async (post: Post, platform: string) => {
  switch (platform) {
    case 'twitter':
      // Twitter API integration
      break;
    case 'facebook':
      // Facebook API integration
      break;
    default:
      throw new Error('Unsupported platform');
  }
};
```

## Admin Panel Customization

### Adding New Admin Features

1. **Create New Admin Component:**
```typescript
// src/components/admin/AdminAnalytics.tsx
export const AdminAnalytics = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
      {/* Custom analytics content */}
    </div>
  );
};
```

2. **Add to Admin Sidebar:**
```typescript
// Update src/components/admin/AdminSidebar.tsx
const menuItems = [
  // ... existing items
  { id: 'analytics', name: 'Analytics', icon: BarChart },
];
```

### Custom Admin Permissions

```typescript
// src/types/admin.ts
export interface AdminRole {
  id: string;
  name: string;
  permissions: {
    canDeletePosts: boolean;
    canBanUsers: boolean;
    canModifySettings: boolean;
    canAccessAnalytics: boolean;
  };
}
```

## Deployment Customization

### Environment-Specific Configuration

Create environment-specific config files:

**Development** (`src/config/dev.ts`):
```typescript
export const CONFIG = {
  API_URL: 'http://localhost:3000',
  FIREBASE_PROJECT: 'roastblame-dev',
  DEBUG: true,
};
```

**Production** (`src/config/prod.ts`):
```typescript
export const CONFIG = {
  API_URL: 'https://api.roastblame.com',
  FIREBASE_PROJECT: 'roastblame-prod',
  DEBUG: false,
};
```

### Custom Domain Configuration

1. **Firebase Hosting Setup:**
```bash
firebase init hosting
```

2. **Custom Domain Configuration:**
```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
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

## Performance Customization

### Image Optimization

```typescript
// src/utils/imageOptimization.ts
export const optimizeImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const maxWidth = 800;
      const maxHeight = 600;
      
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        const optimizedFile = new File([blob!], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        resolve(optimizedFile);
      }, 'image/jpeg', 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
```

### Lazy Loading Implementation

```typescript
// src/hooks/useLazyLoading.ts
export const useLazyLoading = (ref: RefObject<HTMLElement>) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [ref]);
  
  return isVisible;
};
```

## Security Customization

### Content Security Policy

Add CSP headers in your hosting configuration:

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://apis.google.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com;
               img-src 'self' data: https: blob:;
               connect-src 'self' https://*.firebaseapp.com https://*.googleapis.com;">
```

### Input Sanitization

```typescript
// src/utils/sanitize.ts
import DOMPurify from 'dompurify';

export const sanitizeContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  });
};
```

## Localization (i18n)

While the current app is English-only, here's how to add multi-language support:

1. **Install i18n Dependencies:**
```bash
npm install react-i18next i18next
```

2. **Create Language Files:**
```json
// src/locales/en.json
{
  "common": {
    "login": "Login",
    "signup": "Sign Up",
    "post": "Post"
  }
}
```

3. **Setup i18n Configuration:**
```typescript
// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: require('../locales/en.json') }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });
```

## Testing Customization

### Custom Test Utilities

```typescript
// src/test-utils/renderWithProviders.tsx
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertProvider } from '@/contexts/AlertContext';

export const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      <AlertProvider>
        {ui}
      </AlertProvider>
    </QueryClientProvider>
  );
};
```

## Support and Maintenance

### Monitoring and Analytics

1. **Error Tracking with Sentry:**
```typescript
// src/utils/errorTracking.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

export const trackError = (error: Error, context?: any) => {
  Sentry.captureException(error, { extra: context });
};
```

2. **Performance Monitoring:**
```typescript
// src/utils/performance.ts
export const trackPerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  
  // Send to analytics service
  if (window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: name,
      value: Math.round(end - start)
    });
  }
};
```

Remember to test all customizations thoroughly before deploying to production!
