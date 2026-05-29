# 🔍 ICA API Troubleshooting Guide

## Current Status

The application is configured with your ICA API key but is falling back to mock responses. This means the API calls are not succeeding. Let's diagnose and fix this.

## Step 1: Check Browser Console

1. **Open the application** in your browser (http://localhost:3000)
2. **Open Developer Tools** (F12 or Right-click → Inspect)
3. **Go to Console tab**
4. **Open the AI Assistant** and ask a question

### What to Look For:

You should see logs like:
```
🔧 ICA Configuration: { hasApiKey: true, apiKeyPrefix: "be503465...", ... }
💬 Processing question: "your question"
🚀 Trying ICA API endpoint: https://...
📡 Response status: XXX
```

## Step 2: Identify the Error

### Scenario A: Network Error
```
⚠️ Endpoint https://... error: Failed to fetch
```
**Cause:** CORS issue or network problem
**Solution:** See "Fix CORS Issues" below

### Scenario B: 401 Unauthorized
```
📡 Response status: 401 Unauthorized
```
**Cause:** Invalid API key or wrong authentication format
**Solution:** Verify API key and auth method

### Scenario C: 404 Not Found
```
📡 Response status: 404 Not Found
```
**Cause:** Wrong API endpoint URL
**Solution:** Get correct endpoint from IBM

### Scenario D: 400 Bad Request
```
📡 Response status: 400 Bad Request
```
**Cause:** Wrong request format
**Solution:** Adjust payload format

## Step 3: Get Correct API Information

### Contact IBM Support

You need to get the following information from IBM:

1. **Correct API Endpoint URL**
   - Example: `https://api.ibm.com/watsonx/v1/chat`
   - Or: `https://your-instance.ibm.com/api/v1/generate`

2. **Authentication Method**
   - Bearer token?
   - API key in header?
   - Basic auth?

3. **Request Format**
   - OpenAI-compatible?
   - Custom IBM format?
   - Example payload structure

4. **Response Format**
   - What fields contain the AI response?

### IBM Documentation Links

- IBM Cloud API Docs: https://cloud.ibm.com/docs
- Watson API Reference: https://cloud.ibm.com/apidocs
- IBM Consulting Advantage: Contact your IBM representative

## Step 4: Update Configuration

Once you have the correct information, update the `.env` file:

```env
# Update with correct endpoint
VITE_ICA_API_URL=https://your-correct-endpoint.ibm.com/v1

# Your API key (already set)
VITE_ICA_API_KEY=be503465-a53c-48c4-ae97-369c2b515ceb

# Keep this false to use real API
VITE_USE_MOCK_ICA=false
```

## Step 5: Test Different Formats

The code now tries multiple endpoint formats automatically:
- `/chat/completions` (OpenAI-compatible)
- `/chat`
- `/generate`
- `/completions`
- WatsonX endpoints
- GenAI endpoints

Check the console to see which ones are being tried and their responses.

## Common Solutions

### Fix CORS Issues

If you see CORS errors, you have two options:

**Option 1: Use a Proxy**
```javascript
// In vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://api.ibm.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}
```

Then update `.env`:
```env
VITE_ICA_API_URL=/api/consulting-advantage/v1
```

**Option 2: Backend Proxy**
Create a simple backend that forwards requests to IBM API.

### Update Authentication Format

If authentication fails, try different formats in `aiService.js`:

```javascript
// Option 1: Bearer token
headers: {
  'Authorization': `Bearer ${ICA_API_KEY}`
}

// Option 2: API key header
headers: {
  'X-API-Key': ICA_API_KEY
}

// Option 3: Both
headers: {
  'Authorization': `Bearer ${ICA_API_KEY}`,
  'X-API-Key': ICA_API_KEY
}

// Option 4: IBM-specific
headers: {
  'Authorization': `apikey ${ICA_API_KEY}`
}
```

### Update Request Format

If the request format is wrong, modify the payload:

```javascript
// OpenAI format (current)
{
  messages: [...],
  temperature: 0.7,
  max_tokens: 1000
}

// Simple format
{
  prompt: "your question",
  max_tokens: 1000
}

// IBM WatsonX format
{
  input: "your question",
  parameters: {
    temperature: 0.7,
    max_new_tokens: 1000
  }
}
```

## Step 6: Enable Mock Mode Temporarily

While troubleshooting, you can enable mock mode to keep the app functional:

```env
VITE_USE_MOCK_ICA=true
```

This will use mock responses while you figure out the correct API configuration.

## Step 7: Test with cURL

Test the API directly with cURL to verify it works:

```bash
curl -X POST https://api.ibm.com/your-endpoint \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer be503465-a53c-48c4-ae97-369c2b515ceb" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'
```

If this works, you know the endpoint and auth are correct.

## Step 8: Share Console Output

If you're still stuck, share the console output:

1. Open browser console
2. Ask a question in the chatbot
3. Copy all the logs that appear
4. Share them so we can diagnose the issue

Look for:
```
🔧 ICA Configuration: {...}
🚀 Trying ICA API endpoint: ...
📡 Response status: ...
⚠️ Endpoint ... failed: ...
```

## Quick Fixes

### Fix 1: Verify API Key Format
```javascript
// Check if API key is being read correctly
console.log('API Key:', import.meta.env.VITE_ICA_API_KEY);
```

### Fix 2: Test with Postman
Use Postman to test the API endpoint with your key before integrating.

### Fix 3: Check IBM Dashboard
Log into IBM Cloud dashboard and verify:
- API key is active
- Service is enabled
- Quota is not exceeded
- Endpoint URL is correct

### Fix 4: Contact IBM Support
If nothing works, contact IBM support with:
- Your API key
- Error messages
- What you're trying to do

## Alternative: Use Different AI Service

If ICA API is not working, you can switch to:

### Option 1: OpenAI API
```env
VITE_OPENAI_API_KEY=your-openai-key
```

### Option 2: Anthropic Claude
```env
VITE_ANTHROPIC_API_KEY=your-anthropic-key
```

### Option 3: Google Gemini
```env
VITE_GOOGLE_API_KEY=your-google-key
```

### Option 4: Local LLM (Ollama)
```env
VITE_OLLAMA_URL=http://localhost:11434
```

## Next Steps

1. ✅ Check browser console for errors
2. ✅ Identify the specific error (401, 404, CORS, etc.)
3. ✅ Get correct API documentation from IBM
4. ✅ Update endpoint URL and auth format
5. ✅ Test with cURL first
6. ✅ Update code if needed
7. ✅ Restart dev server
8. ✅ Test in browser

## Need Help?

If you need assistance:
1. Share the console output
2. Share any error messages
3. Confirm the API endpoint URL from IBM
4. Confirm the authentication method

The code is now set up to try multiple formats automatically, so once we know the correct format, it should work!

---

**Current Configuration:**
- API Key: `be503465-a53c-48c4-ae97-369c2b515ceb`
- Mock Mode: Disabled
- Auto-trying multiple endpoints: ✅

**Made with 💙 by Bob**