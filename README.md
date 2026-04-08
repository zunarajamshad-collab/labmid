# AdFlow Pro - Sponsored Listing Marketplace

AdFlow Pro is a premium moderated marketplace where clients submit paid listings, moderators review content, and administrators verify payments before ads go live.

## 🚀 Features
- **Multi-Role RBAC**: Client, Moderator, and Admin dashboards.
- **Dynamic Explore**: Advanced search and filtering by category and city.
- **Media Normalization**: Automatic thumbnail generation for YouTube and Image URLs.
- **Secure Workflow**: Ad lifecycle from Draft -> Review -> Payment -> Published.
- **Premium Design**: Modern Emerald & Midnight theme with glassmorphism.

## 🛠️ Setup Instructions

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and run the contents of `supabase/001_schema.sql`.
3. Copy your project URL and Anon Key.

### 2. Environment Variables
Create a `.env` file in the root and add your keys:
```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 3. Local Development
```bash
npm install
npm run dev
```

## 🌐 Live Deployment (Vercel)

### Method A: GitHub Integration (Recommended)
1. Create a new repository on GitHub named `labmid` (or your preferred name).
2. Push this code to your repository.
3. Go to [Vercel](https://vercel.com/new), select your repository, and add your Environment Variables.
4. Click **Deploy**.

### Method B: Vercel CLI
```bash
npx vercel
```

## 📝 Technologies
- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Database/Auth**: Supabase
- **Icons**: Lucide React
