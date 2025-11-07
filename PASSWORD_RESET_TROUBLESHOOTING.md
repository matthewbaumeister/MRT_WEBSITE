# Password Reset Troubleshooting Guide

## Issue: Login Failed After Password Reset (401 Error)

### Possible Causes & Solutions:

---

## 1. **Run the Subscription Tier SQL Script First**

The recent update added `subscription_tier` column. You MUST run this SQL in Supabase:

```sql
-- File: SUPABASE_ADD_SUBSCRIPTION_TIERS.sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free';

ALTER TABLE users
ADD CONSTRAINT valid_subscription_tier 
CHECK (subscription_tier IN ('free', 'pro', 'enterprise', 'none'));

UPDATE users 
SET subscription_tier = 'free'
WHERE role = 'client' AND subscription_tier IS NULL;

UPDATE users 
SET subscription_tier = 'none'
WHERE role IN ('admin', 'employee') AND subscription_tier IS NULL;

CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
```

**Steps:**
1. Go to Supabase → SQL Editor
2. Paste the above SQL
3. Click "Run"
4. Try logging in again

---

## 2. **Check Password Was Actually Updated**

Run this in Supabase SQL Editor to verify:

```sql
SELECT 
  email, 
  password_hash,
  LENGTH(password_hash) as hash_length,
  updated_at
FROM users
WHERE email = 'YOUR_EMAIL_HERE'
ORDER BY updated_at DESC
LIMIT 1;
```

**Expected Result:**
- `password_hash` should exist (not null)
- `hash_length` should be ~60 characters (bcrypt hash)
- `updated_at` should be recent (after password reset)

---

## 3. **Check Runtime Logs in Vercel**

1. Go to Vercel Dashboard → Your Deployment
2. Click "Runtime Logs" tab
3. Try logging in
4. Look for these log messages:

```
=== LOGIN ATTEMPT ===
Email: [your-email]
Password provided: true
Fetching user from database...
User found: { email, role, isActive, twoFactorEnabled, subscriptionTier }
Verifying password...
Password hash from DB: exists
Password valid: true/false  ← KEY LINE
```

**If `Password valid: false`:**
- The password hash doesn't match
- Reset password again

**If `Password hash from DB: MISSING`:**
- Password wasn't saved during reset
- Check Supabase RLS policies

---

## 4. **Clear Browser Cache & Cookies**

Sometimes old session data causes issues:

1. Open DevTools (F12)
2. Go to Application → Storage
3. Clear Site Data
4. Try logging in again

---

## 5. **Test Password Reset Flow Again**

1. Go to `/forgot-password`
2. Enter your email
3. Check email for reset link
4. Click link
5. Set a NEW password (different from before)
6. Click "Reset Password"
7. Wait for success message
8. Go to `/login`
9. Enter email + NEW password
10. Click "Sign In"

---

## 6. **Verify RLS Policies Allow Password Updates**

Run this in Supabase to check:

```sql
-- Check if RLS is blocking updates
SELECT 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd
FROM pg_policies
WHERE tablename = 'users'
AND cmd = 'UPDATE';
```

If no policies allow service role to update, run:

```sql
-- This should already exist from SUPABASE_RLS_POLICIES.sql
CREATE POLICY "Service role can update users" ON users
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
```

---

## 7. **Manual Password Reset via SQL**

As a last resort, reset password directly in database:

```sql
-- Generate a bcrypt hash for "TempPassword123!" at https://bcrypt-generator.com/
-- Use 10 rounds
-- Example hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

UPDATE users
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'YOUR_EMAIL_HERE';

-- Then try logging in with: TempPassword123!
```

---

## 8. **Check Environment Variables**

Verify these are set in Vercel:

```
NEXTAUTH_URL=https://makereadytech.com
NEXTAUTH_SECRET=[your-secret]
SUPABASE_URL=[your-supabase-url]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

---

## Quick Diagnostic Command

Run this in Supabase to see user status:

```sql
SELECT 
  email,
  role,
  subscription_tier,
  is_active,
  two_factor_enabled,
  LENGTH(password_hash) as password_hash_length,
  last_login,
  updated_at,
  created_at
FROM users
WHERE email = 'YOUR_EMAIL_HERE';
```

---

## Contact Support

If none of these work, provide:
1. Email trying to login
2. Screenshot of browser console errors
3. Screenshot of Vercel runtime logs
4. Result of diagnostic SQL query above

