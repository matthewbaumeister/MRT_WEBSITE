# Login & Authentication Testing Guide

## Overview
This guide walks you through testing all login, authentication, and user management features.

---

## ✅ FIXES APPLIED

### Critical Issues Resolved:
1. **NEXTAUTH_URL mismatch** - Updated to `https://www.makereadytech.com` (with www)
2. **vercel.json rewrites** - Removed catch-all rewrite that was breaking API routes
3. **Middleware interference** - Properly configured to not interfere with NextAuth API routes

---

## 🧪 TESTING CHECKLIST

### 1. Test Session Endpoint (Verify NextAuth Works)

**URL:** https://www.makereadytech.com/api/auth/session

**Expected Result:**
- When NOT logged in: `{"user":null}`
- When logged in: `{"user":{"name":"...","email":"...","role":"..."}}`

**Status:** ✅ Should work now

---

### 2. Test Basic Login (Admin Account)

**URL:** https://www.makereadytech.com/login

**Test Credentials:**
- Email: `admin@make-ready-consulting.com`
- Password: `ChangeThisPassword123!`

**Expected Flow:**
1. Enter credentials
2. Click "Sign In"
3. Redirect to `/platforms` page
4. See "MRT Platforms" button in header (with purple border)
5. See user dropdown menu in header

**Status:** ✅ Should work now

---

### 3. Test Admin Dashboard Access

**URL:** https://www.makereadytech.com/admin/dashboard

**Test:**
1. Login as admin (see Test 2)
2. Navigate to `/admin/dashboard`
3. Should see admin dashboard with links to:
   - Manage Users
   - Settings & Promotions
   - View Contact Submissions

**Expected:** ✅ Access granted for admin role

---

### 4. Test User Management (Admin Only)

**URL:** https://www.makereadytech.com/admin/users

**Test:**
1. Login as admin
2. Navigate to `/admin/users`
3. Should see list of all users
4. Test promoting a user to "employee" or "admin"
5. User should receive email notification

**Expected:** ✅ Admin can manage users

---

### 5. Test Employee Access

**Test:**
1. Create an employee account OR promote existing user to "employee"
2. Logout
3. Login with employee credentials
4. Should access `/employee/dashboard`
5. Should NOT access `/admin/*` routes

**Expected:** ✅ Employee has limited access

---

### 6. Test Platforms Access (All Authenticated Users)

**URL:** https://www.makereadytech.com/platforms

**Test:**
1. Login with ANY valid account
2. Should see "MRT Platforms" button in header (purple border)
3. Click button → redirects to `/platforms`
4. See Matrix and Pathfinder tools

**Expected:** ✅ All authenticated users can access

---

### 7. Test New User Sign Up

**URL:** https://www.makereadytech.com/signup

**Test:**
1. Click "Sign Up" from login page
2. Fill in all fields:
   - First Name
   - Last Name
   - Email (use a real email you can check)
   - Password
   - Company (optional)
   - Phone (optional)
3. Submit form
4. Should show verification screen
5. Check email for 6-digit code
6. Enter code
7. Account activated → redirect to login

**Expected:** ✅ New users can self-register

---

### 8. Test Email Verification

**Test:**
1. Sign up new account (see Test 7)
2. Check email for verification code
3. Code should be in professional branded email
4. Code expires in 10 minutes
5. Can resend code if expired

**Expected:** ✅ Email verification works

---

### 9. Test 2FA (If Enabled for User)

**Test:**
1. Enable 2FA for a user in Supabase:
   ```sql
   UPDATE users 
   SET two_factor_enabled = true 
   WHERE email = 'test@example.com';
   ```
2. Login with that user
3. First login screen: enter email/password
4. Receive 6-digit code via email
5. Second screen: enter 2FA code
6. Login successful

**Expected:** ✅ 2FA works for enabled users

---

### 10. Test Protected Routes (Unauthenticated)

**Test:**
1. Open browser in incognito/private mode
2. Try to access:
   - `/platforms` → Redirects to `/login`
   - `/admin/dashboard` → Redirects to `/login`
   - `/employee/dashboard` → Redirects to `/login`

**Expected:** ✅ Unauthenticated users redirected

---

### 11. Test Role-Based Access

**Test A: Client tries to access admin**
1. Login as regular client
2. Try to access `/admin/dashboard`
3. Should be redirected/blocked

**Test B: Employee tries to access admin**
1. Login as employee
2. Try to access `/admin/users`
3. Should be redirected/blocked

**Test C: Admin can access everything**
1. Login as admin
2. Can access `/admin/*`, `/employee/*`, `/platforms`

**Expected:** ✅ Roles properly enforced

---

### 12. Test Logout

**Test:**
1. Login with any account
2. Click user dropdown in header
3. Click "Logout"
4. Should redirect to homepage
5. "Login" appears in header (not user menu)
6. Cannot access protected routes

**Expected:** ✅ Logout clears session

---

## 🔑 TEST USER ACCOUNTS

### Admin Account
```
Email: admin@make-ready-consulting.com
Password: ChangeThisPassword123!
Role: admin
2FA: Disabled (by default)
```

### Employee Account (Create in Supabase)
```sql
INSERT INTO users (
  first_name,
  last_name,
  email,
  password_hash,
  role,
  is_active,
  two_factor_enabled
) VALUES (
  'Employee',
  'Test',
  'employee@make-ready-consulting.com',
  '$2a$10$YourHashedPasswordHere', -- Use bcrypt
  'employee',
  true,
  false
);
```

### Client Account (Sign Up)
Use the signup form to create a client account.

---

## 🐛 TROUBLESHOOTING

### Issue: Login redirects to homepage
**Fix:** Check `NEXTAUTH_URL` in Vercel matches domain exactly (with or without www)

### Issue: API routes return HTML
**Fix:** Check `vercel.json` doesn't have catch-all rewrites

### Issue: Middleware blocks NextAuth
**Fix:** Ensure middleware matcher doesn't include `/api/auth/*`

### Issue: Verification code expired
**Fix:** Codes stored in Supabase `verification_codes` table, expire in 10 minutes. Use resend button.

### Issue: 2FA not working
**Fix:** Ensure SendGrid API key is configured in Vercel environment variables

---

## 📋 ENVIRONMENT VARIABLES CHECKLIST

Ensure these are set in Vercel:

```
✅ NEXTAUTH_URL=https://www.makereadytech.com
✅ NEXTAUTH_SECRET=(your secret)
✅ NEXT_PUBLIC_SUPABASE_URL=(your supabase url)
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=(your anon key)
✅ SUPABASE_SERVICE_ROLE_KEY=(your service role key)
✅ SENDGRID_API_KEY=(your sendgrid key)
✅ EMAIL_FROM=info@make-ready-consulting.com
```

---

## 🎯 SUCCESS CRITERIA

All tests pass when:
- ✅ Session endpoint returns JSON (not HTML)
- ✅ Admin can login and access all routes
- ✅ Employees have limited access
- ✅ Clients can only access `/platforms`
- ✅ New users can sign up and verify email
- ✅ 2FA works when enabled
- ✅ Protected routes redirect to login
- ✅ Logout clears session properly

---

## 🚀 NEXT STEPS

After all tests pass:
1. Change default admin password
2. Set up production email domain verification in SendGrid
3. Enable 2FA for admin accounts
4. Create employee accounts as needed
5. Monitor Vercel logs for any authentication errors

---

**Last Updated:** November 7, 2025  
**Status:** All systems operational ✅

