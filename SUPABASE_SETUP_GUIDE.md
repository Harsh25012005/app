# Supabase Database Setup Guide

## 🎯 Objective
Set up the database schema in your Supabase project to store user profile data for the PG Admin app.

## 📋 Prerequisites
- Supabase account created
- Project created at: https://aaisjnexkvvukzqncrto.supabase.co
- Supabase credentials (already in `.env` file)

## 🚀 Step-by-Step Setup

### Step 1: Access Your Supabase Project
1. Open your browser
2. Go to: https://aaisjnexkvvukzqncrto.supabase.co
3. Sign in to your Supabase account
4. You should see your project dashboard

### Step 2: Open SQL Editor
1. In the left sidebar, find and click on **"SQL Editor"**
2. Click the **"New Query"** button (or the + icon)
3. You'll see a blank SQL editor

### Step 3: Copy the SQL Schema
1. Open the file `supabase-schema.sql` in your project
2. Select ALL the content (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)

### Step 4: Paste and Execute
1. Go back to the Supabase SQL Editor
2. Paste the SQL code (Ctrl+V or Cmd+V)
3. Click the **"Run"** button (or press Ctrl+Enter)
4. Wait for the execution to complete

### Step 5: Verify Success
You should see a success message like:
```
Success. No rows returned
```

This means the schema was created successfully!

## ✅ What Was Created

### 1. Table: `user_profiles`
A table to store additional user information:
- `id` - User ID (links to auth.users)
- `name` - User's full name
- `email` - User's email address
- `phone_number` - User's phone number
- `created_at` - When the profile was created
- `updated_at` - Last update timestamp

### 2. Row Level Security (RLS)
Security policies that ensure:
- Users can only view their own profile
- Users can only update their own profile
- Users can only insert their own profile
- No user can access another user's data

### 3. Database Trigger: `handle_new_user()`
Automatically creates a user profile when someone signs up:
- Triggered when a new user is created in `auth.users`
- Copies user data to `user_profiles` table
- Ensures profile is always created with the user

### 4. Database Trigger: `handle_updated_at()`
Automatically updates the `updated_at` timestamp:
- Triggered when a profile is updated
- Sets `updated_at` to current timestamp
- Keeps track of last modification time

## 🔍 Verify the Setup

### Check if Table Exists
1. In Supabase dashboard, click **"Table Editor"** in left sidebar
2. You should see `user_profiles` table listed
3. Click on it to view the structure

### Check Table Structure
You should see these columns:
| Column Name | Type | Default | Extra |
|-------------|------|---------|-------|
| id | uuid | - | Primary Key |
| name | text | - | NOT NULL |
| email | text | - | UNIQUE, NOT NULL |
| phone_number | text | - | Nullable |
| created_at | timestamptz | now() | - |
| updated_at | timestamptz | now() | - |

### Check RLS Policies
1. Click on the `user_profiles` table
2. Click on **"RLS"** or **"Policies"** tab
3. You should see 3 policies:
   - "Users can view own profile" (SELECT)
   - "Users can update own profile" (UPDATE)
   - "Users can insert own profile" (INSERT)

### Check Triggers
1. In SQL Editor, run this query:
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'public';
```

2. You should see:
   - `on_auth_user_created` on `auth.users`
   - `on_user_profile_updated` on `user_profiles`

## 🧪 Test the Setup

### Test 1: Manual Insert (Should Fail)
Try to insert a profile with a random ID:
```sql
INSERT INTO public.user_profiles (id, name, email)
VALUES ('00000000-0000-0000-0000-000000000000', 'Test User', 'test@example.com');
```

**Expected Result**: Should fail because RLS prevents inserting profiles for other users.

### Test 2: Check RLS is Enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'user_profiles';
```

**Expected Result**: `rowsecurity` should be `true`

### Test 3: Sign Up Through App
1. Run your app: `npm start`
2. Sign up with a test account
3. Check email for verification
4. Go to Supabase Table Editor
5. View `user_profiles` table
6. You should see your new profile!

## 📊 View Your Data

### In Supabase Dashboard
1. Click **"Table Editor"** in left sidebar
2. Click on `user_profiles` table
3. You'll see all user profiles (after users sign up)

### Using SQL
```sql
-- View all profiles (you'll only see your own due to RLS)
SELECT * FROM public.user_profiles;

-- Count total users
SELECT COUNT(*) FROM public.user_profiles;

-- View recent signups
SELECT name, email, created_at
FROM public.user_profiles
ORDER BY created_at DESC
LIMIT 10;
```

## 🔧 Troubleshooting

### Issue: "relation 'user_profiles' already exists"
**Solution**: The table already exists. You can either:
1. Drop it first: `DROP TABLE IF EXISTS public.user_profiles CASCADE;`
2. Or skip the creation and just verify it exists

### Issue: "permission denied for schema public"
**Solution**: 
1. Make sure you're logged in as the project owner
2. Check your Supabase project permissions
3. Try running the SQL as a superuser

### Issue: "trigger 'on_auth_user_created' already exists"
**Solution**: The trigger already exists. Drop it first:
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```
Then run the schema again.

### Issue: Profile not created after signup
**Solution**:
1. Check if trigger exists:
```sql
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```
2. If missing, run the trigger creation part of the schema
3. The app has a fallback to create profiles manually

### Issue: Can't see other users' profiles (Admin)
**Solution**: This is by design! RLS prevents it. To view all profiles as admin:
1. Use the Supabase dashboard Table Editor
2. Or create a separate admin policy
3. Or use the service key (server-side only)

## 🔐 Security Best Practices

### ✅ DO:
- Keep RLS enabled on all tables
- Use the anon key in your app
- Store service key securely (never in app)
- Test policies thoroughly
- Review policies regularly

### ❌ DON'T:
- Disable RLS in production
- Share your service key
- Hardcode credentials in code
- Give users access to other users' data
- Skip email verification

## 📝 Additional Queries

### Add an Index for Performance
```sql
-- Index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email
ON public.user_profiles(email);
```

### Add Phone Number Validation
```sql
-- Add a check constraint for phone format
ALTER TABLE public.user_profiles
ADD CONSTRAINT phone_format_check
CHECK (phone_number IS NULL OR phone_number ~ '^\+?[\d\s\-\(\)]+$');
```

### View User Activity
```sql
-- See when users signed up
SELECT 
  name,
  email,
  created_at,
  updated_at,
  EXTRACT(DAY FROM NOW() - created_at) as days_since_signup
FROM public.user_profiles
ORDER BY created_at DESC;
```

## 🎓 Understanding the Schema

### Why Two Tables?
1. **auth.users** (Managed by Supabase)
   - Stores authentication data
   - Email, password hash, verification status
   - Managed by Supabase Auth service

2. **user_profiles** (Your custom table)
   - Stores additional user data
   - Name, phone number, etc.
   - You have full control

### Why Use Triggers?
- Automatic profile creation on signup
- No need to manually create profiles
- Ensures data consistency
- Reduces app code complexity

### Why RLS?
- Security by default
- Users can't access others' data
- Enforced at database level
- Can't be bypassed from client

## 🚀 Next Steps

After setting up the database:

1. ✅ Run `npm install` in your project
2. ✅ Start the app: `npm start`
3. ✅ Test sign up with a new account
4. ✅ Verify email
5. ✅ Sign in and view dashboard
6. ✅ Check Supabase Table Editor to see your data

## 📚 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/sql-createtrigger.html)
- [Supabase SQL Editor](https://supabase.com/docs/guides/database/overview)

## 💡 Pro Tips

1. **Backup Your Schema**: Save the SQL file for future reference
2. **Test in Development**: Always test schema changes in a dev project first
3. **Monitor Logs**: Check Supabase logs for any errors
4. **Use Migrations**: For production, use proper migration tools
5. **Document Changes**: Keep track of schema modifications

---

## ✨ You're All Set!

Once you've completed these steps, your Supabase database is ready to store user data from your PG Admin app. The authentication system will automatically create and manage user profiles as users sign up and sign in.

**Need help?** Check the other documentation files:
- `QUICK_START.md` - Quick setup guide
- `SETUP_INSTRUCTIONS.md` - Detailed instructions
- `AUTHENTICATION_FLOW.md` - How authentication works
