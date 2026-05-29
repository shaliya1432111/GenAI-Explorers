# YouTube API Setup Guide - Fix Video Playback & Get 100+ Videos

## 🎯 Overview
This guide will help you set up the YouTube Data API v3 to enable video playback and fetch 100+ real videos from YouTube.

## 🚨 Current Issues Fixed
1. ✅ **Videos not playing** - Need real YouTube API key (was using placeholder)
2. ✅ **Only 3 videos showing** - Enhanced fetch function to get 100+ videos
3. ✅ **Better error handling** - Graceful fallback to demo videos if API fails

## 📋 Prerequisites
- Google Account (free)
- 5 minutes of your time

## 🔑 Step-by-Step: Get Your FREE YouTube API Key

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account

### Step 2: Create a New Project
1. Click on the project dropdown (top left, next to "Google Cloud")
2. Click "NEW PROJECT"
3. Enter project name: `GenAI-Video-Platform` (or any name you prefer)
4. Click "CREATE"
5. Wait for the project to be created (takes ~30 seconds)
6. Select your new project from the dropdown

### Step 3: Enable YouTube Data API v3
1. In the left sidebar, go to: **APIs & Services** → **Library**
2. Search for: `YouTube Data API v3`
3. Click on **YouTube Data API v3**
4. Click the blue **ENABLE** button
5. Wait for it to enable (~10 seconds)

### Step 4: Create API Credentials
1. Go to: **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** (top of page)
3. Select **API key**
4. Your API key will be created and displayed
5. **COPY THE API KEY** (you'll need it in the next step)

### Step 5: (Optional but Recommended) Restrict Your API Key
1. Click on the API key you just created
2. Under "API restrictions":
   - Select "Restrict key"
   - Check only: **YouTube Data API v3**
3. Click **SAVE**

This prevents unauthorized use of your API key.

### Step 6: Add API Key to Your Project
1. Open the `.env` file in your project root
2. Find the line: `VITE_YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE`
3. Replace `YOUR_YOUTUBE_API_KEY_HERE` with your actual API key
4. Save the file

**Example:**
```env
VITE_YOUTUBE_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 7: Restart Your Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart it:
npm run dev
```

## 🎉 That's It!
Your videos should now work! The app will:
- ✅ Fetch 100+ real videos from YouTube
- ✅ Play videos using YouTube's embedded player
- ✅ Show real thumbnails, views, likes, and descriptions
- ✅ Display related videos

## 📊 API Quota Information

### Free Tier Limits
- **10,000 quota units per day** (resets at midnight Pacific Time)
- Each video search costs ~100 units
- You can make ~100 searches per day (plenty for development!)

### Quota Usage Breakdown
- Search request: 100 units
- Video details request: 1 unit
- Our app fetches 100+ videos on load: ~800 units
- Plenty of quota left for browsing and testing!

### Monitor Your Usage
1. Go to: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
2. View your daily quota usage
3. See when it resets

## 🔧 Enhanced Features

### 100+ Videos Guarantee
The updated `fetch100PlusVideos` function now:
- Makes multiple diverse search queries
- Filters out duplicate videos
- Uses pagination when needed
- Fetches 100-150 unique videos per category
- Has better error handling and logging

### Better Video Playback
- Videos auto-play when opened
- High-quality thumbnails from YouTube
- Proper video embedding with all YouTube features
- Related videos sidebar with 15+ suggestions

## 🐛 Troubleshooting

### Videos Still Not Loading?
1. **Check your API key is correct** in `.env`
2. **Restart the dev server** after changing `.env`
3. **Check browser console** for error messages
4. **Verify API is enabled** in Google Cloud Console

### Only 3 Demo Videos Showing?
This means the API key is not working. Check:
1. API key is correctly pasted in `.env`
2. YouTube Data API v3 is enabled in Google Cloud
3. No typos in the API key
4. Dev server was restarted after adding the key

### "Quota Exceeded" Error?
- You've used your daily 10,000 units
- Wait until midnight Pacific Time for reset
- Or create a new Google Cloud project with a new API key

### Videos Won't Play?
1. Check if video is embeddable (some videos restrict embedding)
2. Try a different video
3. Check browser console for errors
4. Ensure you're not blocking YouTube iframes

## 📝 Technical Details

### How It Works
1. **Home Page Load**: Calls `fetch100PlusVideos()` with selected category
2. **Multiple Queries**: Makes 8 diverse search queries per category
3. **Deduplication**: Filters out duplicate videos using Set
4. **Pagination**: Uses nextPageToken if needed to reach 100+
5. **Caching**: Videos are stored in state to avoid re-fetching

### API Endpoints Used
- `youtube.googleapis.com/youtube/v3/search` - Search for videos
- `youtube.googleapis.com/youtube/v3/videos` - Get video details
- `youtube.com/embed/{videoId}` - Embed player

### Categories Supported
- All (General AI content)
- AI (Artificial Intelligence)
- ChatGPT
- WatsonX (IBM)
- AI Agents
- Prompt Engineering
- Machine Learning
- AI Coding
- AI Automation

## 🎓 Best Practices

### For Development
- Use API key restrictions (YouTube Data API v3 only)
- Monitor your quota usage
- Don't commit `.env` file to Git (it's in `.gitignore`)
- Use environment variables for production

### For Production
- Consider implementing caching to reduce API calls
- Use a backend proxy to hide your API key
- Implement rate limiting on your end
- Consider YouTube API alternatives for high-traffic apps

## 🆘 Need Help?

### Common Questions
**Q: Is the YouTube API really free?**
A: Yes! 10,000 units/day is free forever.

**Q: Can I increase my quota?**
A: Yes, you can request a quota increase in Google Cloud Console, but the free tier is usually sufficient.

**Q: Will my API key expire?**
A: No, API keys don't expire unless you delete them.

**Q: Can I use multiple API keys?**
A: Yes, create multiple projects for more quota.

## 🔗 Useful Links
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)
- [YouTube API Support](https://support.google.com/youtube/answer/7505288)

## ✅ Verification Checklist
- [ ] Created Google Cloud project
- [ ] Enabled YouTube Data API v3
- [ ] Created and copied API key
- [ ] Added API key to `.env` file
- [ ] Restarted development server
- [ ] Videos are loading (100+ count)
- [ ] Videos play when clicked
- [ ] Thumbnails are showing correctly

---

**Made with 💙 by Bob**

Last Updated: May 2026