# Job Notifier

A modern, intelligent job tracking system that scrapes job portals and notifies users when new matching job postings are discovered. Built with a focus on developer experience, privacy, and a clean modern UI.

## Overview

Job Notifier helps developers and job seekers stay on top of new opportunities by continuously monitoring job portals, matching postings to your skills, and sending instant notifications. Never miss a perfect role again.

## Features

### Core Functionality

- **Smart Job Matching** - Token-based matching algorithm that analyzes job titles and company names to match them with your skills
- **Continuous Scraping** - Automated workers scrape popular job portals and upsert listings in real-time
- **De-duplication** - Intelligent fingerprinting prevents duplicate entries and keeps your feed clean
- **Flexible Notifications** - Choose between immediate, hourly, or daily digests via email, Telegram, or web push

### User Experience

- **Modern Dashboard** - Clean, minimal interface built with a professional blue theme
- **Skill Management** - Add and manage your skills for better job matching
- **Job Tracking** - Track application status, interviews, offers, and rejections
- **Privacy-First** - Your data stays with you. We never sell your information

### Developer-Friendly

- **Open API** - RESTful endpoints for easy integration
- **Self-Hostable** - Deploy on your own infrastructure
- **Customizable Workers** - Built with Playwright and Cheerio for easy scraping customization

## Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Typography**: Inter (Google Fonts)
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT + bcryptjs
- **Email**: Nodemailer

### Worker

- **Scraping**: Playwright, Cheerio
- **HTTP Client**: Axios
- **Caching**: LRU Cache

## Project Structure

```
job-notifier/
├── frontend/          # Next.js React application
│   ├── app/
│   │   ├── components/    # Reusable UI components
│   │   ├── dashboard/     # Dashboard page
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   ├── settings/      # Settings page
│   │   └── jobs/          # Job detail pages
│   ├── globals.css        # Design system & theme
│   └── package.json
│
├── backend/           # Express API server
│   ├── controllers/   # Request handlers
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── middlewares/   # Auth & error handling
│   ├── jobs/          # Job matching logic
│   └── index.js       # Server entry point
│
└── worker/            # Scraping workers
    ├── scrapers/      # Portal-specific scrapers
    ├── queues/        # Job queues
    └── runner.js      # Worker orchestrator
```

## Design System

The frontend uses a **"Minimal with Cyber Edge"** design philosophy:

- **Color Palette**: Professional blue theme (#3B82F6) with clean white/grey surfaces
- **Typography**: Inter font family with optimized weights and spacing
- **Components**: Modular component system with consistent styling
- **Animations**: Subtle, fast-feeling transitions and micro-interactions
- **Responsive**: Mobile-first design with hamburger navigation

### Theme Tokens

- Primary Accent: Blue 500 (#3B82F6)
- Hover State: Blue 400 (#60A5FA)
- Active State: Blue 600 (#2563EB)
- Backgrounds: Pure white (#FFFFFF) and soft grey (#F8FAFC)
- Text: Deep black (#0F172A) for titles, grey tones for body text

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DeepakRizal/Job-notifier.git
   cd job-notifier
   ```

2. **Install dependencies for each service**

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install

   # Worker
   cd ../worker
   npm install
   ```

3. **Set up environment variables**

   Create `.env` files in each directory:

   **backend/.env**

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   EMAIL_HOST=smtp.example.com
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

   **frontend/.env.local** (if needed)

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

   **worker/.env**

   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Start the development servers**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev

   # Terminal 3 - Worker (optional for development)
   cd worker
   node runner.js
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Development

### Frontend Development

```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Backend Development

```bash
cd backend
npm run dev      # Start with auto-reload
```

### Code Structure

#### Frontend Components

- `Header.tsx` - Responsive navigation with mobile menu
- `Footer.tsx` - Site footer
- `LoginPanel.tsx` / `RegisterPanel.tsx` - Authentication forms
- `JobsDashboard.tsx` - Main dashboard with sidebar
- `JobCard.tsx` - Job listing card component
- `JobDetailPanel.tsx` - Detailed job view
- `SkillsPreferencesPanel.tsx` - Skills and notification settings
- `AccountSettingsPanel.tsx` - User account management

#### Design System

All UI components use the design system defined in `frontend/app/globals.css`:

- `.ui-card` - Card containers
- `.ui-btn-primary` - Primary buttons
- `.ui-btn-secondary` - Secondary buttons
- `.ui-input` - Form inputs
- `.ui-badge` - Status badges

## Authentication

The application uses JWT-based authentication:

1. User registers/logs in via frontend
2. Backend validates credentials and issues JWT token
3. Token stored in HTTP-only cookies (recommended) or localStorage
4. Protected routes verify token on each request

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Jobs

- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create new job (admin)
- `GET /api/jobs/matches` - Get matched jobs for user

### User

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/skills` - Update user skills

## Testing

```bash
# Run tests (when implemented)
npm test
```

## Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the .next folder
```

### Backend (Railway/Render/Heroku)

```bash
cd backend
# Set environment variables
# Deploy with Node.js buildpack
```

### Worker (Separate process)

Run the worker as a separate process or background job:

```bash
cd worker
node runner.js
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## License

ISC License

## Author

**Deepak Rizal**

- GitHub: [@DeepakRizal](https://github.com/DeepakRizal)

## Acknowledgments

- Built for developers who care about craft
- Inspired by modern applications like Linear, Vercel, and Notion
- Design system influenced by clean, minimal UI patterns

---

**Built for job seekers who want to stay ahead**
