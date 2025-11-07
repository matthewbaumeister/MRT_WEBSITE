# Make Ready Consulting - Deployment Checklist

## Quick Start Guide

### 1. Install Dependencies
```bash
cd /Users/matthewbaumeister/Documents/MRT_WEBSITE
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your actual email credentials
```

### 3. Test Locally
```bash
npm run dev
# Open http://localhost:3000 in your browser
```

### 4. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit - Make Ready Consulting website"
```

### 5. Create GitHub Repository
- Go to GitHub.com and create a new repository named `mrt-website`
- Make it Private (recommended for now)
- DO NOT initialize with README (we already have files)

### 6. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/mrt-website.git
git branch -M main
git push -u origin main
```

### 7. Deploy to Vercel
- Go to vercel.com and sign up/login with GitHub
- Click "Add New..." → "Project"
- Import your `mrt-website` repository
- Add environment variables (see below)
- Click "Deploy"

## Required Environment Variables for Vercel

Add these in Vercel Dashboard under Settings → Environment Variables:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
EMAIL_FROM=info@make-ready-consulting.com
EMAIL_TO=info@make-ready-consulting.com
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → App Passwords
3. Generate password for "Mail"
4. Use this password for `SMTP_PASSWORD`

## What You Need to Do Next

### Immediate (Before Testing):
- [ ] Run `npm install`
- [ ] Create `.env.local` file with email credentials
- [ ] Test site locally with `npm run dev`

### Before Deployment:
- [ ] Download images from Wix (see IMAGES_NEEDED.md)
- [ ] Add images to `/public/images/` directory
- [ ] Replace logo placeholder in Header.tsx with actual logo
- [ ] Update Footer.tsx with actual logo
- [ ] Test contact form locally

### Git & Deployment:
- [ ] Initialize git repository
- [ ] Create GitHub account (if needed)
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Create Vercel account
- [ ] Deploy to Vercel
- [ ] Add environment variables in Vercel
- [ ] Test contact form on live site

### After Deployment:
- [ ] Configure custom domain (make-ready-consulting.com)
- [ ] Test all pages on live site
- [ ] Test contact form on live site
- [ ] Test on mobile devices
- [ ] Review Terms & Conditions with legal team
- [ ] Review Privacy Policy with legal team
- [ ] Add Google Analytics (optional)
- [ ] Submit to Google Search Console

## File Structure

```
MRT_WEBSITE/
├── app/                    # All pages (Next.js App Router)
│   ├── about/             # About page
│   ├── api/contact/       # Contact form API
│   ├── contact/           # Contact page
│   ├── privacy/           # Privacy Policy
│   ├── products/          # Product pages
│   │   ├── matrix/
│   │   └── pathfinder/
│   ├── services/          # Services page
│   ├── terms/             # Terms & Conditions
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── ContactForm.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── ServiceCard.tsx
├── lib/                   # Utility functions
│   └── services.ts
├── public/               # Static assets
│   └── images/          # Add your images here!
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── vercel.json
├── .gitignore
├── README.md
├── SITE_STRUCTURE.md     # Full site documentation
├── GIT_SETUP.md          # Detailed git/deployment guide
├── IMAGES_NEEDED.md      # List of all images needed
└── DEPLOYMENT_CHECKLIST.md  # This file
```

## Pages Included

1. **Home** (`/`) - Hero, services, veteran section, contact form
2. **Services** (`/services`) - All service offerings
3. **Pathfinder** (`/products/pathfinder`) - Product page with demo request
4. **Matrix** (`/products/matrix`) - Product page with demo request
5. **About** (`/about`) - Mission and team members
6. **Contact** (`/contact`) - Contact form and information
7. **Terms & Conditions** (`/terms`) - Legal terms
8. **Privacy Policy** (`/privacy`) - Privacy information

Note: "We're Hiring" page was removed per your request.

## Features Implemented

- Modern, responsive design (mobile-first)
- Purple & Gold brand colors
- Dark navigation header with dropdown for products
- Working contact form with email notifications
- Service cards with hover effects
- Team member profiles
- SEO-friendly pages with metadata
- Veteran-owned branding prominent
- Professional government contractor aesthetic

## Technology Stack

- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Email**: Nodemailer
- **Deployment**: Vercel
- **Version Control**: Git + GitHub

## Support Documents

- `SITE_STRUCTURE.md` - Complete site architecture and content
- `GIT_SETUP.md` - Detailed git and deployment instructions
- `IMAGES_NEEDED.md` - List of all images to download from Wix
- `README.md` - Project overview and commands

## Common Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint

# Git
git status          # Check status
git add .           # Stage all changes
git commit -m "msg" # Commit changes
git push            # Push to GitHub
```

## Getting Help

If you run into issues:
1. Check the error message carefully
2. Refer to the detailed guides (GIT_SETUP.md, etc.)
3. Make sure all environment variables are set
4. Ensure images are in the correct directories
5. Clear browser cache and try again

## Notes

- The site uses purple (#6B46C1) and gold (#F59E0B) for brand colors
- All styling follows the Scale AI aesthetic as requested
- No emojis used anywhere (per your preference)
- Contact form requires email configuration to work
- Images will show placeholders until you add actual files

