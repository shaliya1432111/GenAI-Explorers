# ICA Integration Testing Guide

## Quick Test Steps

### 1. Open the Application
The dev server should be running at: http://localhost:5173

### 2. Open Browser DevTools
- Press F12 or right-click → Inspect
- Go to the **Console** tab

### 3. Check Initial Configuration Logs
You should see:
```
🔧 ICA API Configuration:
  API URL: https://api.ibm.com/consulting-advantage/v1
  API Key: sk-y8sYvw...
  Mock Mode: true
```

### 4. Open AI Assistant
- Click the AI Assistant button (sparkle icon) in the navbar
- The AI Assistant modal should open

### 5. Send a Test Message
Type any message and press Enter, for example:
- "What is machine learning?"
- "Explain neural networks"
- "Create a learning roadmap for AI"

### 6. Verify Console Logs
You should see:
```
📨 Sending chat message: { messages: [...], options: {} }
🎭 Using mock response (VITE_USE_MOCK_ICA=true)
```

### 7. Verify Response
- You should receive a mock response within 1 second
- The response should include "(Mock Response)" in the text
- The response should be contextual to your question

## Expected Behavior

### ✅ With Mock Mode Enabled (Current Setup)
- **No network errors**
- **Instant responses** (1 second simulated delay)
- **Contextual mock responses** based on question type
- **Clear indication** that responses are mocked
- **Instructions** for enabling real API

### ❌ With Mock Mode Disabled (Real API)
If you set `VITE_USE_MOCK_ICA=false`:
- **Network Error** will occur (expected with current credentials)
- **Detailed error logs** in console
- **Automatic fallback** to mock response with error details
- **Specific guidance** on how to fix the issue

## Test Different Question Types

### 1. General Question
**Input:** "What is artificial intelligence?"
**Expected:** General AI explanation with mock response note

### 2. Video Summary
**Input:** "Summarize this video"
**Expected:** Video summary format with key points

### 3. Concept Explanation
**Input:** "Explain transformers in AI"
**Expected:** Structured explanation with definition, components, applications

### 4. Learning Roadmap
**Input:** "Create a roadmap for learning deep learning"
**Expected:** Phased learning plan with timelines

### 5. Interview Questions
**Input:** "Generate interview questions for machine learning"
**Expected:** List of technical questions with hints

## Troubleshooting

### Issue: No console logs appear
**Solution:** 
- Refresh the page (Ctrl+R)
- Check if Console tab is selected
- Clear console and try again

### Issue: "Cannot read property of undefined"
**Solution:**
- Check if the dev server is running
- Restart the dev server: `npm run dev`

### Issue: AI Assistant doesn't open
**Solution:**
- Check browser console for errors
- Verify React components loaded correctly

### Issue: Still getting "Network Error"
**Solution:**
- Verify `.env` file has `VITE_USE_MOCK_ICA=true`
- Restart dev server after changing `.env`
- Check console logs show "Mock Mode: true"

## Success Criteria

✅ **Integration is working correctly if:**
1. Console shows configuration logs on page load
2. AI Assistant opens without errors
3. Messages can be sent
4. Mock responses are received within 1-2 seconds
5. Responses are contextual and well-formatted
6. No "Network Error" appears in UI
7. Console logs show detailed debugging information

## Next Steps After Testing

### If Mock Responses Work:
✅ **Integration is complete for development/demo purposes**
- You can showcase the UI and functionality
- All features work with mock data
- No API credentials needed

### To Enable Real API:
1. Obtain valid ICA API credentials from IBM
2. Verify the correct API endpoint URL
3. Update `.env` with real credentials
4. Set `VITE_USE_MOCK_ICA=false`
5. Consider implementing a backend proxy (recommended)
6. Test with real API calls

## Demo Script

For demonstrating the integration:

1. **Show Configuration:**
   - Open DevTools Console
   - Point out the configuration logs
   - Explain mock mode is enabled

2. **Demonstrate Features:**
   - Open AI Assistant
   - Ask a general question → Show response
   - Request a learning roadmap → Show structured response
   - Generate interview questions → Show formatted questions

3. **Explain Error Handling:**
   - Show console logs
   - Explain automatic fallback mechanism
   - Demonstrate detailed error messages

4. **Discuss Production Setup:**
   - Explain need for real API credentials
   - Discuss backend proxy approach
   - Show debugging documentation

## Console Commands for Testing

Run these in browser console:

```javascript
// Check environment configuration
console.log('Environment:', {
  apiKey: import.meta.env.VITE_ICA_API_KEY,
  apiUrl: import.meta.env.VITE_ICA_API_URL,
  useMock: import.meta.env.VITE_USE_MOCK_ICA
});

// Test if icaApi is loaded
console.log('ICA API loaded:', typeof window !== 'undefined');
```

## Files Modified

1. **src/services/icaApi.js** - Enhanced with:
   - Comprehensive error logging
   - Mock response generator
   - Automatic fallback mechanism
   - Detailed error messages

2. **.env** - Updated with:
   - Mock mode enabled
   - Clear configuration comments

3. **.env.example** - Updated with:
   - ICA API configuration template
   - Mock mode documentation

4. **ICA_API_DEBUGGING.md** - Created with:
   - Complete debugging guide
   - Common issues and solutions
   - Backend proxy recommendations

5. **TEST_ICA_INTEGRATION.md** - This file
   - Testing procedures
   - Success criteria
   - Demo script