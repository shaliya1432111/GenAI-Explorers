# 🚀 Deployment Guide - GenAI Explorers

This guide provides detailed instructions for deploying your GenAI Explorers application to various hosting platforms.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- ✅ All environment variables configured
- ✅ API keys for YouTube and ICA (or mock mode enabled)
- ✅ Firebase project set up (if using authentication)
- ✅ Tested the application locally
- ✅ Built the project successfully (`npm run build`)
- ✅ Committed all changes to Git

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

Vercel offers the easiest deployment with automatic CI/CD.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
cd genai-clone
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **genai-explorers** (or your preferred name)
- Directory? **./genai-clone**
- Override settings? **N**

#### Step 4: Add Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable from your `.env` file:
   - `VITE_YOUTUBE_API_KEY`
   - `VITE_ICA_API_KEY`
   - `VITE_ICA_API_URL`
   - `VITE_USE_MOCK_ICA`

#### Step 5: Redeploy

```bash
vercel --prod
```

Your app will be live at: `https://your-project.vercel.app`

---

### Option 2: Netlify

Netlify provides excellent static site hosting with continuous deployment.

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify

```bash
netlify login
```

#### Step 3: Initialize and Deploy

```bash
cd genai-clone
netlify init
```

Follow the prompts:
- Create & configure a new site? **Y**
- Team? Select your team
- Site name? **genai-explorers** (or your preferred name)
- Build command? **npm run build**
- Directory to deploy? **dist**

#### Step 4: Add Environment Variables

```bash
netlify env:set VITE_YOUTUBE_API_KEY "your_key_here"
netlify env:set VITE_ICA_API_KEY "your_key_here"
netlify env:set VITE_ICA_API_URL "your_url_here"
netlify env:set VITE_USE_MOCK_ICA "true"
```

Or add them via the Netlify dashboard:
1. Go to Site settings → Environment variables
2. Add each variable

#### Step 5: Deploy

```bash
npm run build
netlify deploy --prod
```

Your app will be live at: `https://your-site.netlify.app`

---

### Option 3: GitHub Pages

GitHub Pages is free for public repositories.

#### Step 1: Update vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/genai-explorers/', // Replace with your repo name
  server: {
    port: 3000,
    open: true
  }
})
```

#### Step 2: Install gh-pages

```bash
npm install --save-dev gh-pages
```

#### Step 3: Update package.json

Add these scripts:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### Step 4: Deploy

```bash
npm run deploy
```

#### Step 5: Configure GitHub Pages

1. Go to your repository on GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: **gh-pages** / **root**
5. Save

Your app will be live at: `https://yourusername.github.io/genai-explorers/`

**Note**: GitHub Pages doesn't support environment variables. You'll need to use a different approach for API keys (e.g., GitHub Secrets with Actions).

---

### Option 4: Firebase Hosting

Perfect if you're already using Firebase for authentication.

#### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Step 2: Login to Firebase

```bash
firebase login
```

#### Step 3: Initialize Firebase

```bash
cd genai-clone
firebase init hosting
```

Configuration:
- Use an existing project or create a new one
- Public directory? **dist**
- Single-page app? **Y**
- Set up automatic builds? **N**

#### Step 4: Build and Deploy

```bash
npm run build
firebase deploy --only hosting
```

Your app will be live at: `https://your-project.web.app`

**Environment Variables**: Store them in Firebase Functions or use a backend service.

---

### Option 5: AWS Amplify

AWS Amplify provides full-stack hosting with CI/CD.

#### Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
```

#### Step 2: Configure Amplify

```bash
amplify configure
```

#### Step 3: Initialize Amplify

```bash
cd genai-clone
amplify init
```

#### Step 4: Add Hosting

```bash
amplify add hosting
```

Select:
- Hosting with Amplify Console
- Manual deployment

#### Step 5: Build and Deploy

```bash
npm run build
amplify publish
```

Add environment variables in the Amplify Console.

---

## 🔐 Environment Variables Security

### Best Practices:

1. **Never commit `.env` files** to Git
2. **Use platform-specific environment variable management**
3. **Rotate API keys regularly**
4. **Use different keys for development and production**
5. **Restrict API key permissions** (e.g., HTTP referrer restrictions for YouTube API)

### Securing YouTube API Key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. APIs & Services → Credentials
4. Edit your API key
5. Add Application restrictions:
   - HTTP referrers
   - Add your domain: `https://yourdomain.com/*`

---

## 🔄 Continuous Deployment

### GitHub Actions (for any platform)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
      working-directory: ./genai-clone
    
    - name: Build
      run: npm run build
      working-directory: ./genai-clone
      env:
        VITE_YOUTUBE_API_KEY: ${{ secrets.VITE_YOUTUBE_API_KEY }}
        VITE_ICA_API_KEY: ${{ secrets.VITE_ICA_API_KEY }}
        VITE_ICA_API_URL: ${{ secrets.VITE_ICA_API_URL }}
        VITE_USE_MOCK_ICA: ${{ secrets.VITE_USE_MOCK_ICA }}
    
    - name: Deploy to Vercel
      run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
      working-directory: ./genai-clone
```

Add secrets in GitHub repository settings.

---

## 🐛 Troubleshooting

### Build Fails

- Check Node.js version (v16+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors
- Verify all dependencies are installed

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Restart dev server after changing `.env`
- Check platform-specific variable syntax
- Verify variables are set in deployment platform

### 404 Errors on Refresh

- Configure platform for SPA routing
- Vercel: Automatic
- Netlify: Add `_redirects` file with `/* /index.html 200`
- GitHub Pages: Use hash router instead

### API Errors

- Verify API keys are correct
- Check API quotas and limits
- Enable required APIs in Google Cloud Console
- Check CORS settings

---

## 📊 Post-Deployment

### Monitor Your Application

1. **Set up analytics** (Google Analytics, Vercel Analytics)
2. **Monitor API usage** (YouTube API quota)
3. **Set up error tracking** (Sentry, LogRocket)
4. **Configure custom domain** (optional)
5. **Enable HTTPS** (usually automatic)

### Performance Optimization

1. Enable compression (Gzip/Brotli)
2. Configure CDN caching
3. Optimize images
4. Enable lazy loading
5. Monitor Core Web Vitals

---

## 🎉 Success!

Your GenAI Explorers application is now live! Share it with the world! 🚀

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ and Bob