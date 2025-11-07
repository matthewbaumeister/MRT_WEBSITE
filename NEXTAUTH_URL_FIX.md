# NextAuth Critical Environment Variables

## Required in Vercel:

1. **NEXTAUTH_URL**
   - Value: `https://makereadytech.com`
   - OR: `https://www.makereadytech.com`

2. **NEXTAUTH_SECRET**
   - Generate with: `openssl rand -base64 32`
   - OR use: `Kw8vN3xP9rT2yU5zQ7mL4jH6gF1sA0bC8dE3fG9hI2jK5lM7nO4pQ1rS6tU8vW`

## Steps to Fix:

1. Go to Vercel → Your Project → Settings → Environment Variables

2. Add/verify these variables:
   ```
   NEXTAUTH_URL=https://www.makereadytech.com
   NEXTAUTH_SECRET=Kw8vN3xP9rT2yU5zQ7mL4jH6gF1sA0bC8dE3fG9hI2jK5lM7nO4pQ1rS6tU8vW
   ```

3. Redeploy

## The Problem:

Without these, NextAuth returns HTML error pages instead of JSON, causing:
- `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`
- Redirect to `/api/auth/error`
- Login completely broken

