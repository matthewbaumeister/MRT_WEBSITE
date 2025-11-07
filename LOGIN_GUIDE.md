# Matrix Login & Admin Access Guide

## What's Been Set Up

Your website now has a complete authentication system with:
- ✅ Login link in main header navigation
- ✅ "Try It Now" button on Matrix page → Login
- ✅ Admin dashboard for managing submissions
- ✅ Protected Matrix tool access
- ✅ Session management (30-day sessions)
- ✅ 2FA ready (can be enabled)

---

## How to Access Matrix Tool

### Option 1: Header Navigation
1. Click **"Login"** in the header (top right)
2. Enter credentials
3. Access Matrix dashboard

### Option 2: Matrix Product Page
1. Go to **Products → Matrix**
2. Click **"Try It Now"** button
3. Enter credentials
4. Access Matrix dashboard

---

## Current Admin Login Credentials

**Login URL**: https://makereadytech.com/admin/login

**Email**: `admin@make-ready-consulting.com`  
**Password**: `ChangeThisPassword123!`

**IMPORTANT**: Change this password after first login!

---

## What You Can Do After Login

### Admin Dashboard (`/admin/dashboard`)
- View system status
- Access quick actions
- Monitor submissions

### Contact Submissions (`/admin/submissions`)
- View all contact form inquiries
- See ticket numbers
- Track status (Open → In Progress → Closed)
- Filter by status
- Reply directly via email
- Manage customer communications

---

## How Login Works

### Flow:
1. User clicks "Login" or "Try It Now"
2. Redirected to login page
3. Enter email + password
4. (Optional: 2FA code if enabled)
5. Redirected to admin dashboard
6. Can access all protected routes

### Protected Routes:
- `/admin/dashboard` - Main admin area
- `/admin/submissions` - View tickets
- Any future admin features

### Session Management:
- Sessions last 30 days
- Auto-logout after expiration
- Secure JWT tokens
- Can logout anytime

---

## Next Steps for Production

### 1. Change Admin Password

**Method A: Create New User in Database**
When you add Supabase user management:
- Create proper admin accounts
- Store in database (not in code)
- Each team member gets their own account

**Method B: Update Current Password**
Run this locally:
```bash
cd /Users/matthewbaumeister/Documents/MRT_WEBSITE
npx ts-node scripts/create-admin.ts
```
Copy the new hashed password and update `lib/auth-config.ts`

### 2. Enable 2FA (Optional but Recommended)

For extra security:
1. Login to admin dashboard
2. Go to settings (when feature is added)
3. Enable 2FA
4. Scan QR code with Google Authenticator
5. All future logins require 6-digit code

### 3. Add More Users (Future)

When you need multiple team members to access:
- Create user management system in Supabase
- Add role-based permissions (admin, viewer, editor)
- Each person gets their own login
- Track who made what changes

### 4. Add Matrix Tool Dashboard (Next Phase)

After login, users should access:
- Matrix market research tool
- Search government contracts
- View competitive intelligence
- Generate reports
- Export data

**Currently**: Login works, redirects to admin dashboard  
**Future**: Build Matrix-specific dashboard with research tools

---

## Testing Checklist

### Test Login System:

1. ✅ **Visit**: https://makereadytech.com/admin/login
2. ✅ **Try wrong password** - Should see error
3. ✅ **Try correct credentials** - Should login successfully
4. ✅ **Check session** - Refresh page, should stay logged in
5. ✅ **Logout** - Click logout, should redirect to login page
6. ✅ **Try accessing admin without login** - Should redirect to login

### Test Matrix Access:

1. ✅ **Visit**: https://makereadytech.com/products/matrix
2. ✅ **Click "Try It Now"** - Should go to login
3. ✅ **Login** - Should redirect to dashboard
4. ✅ **Access Matrix features** (when built)

### Test Header Login:

1. ✅ **Click "Login"** in header - Should go to login page
2. ✅ **After login** - Login link could change to "Dashboard" or show user name

---

## Troubleshooting

### Can't Login:
- **Error "Invalid credentials"**: Check email is exactly `admin@make-ready-consulting.com`
- **Error "NEXTAUTH_SECRET not found"**: Verify environment variables in Vercel
- **Page keeps redirecting**: Clear browser cookies/cache
- **2FA not working**: Make sure device clock is synced

### Session Expires Too Quickly:
- Default is 30 days
- Check browser privacy settings
- Make sure cookies are enabled

### Forgot Password:
- Currently only one admin account
- Need to regenerate password using `create-admin.ts` script
- Or create password reset feature (future enhancement)

---

## Security Best Practices

✅ **Change default password immediately**  
✅ **Enable 2FA for production**  
✅ **Use strong passwords** (16+ characters, mixed case, numbers, symbols)  
✅ **Don't share login credentials**  
✅ **Review login activity regularly**  
✅ **Logout when done** (especially on shared computers)  
✅ **Keep environment variables secure**  

---

## Future Enhancements

### Phase 1: User Management
- Multiple admin accounts
- User roles (admin, editor, viewer)
- User invitation system
- Password reset via email

### Phase 2: Matrix Tool Integration
- Market research dashboard
- Contract search and filtering
- Competitive intelligence views
- Report generation
- Data export features

### Phase 3: Advanced Features
- Audit logs (who did what, when)
- API keys for external access
- Webhook notifications
- Advanced analytics
- Custom user permissions

---

## Support

If you have issues:
1. Check environment variables in Vercel
2. Review Vercel runtime logs for errors
3. Verify Supabase is connected
4. Test in incognito mode (rules out cache issues)

Current admin email: admin@make-ready-consulting.com  
Need help? Contact Matt or Bryan for technical support.

