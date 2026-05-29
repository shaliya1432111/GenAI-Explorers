# GenAI Explorers 🚀

A modern YouTube-like application for discovering and exploring Generative AI videos, built with React, Vite, and Tailwind CSS.

## ✨ Features

- 🎥 Browse and search GenAI-related videos
- 🤖 AI-powered video recommendations
- 📊 User analytics and watch history
- 🔐 Firebase authentication
- 💬 AI assistant for video insights
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **APIs**: YouTube Data API v3, IBM Consulting Advantage (ICA) API
- **Authentication**: Firebase Auth
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd genai-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:

```env
# YouTube Data API v3 Key
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

# ICA (IBM Consulting Advantage) API Configuration
VITE_ICA_API_KEY=your_ica_api_key_here
VITE_ICA_API_URL=https://api.ibm.com/consulting-advantage/v1

# Enable mock responses for testing
VITE_USE_MOCK_ICA=true
```

#### Getting API Keys:

**YouTube API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key to your `.env` file

**ICA API Key:**
- Contact your IBM representative for API credentials
- For testing, you can set `VITE_USE_MOCK_ICA=true` to use mock responses

### 4. Run the Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🌐 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
npm run build
netlify deploy --prod
```

3. Add environment variables in Netlify dashboard

### Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

4. Deploy:
```bash
npm run deploy
```

## 📁 Project Structure

```
genai-clone/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── data/           # Static data
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind configuration
└── vite.config.js      # Vite configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- YouTube Data API for video content
- IBM Consulting Advantage for AI capabilities
- React and Vite communities
- All contributors and users

## 📧 Contact

For questions or support, please open an issue in the GitHub repository.

---

Made with ❤️ and Bob