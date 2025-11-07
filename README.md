# CAG Portal - Cleared Advisory Group

A modern job board platform connecting cleared professionals with defense contractors and employers in the cleared space.

## 🎯 Project Overview

CAG (Cleared Advisory Group) is a comprehensive portal for cleared IT professionals featuring:
- Job listings and search
- Certification tracking
- Interview preparation tools
- Career analytics dashboard
- Professional messaging
- Consulting services

**Important**: This is a **frontend-only demo**. No backend functionality is currently implemented.

## 🏗️ Built With

- **Astro v5.15.3** - Static site generator
- **Tailwind CSS v4** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **Vercel** - Deployment platform

## 📁 Project Structure

```
CAG-Astro/
├── src/
│   ├── pages/              # All 10 pages
│   │   ├── index.astro    # Homepage
│   │   ├── dashboard.astro
│   │   ├── jobs.astro
│   │   ├── certifications.astro
│   │   ├── interviews.astro
│   │   ├── messaging.astro
│   │   ├── analytics.astro
│   │   ├── consulting.astro
│   │   ├── settings.astro
│   │   ├── login.astro
│   │   └── mock-interview/
│   ├── components/         # Reusable components
│   ├── layouts/           # Layout templates
│   └── styles/            # Global CSS
├── public/                # Static assets
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Pages

### Completed Pages ✅
1. **Homepage** - Hero, features, services, testimonials
2. **Dashboard** - User overview, quick actions, job matches
3. **Jobs** - Job search, listings, filters
4. **Certifications** - Certification tracking and catalog
5. **Interviews** - Practice modes, mock interviews
6. **Messaging** - Professional messaging interface
7. **Analytics** - Career metrics and insights
8. **Consulting** - Services, pricing, testimonials
9. **Settings** - Account management, security, preferences
10. **Login/Register** - Authentication with legal disclaimers

## 🎨 Design System

### Color Palette
- **Navy**: #141C2B (Primary)
- **Gold**: #D4AF37 (Accent)
- **White**: #FFFFFF (Background)

### Typography
- Font Family: Inter, -apple-system, sans-serif
- Responsive font sizes
- Mobile-first approach

## 📱 Responsive Design

All pages are fully responsive with breakpoints:
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

Mobile features:
- Hamburger menu
- Touch-optimized interactions
- Stacked layouts
- Full-width buttons

## ⚠️ Current Limitations

### No Backend Integration
- Forms show placeholder alerts
- No user authentication
- No data persistence
- No API calls
- No database

### Placeholder Content
- Job listings are static examples
- User data is hardcoded
- Messaging is UI only
- Analytics data is mock data

## 🔐 Security & Privacy

### Legal Protection
- Clearance disclaimer on registration
- Clear terms that CAG doesn't verify clearances
- Users self-report clearance levels
- Employers responsible for verification

### Sensitive Data
- No real user data stored
- No API keys in codebase
- Contact information uses placeholders
- See [SECURITY.md](./SECURITY.md) for details

## 🚀 Deployment

### Vercel (Current)
```bash
# Push to GitHub triggers automatic deployment
git push origin main

# Or deploy manually
vercel --prod
```

**Live URL**: https://cag-portal-astro.vercel.app

### Build Output
```bash
npm run build
# Output: ./dist/
```

## 🔮 Future Enhancements

### Phase 1: Authentication
- AWS Cognito integration
- User registration/login
- Session management

### Phase 2: Backend
- AWS Lambda functions
- API Gateway endpoints
- DynamoDB database
- S3 file storage

### Phase 3: Features
- Real job listings
- Messaging system
- Analytics tracking
- Payment integration

## 📝 Development Notes

### Key Features Implemented
- ✅ Mobile-responsive design
- ✅ Interactive forms with validation
- ✅ Password strength checker
- ✅ Legal disclaimers
- ✅ Professional navigation
- ✅ All 10 pages complete

### Technical Highlights
- Server-side rendering (SSR) capable
- Static site generation
- Optimized images
- Fast page loads
- SEO-friendly URLs

## 🤝 Contributing

This is a private project. For questions or issues, please contact the project maintainer.

## 📄 License

Private - All Rights Reserved

---

## 🧞 Commands Reference

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run astro ...` | Run Astro CLI commands |

## 🔗 Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

**Version**: 1.0.0
**Last Updated**: November 7, 2025
**Status**: Frontend Complete, Backend Pending
