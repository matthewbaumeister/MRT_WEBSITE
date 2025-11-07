# Admin Users Page - RLS Fix

## Problem
The admin users page was unable to load users from Supabase due to Row-Level Security (RLS) policies blocking client-side queries.

## Root Cause
The admin users page was using `getSupabaseClient()` (anon key) to query the users table directly from the browser. RLS policies blocked this because:
1. Client-side queries use the anonymous key
2. RLS policies don't grant anonymous users access to read all users
3. Even with session data, the anon client can't bypass RLS

## Solution Applied
Created API routes that use the **service role key** to bypass RLS:

### New API Routes Created:

1. **`/api/users/list`** - Fetch all users
   - Uses `getSupabaseServiceClient()` (bypasses RLS)
   - Requires admin session
   - Returns all user data

2. **`/api/users/toggle-status`** - Activate/Deactivate users
   - Uses service role client
   - Requires admin session
   - Updates `is_active` field

3. **`/api/users/toggle-2fa`** - Enable/Disable 2FA
   - Uses service role client
   - Requires admin session
   - Updates `two_factor_enabled` field

### Updated Admin Users Page:
- Now fetches users via `/api/users/list` API route
- Toggles user status via `/api/users/toggle-status`
- Toggles 2FA via `/api/users/toggle-2fa`
- All operations bypass RLS using service role key

## How to Test

### Step 1: Login as Admin
1. Go to: https://www.makereadytech.com/login
2. Enter credentials:
   - Email: `admin@make-ready-consulting.com`
   - Password: `ChangeThisPassword123!`
3. Click "Sign In"

### Step 2: Access Admin Users Page
1. After login, go to: https://www.makereadytech.com/admin/users
2. OR click "MRT Platforms" → "User Management"

### Step 3: Verify Users Load
You should see:
- **Total Users count** at the top
- **Table with all users** from Supabase
- **Each user showing:**
  - Name (first + last)
  - Email
  - Role badge (Admin/Employee/Client)
  - Status (Active/Inactive)
  - 2FA status
  - Last login date
  - Action buttons

### Step 4: Test User Management
Try these actions:
- **Change Role:** Select a different role from dropdown
- **Toggle 2FA:** Click "Enable 2FA" or "Disable 2FA"
- **Toggle Status:** Click "Activate" or "Deactivate"

## Checking Users in Supabase

### Run this SQL in Supabase SQL Editor:
```sql
SELECT 
  id,
  first_name,
  last_name,
  email,
  role,
  is_active,
  two_factor_enabled,
  created_at,
  last_login
FROM users
ORDER BY created_at DESC;
```

This will show you how many users exist and their details.

## Expected Users

Based on the setup, you should have at least:

1. **Admin User**
   - Email: `admin@make-ready-consulting.com`
   - Role: admin
   - Status: Active

2. **Any users created via signup**
   - Will show here once verified

## Troubleshooting

### Issue: Still can't see users
**Check:**
1. Are you logged in as admin?
2. Check Vercel logs for API errors
3. Check browser console for errors
4. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel

### Issue: "Unauthorized" error
**Fix:**
- Make sure you're logged in with admin role
- Check session is valid (look at browser console)

### Issue: "Failed to fetch users"
**Fix:**
- Check Vercel environment variables
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check Supabase table exists with correct schema

## Environment Variables Required

Make sure these are set in Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key ✅
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key ✅
```

## Security Notes

- All API routes check for admin session
- Service role key is only used server-side
- Client never has access to service role key
- RLS still protects against other vectors
- All changes are logged in Vercel function logs

## What Changed

### Files Modified:
1. `app/admin/users/page.tsx` - Updated to use API routes
2. `app/api/users/list/route.ts` - NEW: Fetch all users
3. `app/api/users/toggle-status/route.ts` - NEW: Toggle user status
4. `app/api/users/toggle-2fa/route.ts` - NEW: Toggle 2FA

### Files Created:
- `SUPABASE_ADMIN_USER_ACCESS.sql` - SQL script to check/fix RLS policies (optional)

## Next Steps

1. **Login and test:** https://www.makereadytech.com/login
2. **Go to users page:** https://www.makereadytech.com/admin/users
3. **Verify all 3 users show** (or however many you have)
4. **Test role changes**
5. **Test 2FA toggles**

---

**Status:** ✅ Fixed  
**Last Updated:** November 7, 2025  
**Deployment:** Live on production

