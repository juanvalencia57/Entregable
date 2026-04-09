# Chronosync - Task Manager

Full-stack task manager application built with Next.js, React, and Supabase.

## 📋 Project Structure

```
Entregable/
├── Backend/                 # Next.js API server
│   ├── app/api/           # API endpoints
│   ├── lib/               # Utilities and Supabase client
│   ├── scripts/           # Database migration scripts
│   └── package.json
│
├── Frontend/              # React + Vite application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── package.json
│
└── README.md
```

## 🚀 Setup Guide

### Prerequisites
- Node.js 18+ (https://nodejs.org)
- GitHub account
- Supabase account (https://app.supabase.com)
- Railway account (https://railway.app)

### 1. Supabase Setup

1. Create a new project at https://app.supabase.com
2. Go to **SQL Editor** and run the schema from `Backend/scripts/001_create_tables.sql`
3. Get your credentials from **Settings → API**:
   - Copy `Project URL`
   - Copy `Anon Key` (public key)

### 2. Local Development

#### Backend Setup
```bash
cd Backend
cp .env.example .env.local
# Update .env.local with Supabase credentials
npm install
npm run dev
# Server runs on http://localhost:3000
```

#### Frontend Setup
```bash
cd Frontend
cp .env.example .env
# Update .env with Supabase credentials
npm install
npm run dev
# App runs on http://localhost:5173
```

### 3. Environment Variables

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Backend (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Deployment to Railway

1. Connect your GitHub repo to Railway
2. Create two services:
   - **Backend**: 
     - Root Directory: `Backend`
     - Build Command: `npm install`
     - Start Command: `npm run build && npm run start`
   - **Frontend** (optional):
     - Root Directory: `Frontend`
     - Build Command: `npm run build`

3. Add environment variables to each service
4. Deploy

## 📚 Features

- ✅ User Authentication with Supabase Auth
- ✅ Create, Read, Update, Delete Tasks
- ✅ Organize tasks by categories
- ✅ Mark tasks as completed
- ✅ Filter tasks by date and category
- ✅ Recurring tasks support
- ✅ Row-Level Security (RLS) with Supabase

## 🔐 Security

- Row-Level Security (RLS) policies ensure users can only access their own data
- Environment variables stored securely in `.env.local` (not committed)
- CORS enabled only for trusted origins

## 📱 Tech Stack

### Frontend
- React 18
- Vite
- TypeScript
- Radix UI Components
- Tailwind CSS
- Supabase JavaScript Client

### Backend
- Next.js 16
- TypeScript
- Supabase PostgreSQL
- Node.js Runtime

### Database
- PostgreSQL (via Supabase)
- Row-Level Security (RLS)
- Automatic backups

## 🛠️ Available Scripts

### Backend
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run start      # Start production server
```

### Frontend
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 📝 Notes

- Database credentials should never be committed to git
- Use `.env.example` as a template
- Always use `npm install` before first run
- Backend uses Supabase middleware for authentication
- Frontend uses Supabase Auth for user sessions

## 🔗 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Railway Documentation](https://docs.railway.app)

## 👤 Author

Juan Valencia - juan.valencia57@udea.edu.co
