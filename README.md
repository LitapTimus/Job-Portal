# Job Portal (MERN Stack)

A full-stack job portal application built with MongoDB, Express.js, React, and Node.js. This platform connects job seekers with recruiters, featuring job postings, applications, and analytics dashboards.

## Features

### ✅ Landing Page
- Dual entry points for Candidates and Recruiters
- Feature showcase and hero section
- Responsive navigation

### ✅ Candidate Features
**Authentication**
- Signup/Login with role selection
- **Google OAuth integration** - Sign in with Google account
- JWT-based secure authentication
- Role selection for OAuth users

**Profile/Portfolio Creation**
- Personal details (name, title, bio, location)
- Skills management
- Years of experience
- Resume upload (PDF/DOC)
- Portfolio links (GitHub, personal website, etc.)

**Job Applications**
- Browse job listings with search and filters
- Filter by title, location, and skills
- View detailed job descriptions
- Apply with optional cover letters
- Track application status in real-time

**Candidate Dashboard**
- View all applied jobs
- Track application status (Applied → Viewed → Shortlisted → Rejected/Hired)
- **Analytics & Insights:**
  - Total applications count
  - Applications by status breakdown
  - Success rate calculation
  - Positive response tracking
- Profile completion prompts

### ✅ Recruiter Features
**Authentication**
- Signup/Login with recruiter role
- **Google OAuth integration** - Sign in with Google account
- Company profile management

**Job Posting**
- Create job listings with:
  - Title and description
  - Required skills
  - Location
  - Employment type (Full-time, Part-time, Contract, Internship)
  - Salary range
  - Minimum experience required
- Manage active/inactive job status

**Candidate Search**
- Search candidates by name or title
- Filter by specific skills
- Filter by minimum years of experience
- View candidate profiles with:
  - Skills and experience
  - Resume and portfolio links
  - Contact information
- Direct email contact

**Recruiter Dashboard**
- View all posted jobs
- Track total applications per job
- **Analytics & Insights:**
  - Total jobs posted
  - Active jobs count
  - Total applications received
  - Applications by status (Shortlisted, Hired, etc.)
- **Applicant Management:**
  - View all applicants for each job
  - See candidate skills and cover letters
  - Update application status
  - Real-time status updates

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **Passport.js** - OAuth authentication
- **Google OAuth 2.0** - Social login
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Helmet** - Security headers
- **Morgan** - Logging

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **React Query** - Data fetching & caching
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Vite** - Build tool

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
MONGO_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5000
NODE_ENV=development

# Google OAuth (optional - for social login)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your_session_secret_key
```

**Note:** For Google OAuth setup, see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Client will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/update-role` - Update user role (OAuth users)

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (recruiter only)
- `GET /api/jobs/:jobId/applicants` - Get job applicants

### Applications
- `POST /api/applications` - Apply to job
- `GET /api/applications/my` - Get user's applications
- `PATCH /api/applications/:id/status` - Update application status

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `POST /api/users/upload-resume` - Upload resume
- `GET /api/users/candidates` - Search candidates (recruiter only)

### Analytics
- `GET /api/analytics/recruiter` - Recruiter analytics
- `GET /api/analytics/candidate` - Candidate analytics

## Project Structure

```
job-portal-mern/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── appController.js
│   │   ├── authController.js
│   │   └── jobController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Application.js
│   │   ├── Job.js
│   │   └── User.js
│   ├── routes/
│   │   ├── analytics.js
│   │   ├── applications.js
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   └── users.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
└── client/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── CandidateDashboard.jsx
    │   │   ├── JobDetail.jsx
    │   │   ├── Jobs.jsx
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── PostJob.jsx
    │   │   ├── RecruiterDashboard.jsx
    │   │   ├── RoleSelection.jsx
    │   │   └── Signup.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Usage

1. **Sign Up**: Create an account as either a Candidate or Recruiter
2. **Candidates**: Browse jobs, apply with cover letters, track applications
3. **Recruiters**: Post jobs, review applicants, manage hiring pipeline
4. **Both**: Access personalized dashboards with analytics

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and role-based access control
- Helmet for security headers
- Input validation

## Future Enhancements

- Email notifications
- Advanced search filters
- Resume parsing
- Interview scheduling
- Messaging system
- Company profiles with reviews
- Saved jobs feature
- Application recommendations

## License

MIT

## Author

Built by Sumit Patil using MERN Stack
