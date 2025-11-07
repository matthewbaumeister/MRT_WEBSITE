# Make Ready Consulting Website

A modern, custom-built website for Make Ready Consulting - a veteran-owned company providing strategic solutions for government success.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel

## Getting Started

### Install Dependencies

```bash
npm install
```

### Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/app                    # Next.js App Router pages
  /about               # About page
  /services            # Services page
  /products            # Product pages (Pathfinder, Matrix)
  /contact             # Contact page
  /careers             # We're Hiring page
  /terms               # Terms & Conditions
  /privacy             # Privacy Policy
  layout.tsx           # Root layout
  page.tsx             # Home page
/components            # Reusable React components
  /ui                  # UI components (Button, Card, etc.)
  Header.tsx           # Site header
  Footer.tsx           # Site footer
/public                # Static assets (images, logos)
/lib                   # Utility functions
/types                 # TypeScript type definitions
```

## Brand Colors

- **Primary Purple**: #6B46C1
- **Accent Gold**: #F59E0B
- **Dark Background**: #1a1a1a

## Deployment

This site is configured for deployment on Vercel:

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

## License

Proprietary - Make Ready Consulting

