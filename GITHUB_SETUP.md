# 📦 GitHub Repository Setup Guide

This guide will help you publish your GenAI Explorers application to GitHub and make it publicly available.

## 🚀 Quick Start

### Step 1: Create a GitHub Account

If you don't have one already:
1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Follow the registration process

### Step 2: Install Git

**Windows:**
- Download from [git-scm.com](https://git-scm.com/download/win)
- Run the installer with default settings

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git  # Ubuntu/Debian
sudo yum install git      # CentOS/RHEL
```

### Step 3: Configure Git

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 📤 Publishing to GitHub

### Option A: Using GitHub Desktop (Easiest)

1. **Download GitHub Desktop**
   - Go to [desktop.github.com](https://desktop.github.com)
   - Install and sign in

2. **Add Your Repository**
   - File → Add Local Repository
   - Choose the `genai-clone` folder
   - Click "Create Repository"

3. **Publish to GitHub**
   - Click "Publish repository"
   - Name: `genai-explorers`
   - Description: "A YouTube-like app for discovering GenAI videos"
   - Uncheck "Keep this code private" to make it public
   - Click "Publish Repository"

### Option B: Using Command Line

1. **Initialize Git Repository**
   ```bash
   cd genai-clone
   git init
   ```

2. **Add All Files**
   ```bash
   git add .
   ```

3. **Create Initial Commit**
   ```bash
   git commit -m "Initial commit: GenAI Explorers application"
   ```

4. **Create GitHub Repository**
   - Go to [github.com/new](https://github.com/new)
   - Repository name: `genai-explorers`
   - Description: "A YouTube-like app for discovering GenAI videos"
   - Choose "Public"
   - Don't initialize with README (we already have one)
   - Click "Create repository"

5. **Connect and Push**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/genai-explorers.git
   git branch -M main
   git push -u origin main
   ```

## 🔐 Protecting Sensitive Information

### Before Publishing - IMPORTANT!

Ensure your `.gitignore` file includes:
```
.env
.env.local
.env.production
node_modules/
dist/
```

### If You Accidentally Committed Secrets

1. **Remove from history:**
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch .env" \
   --prune-empty --tag-name-filter cat -- --all
   ```

2. **Force push:**
   ```bash
   git push origin --force --all
   ```

3. **Rotate all API keys immediately!**

## 📝 Repository Settings

### 1. Add Repository Description

1. Go to your repository on GitHub
2. Click the gear icon next to "About"
3. Add description and topics:
   - Description: "A YouTube-like app for discovering GenAI videos"
   - Topics: `react`, `vite`, `tailwindcss`, `youtube-api`, `genai`, `ai`
   - Website: (add after deployment)

### 2. Enable Issues

Settings → Features → Check "Issues"

### 3. Add Branch Protection (Optional)

Settings → Branches → Add rule:
- Branch name pattern: `main`
- Require pull request reviews before merging
- Require status checks to pass

### 4. Configure GitHub Pages (Optional)

Settings → Pages:
- Source: Deploy from a branch
- Branch: `gh-pages` (after deploying)

## 🏷️ Creating Releases

### Tag a Version

```bash
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

### Create Release on GitHub

1. Go to Releases → Draft a new release
2. Choose tag: `v1.0.0`
3. Release title: `v1.0.0 - Initial Release`
4. Description:
   ```markdown
   ## 🎉 Initial Release
   
   ### Features
   - Video browsing and search
   - AI-powered recommendations
   - User authentication
   - Watch history tracking
   - Responsive design
   
   ### Installation
   See [README.md](README.md) for setup instructions.
   ```
5. Click "Publish release"

## 🌟 Making Your Repository Attractive

### 1. Add a Great README

✅ Already created! Your README.md includes:
- Project description
- Features
- Installation instructions
- Deployment guide
- Contributing guidelines

### 2. Add Screenshots

Create a `screenshots` folder and add images:
```bash
mkdir screenshots
# Add your screenshots
git add screenshots/
git commit -m "Add screenshots"
git push
```

Update README.md with images:
```markdown
## 📸 Screenshots

![Home Page](screenshots/home.png)
![Video Player](screenshots/player.png)
```

### 3. Add Badges

Add to top of README.md:
```markdown
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![Vite](https://img.shields.io/badge/vite-5.0.8-purple.svg)
```

### 4. Create a Demo

Deploy your app and add the link:
```markdown
## 🌐 Live Demo

Check out the live demo: [GenAI Explorers](https://your-app.vercel.app)
```

## 👥 Collaboration

### Inviting Collaborators

1. Settings → Collaborators
2. Click "Add people"
3. Enter GitHub username or email
4. Choose permission level

### Setting Up Team Workflow

1. **Create branches for features:**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Push and create PR:**
   ```bash
   git push origin feature/new-feature
   ```
   Then create Pull Request on GitHub

3. **Review and merge:**
   - Team reviews the PR
   - Approve and merge to main

## 📊 GitHub Actions (CI/CD)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_USE_MOCK_ICA: true
```

## 🎯 Best Practices

1. **Commit Often**: Make small, focused commits
2. **Write Clear Messages**: Describe what and why
3. **Use Branches**: Keep main branch stable
4. **Review Code**: Use pull requests for changes
5. **Document Changes**: Update README and CHANGELOG
6. **Tag Releases**: Use semantic versioning (v1.0.0)
7. **Respond to Issues**: Engage with your community

## 📈 Growing Your Project

### 1. Share Your Project

- Post on social media
- Share in relevant communities
- Write a blog post
- Create a demo video

### 2. Encourage Contributions

- Add CONTRIBUTING.md ✅ (already created)
- Label issues as "good first issue"
- Respond to PRs promptly
- Thank contributors

### 3. Maintain Your Project

- Fix bugs quickly
- Add new features
- Keep dependencies updated
- Respond to issues

## 🔗 Useful Links

- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Semantic Versioning](https://semver.org)
- [Conventional Commits](https://www.conventionalcommits.org)

## ✅ Checklist

Before making your repository public:

- [ ] Remove all sensitive data (.env files)
- [ ] Update README.md with accurate information
- [ ] Add LICENSE file ✅
- [ ] Add CONTRIBUTING.md ✅
- [ ] Test the application locally
- [ ] Add .gitignore file ✅
- [ ] Write clear commit messages
- [ ] Add repository description and topics
- [ ] Consider adding screenshots
- [ ] Deploy to a hosting platform
- [ ] Add live demo link to README

## 🎉 You're Ready!

Your GenAI Explorers application is now ready to be shared with the world!

---

Made with ❤️ and Bob