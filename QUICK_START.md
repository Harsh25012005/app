# Quick Start Guide - PG Admin App

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- `@supabase/supabase-js` - Supabase client
- `@react-native-async-storage/async-storage` - Local storage
- `react-native-url-polyfill` - URL polyfill for React Native

### Step 2: Set Up Supabase Database

**IMPORTANT**: You must run the SQL schema in your Supabase database before using the app.

1. Go to: https://aaisjnexkvvukzqncrto.supabase.co
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `supabase-schema.sql` file
5. Paste it into the SQL editor
6. Click "Run" or press Ctrl+Enter

**What this does:**
- Creates `user_profiles` table to store user data (name, email, phone)
- Sets up Row Level Security (RLS) for data protection
- Creates automatic triggers to sync user data
- Enables secure user profile management

### Step 3: Run the App
```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser

## 📱 Using the App

### First Time User (Sign Up)
1. Open the app - you'll see the Sign In screen
2. Click **"Sign Up"** at the bottom
3. Fill in the form:
   - **Name**: Your full name
   - **Email**: Valid email address
   - **Phone Number**: Your phone number (optional but recommended)
   - **Password**: At least 6 characters
   - **Confirm Password**: Must match password
4. Click **"Sign Up"**
5. Check your email for verification link (check spam folder too)
6. Click the verification link
7. Return to app and sign in

### Returning User (Sign In)
1. Enter your email and password
2. Click **"Sign In"**
3. You'll see your dashboard with profile info

### Dashboard Features
- View your profile information
- Quick action buttons for PG management
- Sign out button

## 🔐 Security Features

- ✅ Passwords are securely hashed (never stored in plain text)
- ✅ Email verification required
- ✅ Row Level Security (users can only access their own data)
- ✅ Automatic session management
- ✅ Secure token refresh

## 📊 Data Storage

All data is stored in your Supabase database:

**Table: `user_profiles`**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | User ID (links to auth.users) |
| name | TEXT | User's full name |
| email | TEXT | User's email address |
| phone_number | TEXT | User's phone number |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

## ❗ Troubleshooting

### "Cannot connect to Supabase"
- Check your internet connection
- Verify Supabase project is active at https://aaisjnexkvvukzqncrto.supabase.co
- Ensure `.env` file exists with correct credentials

### "User profile not found"
- Make sure you ran the SQL schema in Supabase
- Check Supabase logs for errors
- Try signing up again

### "Module not found" errors
- Run `npm install` again
- Clear cache: `npm start -- --clear`
- Delete `node_modules` and run `npm install`

### Email verification not received
- Check spam/junk folder
- Verify email settings in Supabase dashboard
- Try resending verification email

## 📝 Environment Variables

The `.env` file contains your Supabase credentials:
```
REACT_APP_SUPABASE_URL=https://aaisjnexkvvukzqncrto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ Never share these keys publicly or commit them to public repositories!**

## 🎯 Next Steps

After setting up authentication, you can:
1. Add more features to the dashboard
2. Create PG management screens
3. Add tenant management
4. Implement payment tracking
5. Add notifications

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/docs)
- [Expo Documentation](https://docs.expo.dev)

## 🆘 Need Help?

If you encounter any issues:
1. Check the `SETUP_INSTRUCTIONS.md` for detailed setup
2. Review Supabase logs in your dashboard
3. Check the console for error messages
4. Verify all dependencies are installed

---

**Ready to go? Run `npm install` and then `npm start`!** 🚀
