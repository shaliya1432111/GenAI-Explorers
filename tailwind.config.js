/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yt-black': '#0f0f0f',
        'yt-dark': '#212121',
        'yt-light-black': '#272727',
        'yt-white': '#f1f1f1',
        'yt-gray': '#aaaaaa',
        'yt-red': '#ff0000',
        // Futuristic AI Theme Colors
        'ai-dark': '#0a0e27',
        'ai-darker': '#050816',
        'ai-blue': '#00d4ff',
        'ai-purple': '#a855f7',
        'ai-cyan': '#06b6d4',
        'ai-pink': '#ec4899',
        'ai-card': '#1a1f3a',
        'ai-hover': '#252b4a',
      },
      backgroundImage: {
        'ai-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'ai-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)',
      },
      boxShadow: {
        'ai-glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'ai-card': '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}

// Made with Bob
