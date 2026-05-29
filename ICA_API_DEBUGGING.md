# ICA API Integration - Debugging Guide

## Current Status
✅ **Mock responses are now enabled by default**
✅ **Comprehensive error logging added**
✅ **Automatic fallback to mock responses on API errors**

## Configuration

### Environment Variables (.env)
```env
# ICA API Configuration
VITE_ICA_API_KEY=sk-y8sYvwhPM6qE0oFrisIaTQ
VITE_ICA_API_URL=https://api.ibm.com/consulting-advantage/v1

# Enable mock responses (set to 'true' for testing)
VITE_USE_MOCK_ICA=true
```

## Debugging Features

### 1. Console Logging
The integration now includes comprehensive console logging:

- **🔧 Configuration logs** - Shows API URL, key status, and mock mode on startup
- **📤 Request logs** - Shows every API request with full details
- **✅ Success logs** - Shows successful API responses
- **❌ Error logs** - Shows detailed error information including:
  - Error message and code
  - HTTP status and status text
  - Response data
  - Request URL and method

### 2. Error Detection

The system now detects and provides specific guidance for:

#### Network Errors (ERR_NETWORK)
**Symptoms:** "Network Error" in console
**Possible Causes:**
- CORS policy blocking the request
- Invalid API URL
- API server is down or unreachable
- Firewall or network restrictions

**Solutions:**
1. Verify the API URL is correct in `.env`
2. Check if the API requires a backend proxy (most likely!)
3. Enable CORS on the API server
4. Use mock responses for testing: `VITE_USE_MOCK_ICA=true`

#### Authentication Errors (401)
**Symptoms:** "Authentication Error: Invalid API Key"
**Solution:** Check your `VITE_ICA_API_KEY` in the `.env` file

#### Authorization Errors (403)
**Symptoms:** "Authorization Error: Access Denied"
**Solution:** Your API key may not have permission to access this endpoint

#### Endpoint Not Found (404)
**Symptoms:** "Endpoint Not Found"
**Solution:** Check `VITE_ICA_API_URL` - the endpoint may be incorrect

#### Rate Limiting (429)
**Symptoms:** "Rate Limit Exceeded"
**Solution:** Too many requests. Wait and try again.

#### Server Errors (500+)
**Symptoms:** "Server Error"
**Solution:** The ICA API server is experiencing issues. Try again later.

### 3. Mock Response Fallback

The system automatically falls back to mock responses when:
- API key is not configured
- `VITE_USE_MOCK_ICA=true` is set
- Any API error occurs

Mock responses include:
- ✅ Contextual responses based on question type
- ✅ Clear indication that it's a mock response
- ✅ Instructions for enabling real API responses
- ✅ Error details when falling back due to an error

## Testing the Integration

### Step 1: Check Console Logs
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for the configuration logs:
   ```
   🔧 ICA API Configuration:
     API URL: https://api.ibm.com/consulting-advantage/v1
     API Key: sk-y8sYvw...
     Mock Mode: true
   ```

### Step 2: Test with Mock Responses
1. Ensure `VITE_USE_MOCK_ICA=true` in `.env`
2. Open the AI Assistant
3. Send a test message
4. Check console for:
   ```
   📨 Sending chat message: {...}
   🎭 Using mock response (VITE_USE_MOCK_ICA=true)
   ```
5. Verify you receive a mock response

### Step 3: Test Real API (if credentials available)
1. Set `VITE_USE_MOCK_ICA=false` in `.env`
2. Restart the dev server
3. Send a test message
4. Check console for:
   ```
   📨 Sending chat message: {...}
   🚀 Making real API request to: https://...
   📤 ICA API Request: {...}
   ```
5. If successful: `✅ API request successful`
6. If error: Detailed error logs with specific guidance

## Common Issues and Solutions

### Issue 1: "Network Error" on every request

**Root Cause:** Most likely CORS blocking or invalid API URL

**Solution:**
1. **Verify API URL:** The current URL `https://api.ibm.com/consulting-advantage/v1` may not be correct
2. **Check CORS:** Direct frontend calls to IBM APIs are often blocked by CORS
3. **Use Backend Proxy:** IBM APIs typically require server-side calls
4. **Enable Mock Mode:** Set `VITE_USE_MOCK_ICA=true` for testing

### Issue 2: API key appears invalid

**Root Cause:** The API key format or value is incorrect

**Solution:**
1. Verify the API key format with IBM documentation
2. Check if the key has expired
3. Ensure no extra spaces or characters in `.env`
4. Contact IBM support for valid credentials

### Issue 3: Endpoint returns 404

**Root Cause:** The API endpoint URL is incorrect

**Solution:**
1. Verify the correct ICA API endpoint with IBM documentation
2. Check if the endpoint path `/chat/completions` is correct
3. IBM APIs may use different endpoint structures

## Recommended Next Steps

### For Development/Testing:
✅ **Use mock responses** - Set `VITE_USE_MOCK_ICA=true`
- No API credentials needed
- Instant responses
- Full UI testing capability

### For Production:
1. **Contact IBM** to get valid ICA API credentials
2. **Verify API endpoint** - Confirm the correct URL and endpoint structure
3. **Consider Backend Proxy** - Most enterprise APIs require server-side calls:
   ```
   Frontend → Your Backend → IBM ICA API
   ```
4. **Implement Backend Proxy:**
   - Create a backend endpoint (e.g., `/api/ica/chat`)
   - Backend makes the actual ICA API call
   - Frontend calls your backend endpoint
   - This solves CORS and security issues

### Backend Proxy Example (Node.js/Express):
```javascript
// backend/routes/ica.js
app.post('/api/ica/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.ibm.com/consulting-advantage/v1/chat/completions',
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${process.env.ICA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message
    });
  }
});
```

Then update frontend to call your backend:
```javascript
// In icaApi.js
const ICA_API_URL = '/api/ica'; // Your backend endpoint
```

## Browser Console Commands

Test the API configuration in browser console:
```javascript
// Check environment variables
console.log('ICA Config:', {
  apiKey: import.meta.env.VITE_ICA_API_KEY,
  apiUrl: import.meta.env.VITE_ICA_API_URL,
  useMock: import.meta.env.VITE_USE_MOCK_ICA
});
```

## Support

For issues with:
- **ICA API credentials:** Contact IBM Consulting Advantage support
- **API endpoint/documentation:** Check IBM ICA API documentation
- **Integration code:** Check console logs and this debugging guide