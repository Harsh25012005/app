# Authentication Flow Diagram

## Overview
This document explains how the authentication system works in the PG Admin app.

## User Journey

### 1. Sign Up Flow
```
User Opens App
      ↓
  Sign In Screen
      ↓
Click "Sign Up"
      ↓
  Sign Up Screen
      ↓
Fill Form (Name, Email, Phone, Password)
      ↓
Click "Sign Up" Button
      ↓
Validation Check
      ↓
   [Valid?]
      ↓
    YES → Send to Supabase
      ↓
Supabase Creates Auth User
      ↓
Trigger Creates User Profile
      ↓
Send Verification Email
      ↓
Show Success Message
      ↓
User Checks Email
      ↓
Click Verification Link
      ↓
Email Verified ✓
      ↓
Return to App
      ↓
Sign In with Credentials
      ↓
Dashboard/Home Screen
```

### 2. Sign In Flow
```
User Opens App
      ↓
  Sign In Screen
      ↓
Enter Email & Password
      ↓
Click "Sign In" Button
      ↓
Validation Check
      ↓
   [Valid?]
      ↓
    YES → Send to Supabase
      ↓
Supabase Verifies Credentials
      ↓
   [Correct?]
      ↓
    YES → Create Session
      ↓
Store Session in AsyncStorage
      ↓
Fetch User Profile from Database
      ↓
Update Auth Context
      ↓
Dashboard/Home Screen
```

### 3. Session Management Flow
```
App Starts
      ↓
AuthProvider Initializes
      ↓
Check AsyncStorage for Session
      ↓
   [Session Exists?]
      ↓
    YES → Validate with Supabase
      ↓
   [Valid?]
      ↓
    YES → Fetch User Profile
      ↓
Update Auth Context
      ↓
Show Dashboard
      
    NO → Show Sign In Screen
```

### 4. Sign Out Flow
```
User on Dashboard
      ↓
Click "Sign Out" Button
      ↓
Call supabase.auth.signOut()
      ↓
Clear Session from AsyncStorage
      ↓
Clear User State in Context
      ↓
Clear Profile State
      ↓
Redirect to Sign In Screen
```

## Component Architecture

```
App.tsx
  └── AuthProvider (contexts/AuthContext.tsx)
        └── AuthNavigator
              ├── [Loading State]
              │     └── ActivityIndicator
              │
              ├── [No User]
              │     ├── SignIn (components/SignIn.tsx)
              │     └── SignUp (components/SignUp.tsx)
              │
              └── [User Authenticated]
                    └── Home (components/Home.tsx)
```

## Data Flow

### Sign Up Data Flow
```
SignUp Component
      ↓
  User Input
      ↓
Form Validation
      ↓
useAuth().signUp()
      ↓
AuthContext.signUp()
      ↓
supabase.auth.signUp()
      ↓
Supabase Auth Service
      ↓
auth.users table (Supabase managed)
      ↓
Database Trigger: handle_new_user()
      ↓
user_profiles table
      ↓
Success Response
      ↓
Show Success Alert
```

### Sign In Data Flow
```
SignIn Component
      ↓
  User Input
      ↓
Form Validation
      ↓
useAuth().signIn()
      ↓
AuthContext.signIn()
      ↓
supabase.auth.signInWithPassword()
      ↓
Supabase Auth Service
      ↓
Verify Credentials
      ↓
Create Session
      ↓
onAuthStateChange Listener
      ↓
Update AuthContext State
      ↓
fetchUserProfile()
      ↓
Query user_profiles table
      ↓
Update Profile State
      ↓
Render Home Component
```

## State Management

### AuthContext State
```typescript
{
  user: User | null,           // Supabase auth user
  profile: UserProfile | null, // Custom profile data
  session: Session | null,     // Current session
  loading: boolean             // Loading state
}
```

### User Profile Structure
```typescript
{
  id: string,           // UUID from auth.users
  name: string,         // User's full name
  email: string,        // User's email
  phone_number: string  // User's phone (optional)
}
```

## Database Operations

### On Sign Up
```sql
-- 1. Supabase creates auth user
INSERT INTO auth.users (email, encrypted_password, ...)
VALUES (...);

-- 2. Trigger automatically creates profile
INSERT INTO public.user_profiles (id, email, name, phone_number)
VALUES (new_user_id, email, name, phone);
```

### On Sign In
```sql
-- 1. Verify credentials (handled by Supabase Auth)
-- 2. Fetch user profile
SELECT * FROM public.user_profiles
WHERE id = current_user_id;
```

### Row Level Security (RLS)
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);
```

## Security Layers

### 1. Client-Side Validation
- Email format check
- Password length requirement
- Required fields validation
- Phone number format check

### 2. Supabase Auth
- Password hashing (bcrypt)
- Email verification
- Session token generation
- Token refresh mechanism

### 3. Database Security
- Row Level Security (RLS)
- User isolation
- Secure triggers
- Encrypted connections

### 4. Environment Security
- API keys in .env file
- Keys not committed to git
- Anon key for client-side
- Service key kept server-side only

## Error Handling

### Sign Up Errors
```
Validation Errors → Show inline error messages
Network Errors → Show alert dialog
Duplicate Email → "Email already registered"
Weak Password → "Password too weak"
```

### Sign In Errors
```
Invalid Credentials → "Invalid email or password"
Unverified Email → "Please verify your email"
Network Errors → Show alert dialog
```

### Session Errors
```
Expired Session → Auto refresh or redirect to sign in
Invalid Token → Clear session and redirect
Network Errors → Retry mechanism
```

## Auto-Refresh Mechanism

```
Session Active
      ↓
Token Expiring Soon
      ↓
Supabase Auto Refresh
      ↓
New Token Generated
      ↓
Update AsyncStorage
      ↓
Continue Session
```

## Offline Handling

```
User Goes Offline
      ↓
Session Cached in AsyncStorage
      ↓
User Returns Online
      ↓
Validate Cached Session
      ↓
[Valid?]
      ↓
YES → Continue
NO → Redirect to Sign In
```

## Testing Checklist

### Sign Up Testing
- [ ] Valid sign up creates user
- [ ] Duplicate email shows error
- [ ] Weak password rejected
- [ ] Email verification sent
- [ ] Profile created in database
- [ ] All fields stored correctly

### Sign In Testing
- [ ] Valid credentials work
- [ ] Invalid credentials rejected
- [ ] Unverified email handled
- [ ] Session persists after app restart
- [ ] Token auto-refresh works

### Sign Out Testing
- [ ] Sign out clears session
- [ ] Redirects to sign in
- [ ] Cannot access protected routes
- [ ] AsyncStorage cleared

### Security Testing
- [ ] RLS prevents unauthorized access
- [ ] Users can't see other profiles
- [ ] API keys not exposed
- [ ] Passwords not visible in logs

## Performance Considerations

### Optimization Points
1. **Session Check**: Cached in AsyncStorage for fast startup
2. **Profile Fetch**: Only fetched once per session
3. **Auto-Refresh**: Handled by Supabase automatically
4. **Form Validation**: Client-side before API call

### Loading States
- App initialization: Show spinner
- Sign up/in: Disable button, show loading
- Profile fetch: Show loading indicator
- Navigation: Smooth transitions

## Future Enhancements

### Possible Additions
1. **Password Reset**: Forgot password flow
2. **Social Auth**: Google, Apple sign-in
3. **Profile Editing**: Update user info
4. **Avatar Upload**: Profile pictures
5. **Two-Factor Auth**: Enhanced security
6. **Biometric Auth**: Fingerprint/Face ID
7. **Remember Me**: Extended sessions
8. **Account Deletion**: GDPR compliance

---

## Quick Reference

### Key Files
- **Auth Logic**: `contexts/AuthContext.tsx`
- **Sign Up UI**: `components/SignUp.tsx`
- **Sign In UI**: `components/SignIn.tsx`
- **Supabase Client**: `lib/supabase.ts`
- **Database Schema**: `supabase-schema.sql`

### Key Functions
- `signUp(email, password, name, phone)` - Create account
- `signIn(email, password)` - Login
- `signOut()` - Logout
- `useAuth()` - Access auth state

### Key States
- `user` - Current authenticated user
- `profile` - User profile data
- `session` - Active session
- `loading` - Loading state
