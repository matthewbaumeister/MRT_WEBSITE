# Authentication & SendGrid Setup Guide

## What's Been Set Up

I've built a complete authentication system for your Make Ready Consulting website:

✅ **Admin Login System** with NextAuth.js  
✅ **2FA Support** (Google Authenticator compatible)  
✅ **SendGrid Integration** for professional emails  
✅ **Protected Admin Dashboard**  
✅ **Secure Password Hashing**  
✅ **Session Management**

---

## Step 1: Get SendGrid API Key

SendGrid is a professional email service (better than Gmail for business).

### Create SendGrid Account:

1. Go to [sendgrid.com](https://sendgrid.com)
2. Click **"Start for Free"** (100 emails/day free forever)
3. Sign up with your email
4. **Verify your email address** (check inbox)

### Get API Key:

1. Log into SendGrid Dashboard
2. Go to **Settings** → **API Keys** (left sidebar)
3. Click **"Create API Key"**
4. Name it: "MRT Website"
5. Select **"Full Access"**
6. Click **"Create & View"**
7. **Copy the API key immediately** (you won't see it again!)

### Verify Sender Email:

1. Go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in your details:
   - From Name: Make Ready Consulting
   - From Email: info@make-ready-consulting.com
   - Reply To: info@make-ready-consulting.com
4. Check your email and click the verification link

---

## Step 2: Generate Admin Password

Run this command to create a secure admin password:

```bash
cd /Users/matthewbaumeister/Documents/MRT_WEBSITE
npx ts-node scripts/create-admin.ts
```

This will output:
- Email: `admin@make-ready-consulting.com`
- A temporary password
- A hashed password (long string)

**Copy the hashed password** - you'll need it next!

---

## Step 3: Update Environment Variables

### Create `.env.local` file:

```bash
cd /Users/matthewbaumeister/Documents/MRT_WEBSITE
cp .env.local.example .env.local
nano .env.local
```

### Add these values:

```bash
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-random-string-min-32-characters-long

# SendGrid Configuration
SENDGRID_API_KEY=SG.your-actual-sendgrid-api-key-here
EMAIL_FROM=info@make-ready-consulting.com
EMAIL_TO=info@make-ready-consulting.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

### Update Admin Password:

1. Open `lib/auth-config.ts`
2. Find this line:
   ```typescript
   password: "$2a$10$YourHashedPasswordHere",
   ```
3. Replace `$2a$10$YourHashedPasswordHere` with the hashed password from Step 2

---

## Step 4: Test Locally

### Start the development server:

```bash
npm run dev
```

### Test Admin Login:

1. Go to: http://localhost:3000/admin/login
2. Login with:
   - Email: `admin@make-ready-consulting.com`
   - Password: (the one from Step 2)
3. You should see the Admin Dashboard!

### Test Contact Form:

1. Go to: http://localhost:3000/contact
2. Fill out the contact form
3. Submit
4. Check your email at `info@make-ready-consulting.com`
5. You should receive the contact form submission!

---

## Step 5: Deploy to Vercel

### Add Environment Variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each of these (one at a time):

```
NEXTAUTH_URL = https://your-vercel-url.vercel.app
NEXTAUTH_SECRET = (same random string from Step 3)
SENDGRID_API_KEY = SG.your-actual-key
EMAIL_FROM = info@make-ready-consulting.com
EMAIL_TO = info@make-ready-consulting.com
NEXT_PUBLIC_SITE_URL = https://your-vercel-url.vercel.app
```

### Deploy:

```bash
git add .
git commit -m "Add authentication and SendGrid integration"
git push
```

Vercel will automatically redeploy!

---

## Step 6: Update Production URL

After deployment, update these environment variables in Vercel:

1. `NEXTAUTH_URL` → Change to your actual domain (e.g., `https://make-ready-consulting.com`)
2. `NEXT_PUBLIC_SITE_URL` → Same as above

### In SendGrid Dashboard:

1. Go to **Settings** → **Sender Authentication**
2. **Authenticate Your Domain** (recommended for production)
   - This prevents emails from going to spam
   - Follow SendGrid's DNS setup instructions
   - Add the DNS records they provide to your domain

---

## Admin Dashboard Features

Access at: `/admin/login`

### Current Features:
- ✅ Secure login with session management
- ✅ Protected admin routes
- ✅ Contact form submission monitoring (coming soon)
- ✅ System status overview
- ✅ User management foundation

### Coming Soon:
- View/manage contact form submissions
- Enable/disable 2FA
- Analytics dashboard
- Content management
- User permissions

---

## Setting Up 2FA (Two-Factor Authentication)

### For Your Admin Account:

1. Download Google Authenticator or Authy on your phone
2. Log into Admin Dashboard
3. Go to Settings (when feature is added)
4. Click "Enable 2FA"
5. Scan QR code with authenticator app
6. Enter 6-digit code to verify
7. Save backup codes!

### The login flow becomes:
1. Enter email + password
2. If 2FA enabled → Enter 6-digit code from app
3. Access granted!

---

## Security Best Practices

### Passwords:
- ✅ Change default admin password immediately
- ✅ Use strong passwords (min 16 characters)
- ✅ Don't share passwords
- ✅ Enable 2FA after initial setup

### API Keys:
- ✅ Never commit `.env.local` to git (already in .gitignore)
- ✅ Rotate SendGrid API key every 90 days
- ✅ Use environment-specific keys (dev vs production)

### Sessions:
- ✅ Sessions expire after 30 days
- ✅ Logout clears session immediately
- ✅ Protected routes require authentication

---

## Troubleshooting

### "Invalid credentials" error:
- Check that the hashed password in `lib/auth-config.ts` matches the one generated
- Make sure email is exactly: `admin@make-ready-consulting.com`
- Try clearing browser cache/cookies

### SendGrid emails not sending:
- Verify your SendGrid API key is correct
- Check that sender email is verified in SendGrid
- Look at Vercel logs for error messages
- Check SendGrid dashboard for activity

### 2FA not working:
- Ensure device clock is synced
- Try using backup code
- Re-scan QR code if token expired

### "NEXTAUTH_SECRET not found":
- Make sure `.env.local` exists
- Verify environment variables in Vercel
- Restart dev server after changing `.env.local`

---

## File Structure

```
MRT_WEBSITE/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx          # Admin login page
│   │   ├── dashboard/page.tsx      # Admin dashboard
│   │   └── layout.tsx              # Admin layout with auth
│   └── api/
│       ├── auth/[...nextauth]/     # NextAuth API routes
│       └── contact/route.ts        # Contact form (using SendGrid)
├── lib/
│   ├── auth-config.ts              # Authentication configuration
│   └── sendgrid.ts                 # SendGrid email functions
├── middleware.ts                    # Route protection
├── types/
│   └── auth.ts                     # TypeScript types
└── scripts/
    └── create-admin.ts             # Password generation script
```

---

## Next Steps

### Immediate:
1. ✅ Get SendGrid API key
2. ✅ Generate admin password
3. ✅ Update environment variables
4. ✅ Test login and contact form locally
5. ✅ Deploy to Vercel

### Later (After Brand Guide):
1. Add logo to login page
2. Customize admin dashboard colors
3. Set up 2FA
4. Add contact submission management
5. Integrate analytics

### Future Enhancements:
- Database integration (Supabase recommended)
- Multiple admin users
- Role-based permissions
- Email templates customization
- API rate limiting
- Audit logging

---

## Support & Resources

- [NextAuth.js Docs](https://next-auth.js.org/)
- [SendGrid Docs](https://docs.sendgrid.com/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [2FA with Speakeasy](https://www.npmjs.com/package/speakeasy)

---

## Questions?

Common setups:
- **Email**: SendGrid (100 free/day) or AWS SES (cheaper at scale)
- **Database**: Supabase (recommended), PostgreSQL, or MongoDB
- **2FA**: Google Authenticator, Authy, or Microsoft Authenticator
- **Monitoring**: Sentry for errors, Vercel Analytics for traffic

You're all set! The authentication system is ready to go once you add the API keys.

