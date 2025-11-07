# Session Timeout & Redirect Feature

## Overview
Implemented automatic session timeout with proper redirect functionality to improve security and user experience.

---

## ✅ Features Implemented

### 1. **30-Minute Session Timeout**
- Sessions now expire after **30 minutes** (changed from 30 days)
- Automatic logout when session expires
- Clean redirect to login page

### 2. **Activity-Based Auto-Logout**
- Tracks user activity (mouse, keyboard, scroll, touch, clicks)
- Automatically logs out after **30 minutes of inactivity**
- Resets timer on any user interaction
- Runs in background without impacting performance

### 3. **Smart Redirect After Login**
- **Preserves current page** when clicking "Login"
- After successful login, returns to the page you were on
- Works for:
  - Login from any page
  - Sign up flow
  - Session timeout auto-logout
  - Manual logout

### 4. **Callback URL Support**
- URL parameter: `?callbackUrl=/your/page`
- Automatically encoded/decoded
- Defaults to `/platforms` if no callback URL

---

## 🔧 How It Works

### Session Configuration
**File:** `lib/auth-config.ts`

```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 60, // 30 minutes (1800 seconds)
},
```

### Activity Tracker Component
**File:** `components/SessionTimeout.tsx`

**Tracks these events:**
- `mousedown` - Mouse clicks
- `keydown` - Keyboard input
- `scroll` - Page scrolling
- `touchstart` - Touch/mobile interaction
- `click` - Any clicks

**Timer Logic:**
1. User performs any tracked action
2. Timer resets to 30 minutes
3. If no activity for 30 minutes:
   - Logs user out
   - Redirects to: `/login?callbackUrl=<current-page>`
4. User can login and return to where they were

### Login Flow
**File:** `app/login/page.tsx`

```typescript
// Extract callbackUrl from URL parameters
const callbackUrl = searchParams.get("callbackUrl") || "/platforms";

// After successful login
window.location.href = callbackUrl; // Returns to previous page
```

### User Menu Integration
**File:** `components/UserMenu.tsx`

```typescript
// When not logged in, Login button includes current page
<Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}>
  Login
</Link>
```

---

## 🧪 Testing the Features

### Test 1: Session Expiration After 30 Minutes
1. **Login** to the site
2. **Wait 30 minutes** (or change timer to 1 minute for testing)
3. **Try to navigate** or interact
4. Should automatically logout and redirect to login
5. **Login again** - returns to page you were on

### Test 2: Activity-Based Timeout
1. **Login** to the site
2. **Leave inactive** for 30 minutes (no mouse/keyboard/scroll)
3. Should automatically logout
4. Redirected to: `/login?callbackUrl=<page-you-were-on>`
5. **Login** - returns to that page

### Test 3: Activity Resets Timer
1. **Login** to the site
2. **Wait 29 minutes**
3. **Move mouse or scroll**
4. Timer resets - you stay logged in
5. Can continue working without interruption

### Test 4: Login from Any Page
1. **Navigate** to any page (e.g., Matrix product page)
2. **Click "Login"** in header
3. URL should be: `/login?callbackUrl=/products/matrix`
4. **Login successfully**
5. **Returns to:** `/products/matrix` (where you were)

### Test 5: Sign Up Flow
1. **Navigate** to any page
2. **Click "Login"** → **Click "Sign Up"**
3. **Complete signup** and verification
4. After login, **returns** to original page

---

## 🔐 Security Benefits

### 1. **Reduced Session Window**
- 30 minutes vs 30 days significantly reduces attack window
- Limits exposure if device is left unattended
- Forces re-authentication for security

### 2. **Activity-Based Logout**
- Automatically protects inactive sessions
- Prevents unauthorized access to unattended devices
- Industry standard security practice

### 3. **No Session Hijacking Risk**
- Short-lived sessions expire quickly
- Stolen tokens become useless after 30 minutes
- Reduces risk of session replay attacks

---

## ⚙️ Configuration

### Change Timeout Duration

**For Session:**
```typescript
// lib/auth-config.ts
session: {
  maxAge: 30 * 60, // 30 minutes (in seconds)
}
```

**For Activity Tracker:**
```typescript
// components/SessionTimeout.tsx
const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes (in milliseconds)
```

**Common Durations:**
```typescript
// 15 minutes
maxAge: 15 * 60
TIMEOUT_DURATION = 15 * 60 * 1000

// 1 hour
maxAge: 60 * 60
TIMEOUT_DURATION = 60 * 60 * 1000

// 4 hours
maxAge: 4 * 60 * 60
TIMEOUT_DURATION = 4 * 60 * 60 * 1000
```

### Disable Activity Tracker (Not Recommended)

Remove from `app/layout.tsx`:
```typescript
// Remove this line:
<SessionTimeout />
```

### Exclude Specific Pages from Activity Tracking

Modify `components/SessionTimeout.tsx`:
```typescript
// Add path checks
if (pathname === "/public-page" || pathname.startsWith("/docs")) {
  return; // Don't track these pages
}
```

---

## 📋 Files Modified

### Core Changes:
1. `lib/auth-config.ts` - Changed session maxAge to 30 minutes
2. `components/SessionTimeout.tsx` - NEW: Activity tracker component
3. `app/layout.tsx` - Added SessionTimeout component
4. `components/UserMenu.tsx` - Added callbackUrl to login link
5. `app/login/page.tsx` - Added callbackUrl redirect logic
6. `app/signup/page.tsx` - Added callbackUrl redirect logic

---

## 🐛 Troubleshooting

### Issue: Getting logged out too quickly
**Cause:** Activity tracker timeout is too short  
**Fix:** Increase `TIMEOUT_DURATION` in `SessionTimeout.tsx`

### Issue: Not being logged out after 30 minutes
**Cause:** Recent activity is resetting the timer  
**Fix:** This is expected behavior - timer resets on activity

### Issue: Not returning to correct page after login
**Cause:** callbackUrl not being passed correctly  
**Fix:** Check browser console for callbackUrl value, ensure it's encoded

### Issue: Session persists after logout
**Cause:** Browser cache or cookies  
**Fix:** Hard refresh (Cmd+Shift+R) or clear cookies

---

## 💡 User Experience Flow

### Example: User on Matrix Page

**Step 1: User navigates to Matrix page**
- URL: `/products/matrix`
- User browses information

**Step 2: User wants to try it**
- Clicks "Try It Now" → redirects to login
- URL: `/login?callbackUrl=/products/matrix`

**Step 3: User logs in**
- Enters credentials
- Clicks "Sign In"
- Automatically redirected to: `/products/matrix`

**Step 4: After 30 minutes of inactivity**
- SessionTimeout detects no activity
- Logs user out
- Redirects to: `/login?callbackUrl=/products/matrix`

**Step 5: User returns and logs in**
- Goes back to `/products/matrix` where they left off
- Can continue working

---

## 🎯 Best Practices

### For Users:
1. **Save your work frequently** - sessions expire after 30 minutes
2. **Stay active** - any interaction resets the timer
3. **Don't worry about losing your place** - login returns you to where you were

### For Admins:
1. **Adjust timeout** based on your security requirements
2. **Monitor user feedback** about session length
3. **Consider extending** for admin users if needed
4. **Don't disable** activity tracking (security risk)

---

## 🔄 Future Enhancements

Potential improvements:
- [ ] Warning notification 5 minutes before logout
- [ ] Option to extend session without full login
- [ ] Remember me" checkbox for longer sessions
- [ ] Different timeout durations per role
- [ ] Activity log for security auditing
- [ ] Configurable timeout in admin settings

---

**Status:** ✅ Fully Implemented  
**Last Updated:** November 7, 2025  
**Security Level:** Industry Standard  
**User Experience:** Seamless

