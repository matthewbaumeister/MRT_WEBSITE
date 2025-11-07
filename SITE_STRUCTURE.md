# Make Ready Consulting - Website Structure

## Brand Information
- **Company**: Make Ready Consulting / Make Ready Tech
- **Colors**: Purple and Gold
- **Style**: Professional, Government-focused, Veteran-owned
- **Target Audience**: US Government (DoD, Intelligence Community)

## Site Architecture

### Navigation Structure

#### Main Header Navigation
- Home
- Services
- Our Products (Dropdown)
  - Pathfinder
  - Matrix
- About
- Contact
- We're Hiring

#### Footer Navigation
- Home
- About
- Services
- Terms & Conditions
- Privacy Policy

### Pages Overview

---

## 1. HOME PAGE (`/`)

### Hero Section
- Background Image: Military/soldier themed
- Headline: "Strategic Solutions for Government Success"
- CTA Button: "LEARN MORE"

### Veteran Owned Section
- Image: Veteran memorial/military service
- Headline: "Proudly Veteran Owned And Operated"
- CTA Button: "OUR TEAM"
- Subtext: "Providing the US Government solutions and services to better prepare for tomorrows challenges"

### Services Overview (6 Cards)
1. **Program Management**
   - Image: Business meeting/collaboration
   - Headline: "Driving success through expert program management."
   - Description: Full program management services

2. **Artificial Intelligence**
   - Image: AI/tech themed
   - Headline: "Transforming businesses with cutting-edge AI solutions."
   - Description: AI and machine learning services

3. **Geospatial Science**
   - Image: Geospatial intelligence visualization
   - Headline: "Unlocking insights with advanced geospatial analysis."
   - Description: GEOINT services

4. **IT Support**
   - Image: Technology/servers
   - Headline: "Reliable IT support to keep your business running smoothly."
   - Description: Comprehensive IT solutions

5. **Data Analytics**
   - Image: Data visualization
   - Headline: "Turning data into actionable insights."
   - Description: Data analysis and visualization

6. **Corporate Support**
   - Image: Business operations
   - Headline: "Empowering your business with expert corporate support."
   - Description: Administrative and operational support

### Contact Section
- Background: Capitol Building image
- Headline: "Ready to connect?"
- Contact Form:
  - First name
  - Last name
  - Email*
  - Subject*
  - Message*
  - Submit Button: "Let's Talk"

---

## 2. SERVICES PAGE (`/services`)

### Hero Section
- Headline: "SERVICE OFFERINGS"
- Subheading: "At Make Ready Tech, we transform challenges into opportunities through cutting-edge technology and expert support."

### Service Cards (Same 6 as homepage but larger/expanded)
- Program Management
- Artificial Intelligence
- IT Support
- Geospatial Science
- Corporate Support
- Data Analytics

### Call to Action
- Button: "Enquire Now"
- Link to contact page

---

## 3. PATHFINDER PAGE (`/products/pathfinder`)

### Hero Section
- Product name: "Pathfinder"
- Description: Tool/product overview

### Features Section
- Key capabilities
- Use cases
- Benefits

### Demo/Contact Section
- Request demo form
- Product inquiry

**Note**: Need more detailed content about what Pathfinder is/does

---

## 4. MATRIX PAGE (`/products/matrix`)

### Hero Section
- Product name: "Matrix"
- Description: Tool/product overview

### Features Section
- Key capabilities
- Use cases
- Benefits

### Demo/Contact Section
- Request demo form
- Product inquiry

**Note**: Need content about what Matrix is/does

---

## 5. ABOUT PAGE (`/about`)

### Mission Section
- Headline: "OUR MISSION"
- Text: "Enabling the United States Government from the sustainment and improving infrastructure into the modern age to capability development and delivery that affect the most exquisite intelligence, operations, and weapon systems."
- Additional: "We are committed to building strong partnerships with our customers and delivering sustainable value through our solutions and consulting services."

### Team Section
- Headline: "OUR TEAM"

#### Team Members (4 cards)

1. **Bryan Snow - CEO**
   - Photo
   - Bio: 15+ years DoD/IC experience, technical program management, USMC Veteran
   - Education:
     - BS Business Administration, Colorado Technical Institute
     - MS Technology Management, Georgetown University

2. **Matt Baumeister - Director of Growth**
   - Photo
   - Bio: AI/ML and geospatial veteran, doctoral studies in business and AI, US Army Veteran
   - Education:
     - BS Mathematics and Computer Science, West Point
     - MBA, Liberty University
     - Doctoral Candidate (DBA, DSL), Liberty University

3. **Adam Ashurst - Director of Strategy**
   - Photo
   - Bio: 25+ years Defense/IC experience, strategic planning, US Army Veteran
   - Education:
     - BS Integrative Studies, George Mason University
     - Certificate in Business Strategy, University of Virginia

4. **Bryan Minor - Lead AI/ML Strategist**
   - Photo
   - Bio: AI startup entrepreneur, USAF Veteran
   - Education:
     - BS Physics, Central Washington University
     - MS Nuclear Science, USAF Institute of Technology
     - PhD Physics, USAF Institute of Technology

---

## 6. CONTACT PAGE (`/contact`)

### Hero Section
- Headline: "Contact Us"
- Background image: Professional consultation

### Contact Form
- First name
- Last name
- Email*
- Subject*
- Message*
- Submit Button: "Let's Talk"

### Contact Information
- Email: info@make-ready-consulting.com
- Address: 9409 B Battle Street, Manassas, VA 20110

---

## 7. WE'RE HIRING PAGE (`/careers`)

### Hero Section
- Headline: "Join Our Team"
- Subheading: "Build your career with a veteran-owned company making a difference"

### Why Work With Us
- Veteran-friendly culture
- Mission-driven work
- Competitive benefits
- Growth opportunities

### Current Openings
- Job listings (dynamic or static)

### Application Process
- Contact form or link to job application

**Note**: Need specific job listings and detailed content

---

## 8. TERMS & CONDITIONS PAGE (`/terms`)

### Standard Sections
- Introduction
- Use of Website
- Intellectual Property Rights
- User Responsibilities
- Limitation of Liability
- Governing Law
- Contact Information

**Note**: Need legal review and specific terms

---

## 9. PRIVACY POLICY PAGE (`/privacy`)

### Standard Sections
- Information We Collect
- How We Use Your Information
- Information Sharing
- Data Security
- Cookies and Tracking
- Your Rights
- Changes to Privacy Policy
- Contact Information

**Note**: Need legal review and specific policy details

---

## Shared Components

### Header
- Logo (Make Ready logo - white/colored versions)
- Navigation menu
- Mobile responsive hamburger menu
- Dropdown for "Our Products"
- Sticky header on scroll

### Footer
- Logo
- Contact information
  - Email: info@make-ready-consulting.com
  - Address: 9409 B Battle Street, Manassas, VA 20110
- Navigation links
- Certifications section:
  - Small Business Certifications
  - Veteran Owned
  - Service Disabled Veteran Owned Small Business
  - Native American Owned
- Legal links (Terms, Privacy)

---

## Technical Stack Recommendation

### Framework
- **Next.js 14+** (React framework with App Router)
- **TypeScript** (Type safety)
- **Tailwind CSS** (Styling with purple/gold theme)

### Additional Libraries
- **Framer Motion** (Animations)
- **React Hook Form** (Form handling)
- **Zod** (Form validation)
- **Nodemailer or similar** (Contact form submissions)

### Deployment
- **Vercel** (Hosting and deployment)
- **Custom domain** configuration

### Features to Implement
- Responsive design (mobile-first)
- SEO optimization
- Contact form with email notifications
- Image optimization
- Fast page loads
- Accessibility compliance (WCAG)

---

## Brand Colors

### Primary Colors
- **Purple**: Main brand color
- **Gold**: Accent color
- **Black**: Dark backgrounds (#1a1a1a or similar)
- **White**: Text on dark backgrounds

### Usage
- Headers: Dark backgrounds with white text
- CTAs: Purple or gold buttons
- Accents: Gold highlights on hover
- Professional, military-inspired aesthetic

---

## Images Needed

Based on content, you'll need:
1. Hero background (military/soldiers)
2. Veteran memorial image
3. Service card images (6)
4. Team member photos (4)
5. Capitol building (contact section)
6. Product screenshots (Pathfinder, Matrix)
7. Logo files (Make Ready logo)

---

## Next Steps

1. Set up Next.js project with TypeScript and Tailwind
2. Create design system with purple/gold theme
3. Build reusable components (Header, Footer, ServiceCard, TeamMember)
4. Implement all pages
5. Add contact form functionality
6. Optimize images and performance
7. Configure Vercel deployment
8. Set up custom domain
9. Add analytics (Google Analytics or similar)
10. Test across devices and browsers

