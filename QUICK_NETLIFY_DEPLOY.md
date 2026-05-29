# 🚀 Quick Netlify Deployment Guide

## Current Status: Building Your Application

The build process is running. Once complete, follow these steps:

## 📍 Where to Find the dist Folder

After the build completes, the `dist` folder will be located at:

```
C:\Users\ShaliyaNowreenShaik\OneDrive - IBM\Desktop\Bob n thon Demo\genai-clone\dist
```

Or in short form:
```
genai-clone\dist
```

## ✅ Step-by-Step Deployment (Easiest Method)

### Step 1: Wait for Build to Complete
Watch the terminal until you see:
```
✓ built in [time]
dist/index.html  [size]
```

### Step 2: Verify dist Folder Exists
Open File Explorer and navigate to:
```
C:\Users\ShaliyaNowreenShaik\OneDrive - IBM\Desktop\Bob n thon Demo\genai-clone
```

You should see a new `dist` folder containing:
- `index.html`
- `assets/` folder with CSS and JS files

### Step 3: Sign Up for Netlify
1. Go to [https://www.netlify.com](https://www.netlify.com)
2. Click "Sign up" (it's FREE!)
3. Sign up with:
   - GitHub (recommended)
   - GitLab
   - Bitbucket
   - Email

### Step 4: Deploy via Drag & Drop
1. After logging in, you'll see the Netlify dashboard
2. Look for a box that says "Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"
3. Open File Explorer to: `genai-clone\dist`
4. **Drag the entire `dist` folder** onto the Netlify deploy area
5. Wait a few seconds while Netlify uploads and deploys

### Step 5: Your Site is Live! 🎉
You'll get a URL like: `https://random-name-123456.netlify.app`

### Step 6: Add Environment Variables (Important!)
1. Click on "Site settings"
2. Go to "Environment variables" in the left sidebar
3. Click "Add a variable"
4. Add these one by one:

**Variable 1:**
- Key: `VITE_YOUTUBE_API_KEY`
- Value: `your_youtube_api_key_here`

**Variable 2:**
- Key: `VITE_ICA_API_KEY`
- Value: `your_ica_api_key_here`

**Variable 3:**
- Key: `VITE_ICA_API_URL`
- Value: `https://api.ibm.com/consulting-advantage/v1`

**Variable 4:**
- Key: `VITE_USE_MOCK_ICA`
- Value: `true`

### Step 7: Redeploy with Environment Variables
1. Go to the "Deploys" tab
2. Click "Trigger deploy" button
3. Select "Deploy site"
4. Wait for the new deployment to finish

### Step 8: Test Your Site
Click on your site URL and test all features!

---

## 🔧 Alternative: Using Netlify CLI

If you prefer command line:

### Install Netlify CLI:
```powershell
npm install -g netlify-cli
```

### Login:
```powershell
netlify login
```

### Deploy:
```powershell
cd genai-clone
netlify deploy --prod --dir=dist
```

---

## 📁 Folder Structure After Build

```
genai-clone/
├── dist/                    ← This is what you deploy!
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js
│   │   └── index-[hash].css
│   └── [other files]
├── src/                     ← Source code (don't deploy this)
├── public/                  ← Static assets
├── package.json
└── [other config files]
```

**Important:** Only deploy the `dist` folder, not the entire `genai-clone` folder!

---

## ❓ Troubleshooting

### "I can't find the dist folder"
- Make sure the build completed successfully
- Check the terminal for any error messages
- The folder is created only after running `npm run build`

### "Build failed"
- Check if you have Node.js installed: `node --version`
- Make sure you're in the correct directory: `cd genai-clone`
- Try: `npm install` then `npm run build`

### "Site shows blank page"
- Add environment variables (Step 6 above)
- Redeploy the site (Step 7 above)
- Check browser console for errors (F12)

### "404 error when refreshing page"
- This is already fixed in `netlify.toml`
- Make sure you deployed the `dist` folder, not the root folder

---

## 🎨 Customize Your Site

### Change Site Name:
1. Site settings → General → Site details
2. Click "Change site name"
3. Enter: `genai-explorers` (or your preferred name)
4. Your URL becomes: `https://genai-explorers.netlify.app`

### Add Custom Domain (Optional):
1. Site settings → Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

---

## 📊 What You Get with Free Netlify

✅ 100 GB bandwidth per month
✅ 300 build minutes per month
✅ Unlimited sites
✅ Free HTTPS/SSL certificate
✅ Automatic deployments
✅ Deploy previews
✅ Instant rollbacks

Perfect for your project! 🎉

---

## 🆘 Need Help?

Check these files for more details:
- `NETLIFY_DEPLOYMENT_STEPS.md` - Comprehensive guide
- `DEPLOYMENT_GUIDE.md` - Multi-platform deployment
- `README.md` - Project documentation

Or visit: [Netlify Documentation](https://docs.netlify.com)

---

Made with ❤️ and Bob