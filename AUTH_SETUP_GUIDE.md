# 🔐 Authentication Setup Guide - GenAIExplorers

## Overview
GenAIExplorers uses a **localStorage-based authentication system** that provides a simple, secure way to manage user accounts without requiring external services like Firebase or Auth0.

## 🚀 Quick Start

### Access the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at: `http://localhost:3000`

2. **Three ways to access the app:**
   - **Guest Mode**: Click "Enter App" on landing page (auto-login as guest)
   - **Sign In**: Click "Sign In" button → Use existing credentials
   - **Sign Up**: Click "Sign In" → Switch to "Sign Up" tab → Create new account

### Demo Credentials
```
Email: guest@genaiexplorers.com
Password: guest123
```

## 📋 Features

### ✅ Current Features
- ✅ Email/Password Authentication
- ✅ User Registration with validation
- ✅ Guest Mode (auto-login)
- ✅ Remember Me functionality
- ✅ Profile management
- ✅ Password validation (min 6 characters)
- ✅ Email validation
- ✅ Phone number validation (optional)
- ✅ Multi-tab sync (localStorage events)
- ✅ Protected routes
- ✅ Auto-redirect after login
- ✅ Error handling & user feedback
- ✅ Responsive design

### 🔄 Authentication Flow

```
Landing Page (/)
    ↓
    ├─→ "Enter App" → Auto Guest Login → Home (/home)
    ├─→ "Sign In" → Auth Page (/auth)
    │       ↓
    │       ├─→ Login Form → Validate → Home (/home)
    │       ├─→ Sign Up Form → Create Account → Home (/home)
    │       └─→ Guest Login → Auto Login → Home (/home)
    │
    └─→ Protected Routes (require authentication)
```

## 🛠️ Technical Implementation

### File Structure
```
src/
├── services/
│   └── authService.js          # Core authentication logic
├── contexts/
│   └── AuthContext.jsx         # React context for auth state
├── pages/
│   ├── Landing.jsx             # Landing page with guest login
│   ├── Auth.jsx                # Login/Signup page
│   ├── Profile.jsx             # User profile management
│   └── Settings.jsx            # User settings
└── App.jsx                     # Route protection
```

### Authentication Service (`authService.js`)

#### Available Functions:

1. **signUpWithEmail(email, password, fullName, phoneNumber)**
   - Creates new user account
   - Validates email, password, phone
   - Stores user in localStorage
   - Returns: `{ success: boolean, user?: object, error?: string }`

2. **signInWithEmail(email, password, rememberMe)**
   - Authenticates existing user
   - Updates last active timestamp
   - Returns: `{ success: boolean, user?: object, error?: string }`

3. **signOutUser()**
   - Logs out current user
   - Clears auth data from localStorage
   - Returns: `{ success: boolean, error?: string }`

4. **getCurrentUser()**
   - Gets currently logged-in user
   - Returns: `user object | null`

5. **updateUserProfile(updates)**
   - Updates user profile data
   - Syncs across localStorage
   - Returns: `{ success: boolean, user?: object, error?: string }`

6. **validateEmail(email)**
   - Validates email format
   - Returns: `boolean`

7. **validatePassword(password)**
   - Validates password strength
   - Returns: `{ isValid: boolean, message: string }`

8. **validatePhoneNumber(phone)**
   - Validates phone number format
   - Returns: `boolean`

### Auth Context (`AuthContext.jsx`)

Provides global auth state:
```javascript
const { 
  currentUser,      // Current user object
  userData,         // Extended user data
  loading,          // Loading state
  error,            // Error state
  isAuthenticated,  // Boolean auth status
  refreshUserData   // Function to refresh user data
} = useAuth();
```

### Protected Routes

Routes automatically redirect to landing page if user is not authenticated:
```javascript
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

## 📝 Usage Examples

### 1. Sign Up New User

```javascript
import { signUpWithEmail } from '../services/authService';

const handleSignup = async () => {
  const result = await signUpWithEmail(
    'user@example.com',
    'password123',
    'John Doe',
    '+1234567890'  // optional
  );
  
  if (result.success) {
    console.log('User created:', result.user);
    // Navigate to home
  } else {
    console.error('Signup failed:', result.error);
  }
};
```

### 2. Sign In Existing User

```javascript
import { signInWithEmail } from '../services/authService';

const handleLogin = async () => {
  const result = await signInWithEmail(
    'user@example.com',
    'password123',
    true  // remember me
  );
  
  if (result.success) {
    console.log('Logged in:', result.user);
    // Navigate to home
  } else {
    console.error('Login failed:', result.error);
  }
};
```

### 3. Get Current User

```javascript
import { getCurrentUser } from '../services/authService';

const user = getCurrentUser();
if (user) {
  console.log('Current user:', user);
} else {
  console.log('No user logged in');
}
```

### 4. Update User Profile

```javascript
import { updateUserProfile } from '../services/authService';

const handleUpdate = async () => {
  const result = await updateUserProfile({
    displayName: 'New Name',
    phoneNumber: '+9876543210',
    photoURL: 'https://example.com/photo.jpg'
  });
  
  if (result.success) {
    console.log('Profile updated:', result.user);
  }
};
```

### 5. Sign Out

```javascript
import { signOutUser } from '../services/authService';

const handleLogout = async () => {
  const result = await signOutUser();
  if (result.success) {
    console.log('Logged out successfully');
    // Navigate to landing page
  }
};
```

### 6. Use Auth Context in Components

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { currentUser, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return (
    <div>
      <h1>Welcome, {currentUser.displayName}!</h1>
      <p>Email: {currentUser.email}</p>
    </div>
  );
}
```

## 🔒 Security Considerations

### Current Implementation
- ✅ Passwords stored in localStorage (for demo purposes)
- ✅ Email validation
- ✅ Password strength validation
- ✅ Protected routes
- ✅ Multi-tab sync

### Production Recommendations
For a production application, consider:

1. **Backend Authentication**
   - Use a proper backend (Node.js, Python, etc.)
   - Hash passwords with bcrypt
   - Use JWT tokens for session management
   - Implement refresh tokens

2. **Enhanced Security**
   - Add rate limiting
   - Implement CAPTCHA for signup
   - Add email verification
   - Enable 2FA (Two-Factor Authentication)
   - Use HTTPS only

3. **Third-Party Auth**
   - Firebase Authentication
   - Auth0
   - AWS Cognito
   - Supabase Auth

## 🎨 Customization

### Modify Validation Rules

Edit `src/services/authService.js`:

```javascript
// Change password minimum length
export const validatePassword = (password) => {
  return {
    isValid: password.length >= 8,  // Changed from 6 to 8
    message: password.length >= 8 ? '' : 'Password must be at least 8 characters'
  };
};

// Add custom email domain validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
  const domain = email.split('@')[1];
  
  return emailRegex.test(email) && allowedDomains.includes(domain);
};
```

### Customize Auth UI

Edit `src/pages/Auth.jsx` to modify:
- Colors and styling
- Form fields
- Validation messages
- Button text
- Layout

### Add Social Login (Mock)

```javascript
// In authService.js
export const signInWithGoogle = async () => {
  // Mock Google sign-in
  const user = {
    uid: Date.now().toString(),
    email: 'google-user@gmail.com',
    displayName: 'Google User',
    photoURL: 'https://example.com/photo.jpg',
    provider: 'google'
  };
  
  localStorage.setItem('authUser', JSON.stringify(user));
  window.dispatchEvent(new Event('authStateChanged'));
  
  return { success: true, user };
};
```

## 🐛 Troubleshooting

### Issue: User not staying logged in
**Solution**: Check if localStorage is enabled in browser settings

### Issue: Multi-tab sync not working
**Solution**: Ensure you're using the same domain/port across tabs

### Issue: Protected routes not working
**Solution**: Verify AuthProvider wraps your app in App.jsx

### Issue: Form validation not working
**Solution**: Check console for validation errors and ensure all required fields are filled

## 📚 Additional Resources

- [React Context API](https://react.dev/reference/react/useContext)
- [React Router Protected Routes](https://reactrouter.com/en/main/start/tutorial)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Form Validation Best Practices](https://web.dev/sign-in-form-best-practices/)

## 🎯 Next Steps

1. **Test the authentication:**
   - Try signing up with a new account
   - Test login with demo credentials
   - Try guest mode
   - Test logout functionality

2. **Customize for your needs:**
   - Modify validation rules
   - Update UI styling
   - Add additional user fields
   - Implement password reset

3. **Deploy to production:**
   - Follow DEPLOYMENT_GUIDE.md
   - Set up proper backend authentication
   - Enable HTTPS
   - Add monitoring and analytics

## 💡 Tips

- Use the demo credentials for quick testing
- Guest mode is perfect for demos and previews
- All user data is stored locally (no server required)
- Clear localStorage to reset all users: `localStorage.clear()`
- Check browser console for detailed error messages

---

**Made with 💙 by Bob**

For more information, see:
- [README.md](./README.md) - Project overview
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment instructions
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines