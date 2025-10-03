# PG Admin App - Setup Instructions

## Overview
This is a React Native Expo app with authentication using Supabase. The app includes sign-in and sign-up functionality with user profile management.

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Supabase account

## Installation Steps

### 1. Install Dependencies
Run the following command to install all required packages:

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

### 2. Supabase Database Setup

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard: https://aaisjnexkvvukzqncrto.supabase.co
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` file
4. Click "Run" to execute the SQL

#### Option B: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push
```

The schema creates:
- `user_profiles` table with columns: id, name, email, phone_number, created_at, updated_at
- Row Level Security (RLS) policies
- Automatic trigger to create user profile on signup
- Updated_at trigger for profile updates

### 3. Environment Variables
The `.env` file has already been created with your Supabase credentials:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_ANON_KEY

### 4. Run the Application

#### For iOS:
```bash
npm run ios
```

#### For Android:
```bash
npm run android
```

#### For Web:
```bash
npm run web
```

#### Start Expo Dev Server:
```bash
npm start
```

## Features

### Authentication
- **Sign Up**: Create new account with name, email, password, and phone number
- **Sign In**: Login with email and password
- **Sign Out**: Logout functionality
- **Form Validation**: Client-side validation for all input fields
- **Password Requirements**: Minimum 6 characters
- **Email Verification**: Supabase sends verification emails automatically

### User Profile
- Stores user information in Supabase database
- Displays user profile on home screen
- Includes: Name, Email, Phone Number, User ID

### Security
- Row Level Security (RLS) enabled on user_profiles table
- Users can only access their own data
- Passwords are securely hashed by Supabase Auth
- Session management with automatic token refresh

## Project Structure

```
app/
├── components/
│   ├── SignIn.tsx          # Sign-in screen component
│   ├── SignUp.tsx          # Sign-up screen component
│   ├── Home.tsx            # Dashboard/home screen
│   ├── Container.tsx       # Layout container
│   ├── EditScreenInfo.tsx  # Info component
│   └── ScreenContent.tsx   # Screen content wrapper
├── contexts/
│   └── AuthContext.tsx     # Authentication context and hooks
├── lib/
│   └── supabase.ts         # Supabase client configuration
├── App.tsx                 # Main app component with navigation
├── .env                    # Environment variables
├── supabase-schema.sql     # Database schema
└── package.json            # Dependencies
```

## Usage

### Sign Up Flow
1. User opens the app and sees the Sign In screen
2. Click "Sign Up" to navigate to registration
3. Fill in: Name, Email, Phone Number, Password, Confirm Password
4. Click "Sign Up" button
5. Check email for verification link (sent by Supabase)
6. After verification, user can sign in

### Sign In Flow
1. Enter email and password
2. Click "Sign In"
3. On success, user is redirected to Home screen
4. User profile information is displayed

### Data Storage
All user data is automatically stored in Supabase:
- Authentication data in `auth.users` table (managed by Supabase)
- Profile data in `public.user_profiles` table
- Data is synced automatically on signup via database trigger

## Troubleshooting

### Issue: "Module not found" errors
**Solution**: Run `npm install` to ensure all dependencies are installed

### Issue: Supabase connection errors
**Solution**: 
1. Verify your Supabase URL and anon key in `.env` file
2. Check if your Supabase project is active
3. Ensure database schema has been applied

### Issue: User profile not created
**Solution**:
1. Check if the database trigger is working in Supabase dashboard
2. The AuthContext has a fallback to manually create profiles
3. Check Supabase logs for any errors

### Issue: Email verification not working
**Solution**:
1. Check Supabase Auth settings
2. Verify email templates are configured
3. Check spam folder for verification emails

## API Keys Security
- Never commit `.env` file to version control
- The `.env` file is already in `.gitignore`
- For production, use environment-specific configuration

## Next Steps
1. Install dependencies: `npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill`
2. Set up the database schema in Supabase
3. Run the app: `npm start`
4. Test sign-up and sign-in functionality

## Support
For issues with:
- Supabase: Check https://supabase.com/docs
- React Native: Check https://reactnative.dev/docs
- Expo: Check https://docs.expo.dev
