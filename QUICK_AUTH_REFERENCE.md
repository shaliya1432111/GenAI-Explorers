# 🚀 Quick Authentication Reference

## Access the App

### Development Server
```bash
npm run dev
```
**URL:** http://localhost:3000

## Login Options

### 1️⃣ Guest Mode (Fastest)
- Click **"Enter App"** on landing page
- Auto-login as guest user
- No credentials needed

### 2️⃣ Demo Account
```
Email: guest@genaiexplorers.com
Password: guest123
```

### 3️⃣ Create New Account
1. Click **"Sign In"** button
2. Switch to **"Sign Up"** tab
3. Fill in your details:
   - Full Name (required)
   - Email (required)
   - Phone (optional)
   - Password (min 6 chars)
   - Confirm Password
4. Click **"Create Account"**

## Quick Commands

### Clear All Users (Reset)
Open browser console and run:
```javascript
localStorage.clear()
```

### Check Current User
```javascript
JSON.parse(localStorage.getItem('authUser'))
```

### View All Users
```javascript
JSON.parse(localStorage.getItem('users'))
```

## Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page | No |
| `/auth` | Login/Signup page | No |
| `/home` | Main dashboard | Yes |
| `/profile` | User profile | Yes |
| `/settings` | User settings | Yes |
| `/history` | Watch history | Yes |
| `/video/:id` | Video player | Yes |
| `/channel/:name` | Channel page | Yes |

## Common Issues & Fixes

### Can't run npm?
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Not staying logged in?
- Check if localStorage is enabled
- Clear browser cache
- Try incognito mode

### Form not submitting?
- Check all required fields
- Verify password is 6+ characters
- Check browser console for errors

## Testing Checklist

- [ ] Sign up with new account
- [ ] Login with demo credentials
- [ ] Try guest mode
- [ ] Update profile
- [ ] Logout and login again
- [ ] Test "Remember Me"
- [ ] Try invalid credentials
- [ ] Test password validation

## File Locations

```
📁 Authentication Files
├── src/services/authService.js      # Core auth logic
├── src/contexts/AuthContext.jsx     # Auth state management
├── src/pages/Auth.jsx               # Login/Signup UI
├── src/pages/Landing.jsx            # Landing page
└── src/App.jsx                      # Route protection
```

## Quick Code Snippets

### Get Current User
```javascript
import { getCurrentUser } from '../services/authService';
const user = getCurrentUser();
```

### Sign Out
```javascript
import { signOutUser } from '../services/authService';
await signOutUser();
```

### Use Auth in Component
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { currentUser, isAuthenticated } = useAuth();
  
  return isAuthenticated ? (
    <div>Welcome {currentUser.displayName}!</div>
  ) : (
    <div>Please login</div>
  );
}
```

## Support

📖 Full Guide: [AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md)
📘 Project README: [README.md](./README.md)
🚀 Deployment: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---
**Made with 💙 by Bob**