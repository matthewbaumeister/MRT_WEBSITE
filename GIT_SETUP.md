# Git Repository Setup and Deployment Guide

## Step 1: Initialize Git Repository

```bash
cd /Users/matthewbaumeister/Documents/MRT_WEBSITE
git init
git add .
git commit -m "Initial commit - Make Ready Consulting website"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and log in
2. Click the "+" icon in the top right and select "New repository"
3. Repository settings:
   - **Repository name**: `mrt-website` (or your preferred name)
   - **Description**: "Make Ready Consulting official website"
   - **Visibility**: Private (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

4. Click "Create repository"

## Step 3: Connect Local Repository to GitHub

After creating the repository on GitHub, run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/mrt-website.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign up/login (use GitHub account for easy integration)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   
5. Add Environment Variables (click "Environment Variables"):
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   EMAIL_FROM=info@make-ready-consulting.com
   EMAIL_TO=info@make-ready-consulting.com
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Step 5: Configure Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `make-ready-consulting.com`)
4. Follow the DNS configuration instructions provided by Vercel
5. Update nameservers or add DNS records as instructed

## Step 6: Set Up Email for Contact Form

### Using Gmail (Development/Small Scale)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security
   - Under "Signing in to Google", select "App passwords"
   - Generate a password for "Mail"
3. Use this app password as `SMTP_PASSWORD` in environment variables

### Using a Professional Email Service (Production)

For production, consider using:
- **SendGrid** (recommended for transactional emails)
- **Amazon SES** (cost-effective, requires AWS account)
- **Mailgun** (reliable, good pricing)
- **Postmark** (excellent deliverability)

Configure SMTP settings based on your chosen provider.

## Important Files Created

- `package.json` - Project dependencies
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `next.config.js` - Next.js configuration
- `vercel.json` - Vercel deployment configuration
- `.gitignore` - Files to exclude from Git
- `.env.local.example` - Example environment variables

## Required Environment Variables

Create a `.env.local` file (DO NOT commit this to Git):

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=info@make-ready-consulting.com
EMAIL_TO=info@make-ready-consulting.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Additional Steps After Deployment

### 1. Add Images
Place your images in the `/public/images/` directory:
- `/public/images/hero-soldier.jpg`
- `/public/images/veteran-memorial.jpg`
- `/public/images/capitol-building.jpg`
- `/public/images/program-management.jpg`
- `/public/images/ai-solutions.jpg`
- `/public/images/geospatial.jpg`
- `/public/images/it-support.jpg`
- `/public/images/data-analytics.jpg`
- `/public/images/corporate-support.jpg`
- `/public/images/consultation.jpg`
- `/public/images/team/bryan-snow.jpg`
- `/public/images/team/matt-baumeister.jpg`
- `/public/images/team/adam-ashurst.jpg`
- `/public/images/team/bryan-minor.jpg`

### 2. Update Logo
Replace the text logo in `components/Header.tsx` and `components/Footer.tsx` with your actual logo image.

### 3. Test Contact Form
After deployment, test the contact form to ensure emails are being sent correctly.

### 4. Set Up Analytics (Optional)
Consider adding:
- Google Analytics
- Vercel Analytics (built-in)
- Hotjar or similar for user behavior tracking

### 5. Security Headers
Vercel automatically adds security headers, but you can customize in `next.config.js` if needed.

## Maintenance and Updates

### Making Changes

```bash
# Make your changes in the code
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will automatically deploy changes when you push to the main branch.

### Rolling Back

In Vercel Dashboard:
1. Go to "Deployments"
2. Find the previous working deployment
3. Click "..." → "Promote to Production"

## Useful Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server locally
npm start

# Run linter
npm run lint
```

## Support and Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## Checklist Before Going Live

- [ ] All images added to `/public/images/`
- [ ] Logo updated in header and footer
- [ ] Environment variables configured in Vercel
- [ ] Contact form tested and working
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] All pages reviewed for content accuracy
- [ ] Mobile responsiveness tested
- [ ] Browser compatibility tested (Chrome, Firefox, Safari, Edge)
- [ ] Contact information verified
- [ ] Terms & Conditions and Privacy Policy reviewed by legal
- [ ] Analytics set up (if desired)
- [ ] Performance optimization verified (Lighthouse score)

