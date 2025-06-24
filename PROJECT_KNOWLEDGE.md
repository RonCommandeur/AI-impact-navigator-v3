# AI Impact Navigator - Complete Project Knowledge Base

## Project Overview

**AI Impact Navigator** is a comprehensive platform built for the Bolt.new Hackathon 2025 that empowers individuals, communities, and citizen developers to navigate the impact of AI on their careers through:

- AI-driven career impact assessments
- Community collaboration with blockchain-verified NFTs
- Real-time progress tracking and metrics
- Market trend analysis with Grok API integration

## Initial Instructions & Requirements

### Design Philosophy
- Create beautiful, production-worthy designs (not cookie cutter)
- Use "use client" directive for client-side hooks in Next.js
- Avoid server/client hydration mismatches
- Use JSX with Tailwind CSS, shadcn/ui, React hooks, and Lucide React icons
- No additional UI packages unless absolutely necessary

### Core Features Required
1. **AI Impact Assessment**: Personalized career impact predictions
2. **Community Hub**: Share experiences, earn NFTs for valuable contributions
3. **Progress Dashboard**: Track AI adaptation journey with real-time metrics
4. **Assessment History**: View past assessments and track evolution
5. **User Contributions**: Manage community posts and earned NFTs

## Tech Stack

### Frontend
- **Framework**: Next.js 13.5.1 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Real-time**: Supabase real-time subscriptions
- **File Storage**: Supabase Storage (if needed)

### Blockchain & AI
- **Blockchain**: Algorand (for NFT minting)
- **AI Integration**: Claude (via Bolt.new) for assessments
- **Trend Analysis**: Grok API integration with fallback data

### Deployment
- **Platform**: Netlify
- **Build**: Static export with Next.js
- **Environment**: Environment variables via Netlify

## Project Structure

```
ai-impact-navigator/
├── app/                          # Next.js App Router pages
│   ├── assessment/
│   │   ├── form/page.tsx        # Main assessment form with auth
│   │   ├── results/page.tsx     # Assessment results display
│   │   └── page.tsx             # Legacy assessment (unused)
│   ├── assessments/page.tsx     # Assessment history
│   ├── community/page.tsx       # Community hub
│   ├── dashboard/page.tsx       # Progress dashboard
│   ├── my-contributions/page.tsx # User's posts and NFTs
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── footer.tsx               # Site footer
│   ├── navigation.tsx           # Main navigation
│   └── theme-provider.tsx       # Dark mode provider
├── lib/
│   ├── ai-predictions.ts        # AI prediction engine
│   ├── algorand-nft.ts          # Algorand NFT minting
│   ├── grok-api.ts              # Grok API integration
│   ├── supabase.ts              # Supabase client
│   ├── supabase-contributions.ts # Community posts logic
│   ├── supabase-metrics.ts      # User metrics calculation
│   ├── supabase-trends.ts       # Trend data management
│   ├── supabase-users.ts        # User profile management
│   └── utils.ts                 # Utility functions
├── supabase/migrations/         # Database migrations
├── components.json              # shadcn/ui config
├── next.config.js               # Next.js configuration
├── netlify.toml                 # Netlify deployment config
├── package.json                 # Dependencies
├── tailwind.config.ts           # Tailwind configuration
└── tsconfig.json                # TypeScript configuration
```

## Database Schema

### Core Tables

#### 1. profiles
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  job text,
  skills text[],
  ai_prediction jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(auth_user_id)
);
```

#### 2. contributions
```sql
CREATE TABLE contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  category text NOT NULL DEFAULT 'Discussion',
  votes integer DEFAULT 0,
  nft_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 3. contribution_votes
```sql
CREATE TABLE contribution_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id uuid REFERENCES contributions(id) ON DELETE CASCADE,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(contribution_id, auth_user_id)
);
```

#### 4. user_metrics
```sql
CREATE TABLE user_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  progress jsonb NOT NULL DEFAULT '{}',
  trend_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(auth_user_id)
);
```

### Key Database Functions

#### Calculate User Metrics
```sql
CREATE OR REPLACE FUNCTION calculate_user_metrics(user_id uuid)
RETURNS jsonb AS $$
-- Function calculates user progress from existing data
-- Returns JSON with skills, assessments, contributions, NFTs, etc.
$$;
```

#### Update Vote Counts
```sql
CREATE OR REPLACE FUNCTION update_contribution_vote_count()
RETURNS TRIGGER AS $$
-- Automatically updates vote count when votes are added/removed
$$;
```

## Environment Variables

### Required Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Grok API Configuration (Optional)
GROK_API_KEY=your_grok_api_key
NEXT_PUBLIC_GROK_API_KEY=your_grok_api_key
```

### Netlify Configuration (netlify.toml)
```toml
[build]
  publish = "out"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  NEXT_PUBLIC_SUPABASE_URL = "your_supabase_url"
  NEXT_PUBLIC_SUPABASE_ANON_KEY = "your_supabase_key"
```

## Key Features Implementation

### 1. AI Impact Assessment

**File**: `lib/ai-predictions.ts`

- Role-based prediction engine (Designer, Developer, Writer, etc.)
- Structured JSON output with risk scores, actions, opportunities
- Integration with user profiles and skills
- Confidence scoring based on profile completeness

**Key Functions**:
- `generateAIPrediction(profile)`: Main prediction engine
- `saveAIPrediction(userId, prediction)`: Store predictions
- `getAIPrediction(userId)`: Retrieve predictions

### 2. Community System with NFTs

**File**: `lib/supabase-contributions.ts`

- Post creation and management
- Voting system with automatic NFT minting at 10+ votes
- Algorand blockchain integration for NFTs
- Real-time vote counting

**Key Functions**:
- `createContribution(user, formData)`: Create posts
- `voteOnContribution(userId, contributionId)`: Handle voting
- `mintContributionNFT(contribution)`: Mint NFTs on Algorand

### 3. Progress Dashboard

**File**: `lib/supabase-metrics.ts`

- Real-time metrics calculation
- Skill proficiency tracking
- Weekly activity monitoring
- Progress scoring algorithm

**Key Functions**:
- `getUserMetrics(userId)`: Get user progress
- `updateUserMetrics(userId)`: Recalculate metrics
- `triggerMetricsUpdate(userId)`: Background updates

### 4. Market Trends

**File**: `lib/grok-api.ts`

- Grok API integration for real-time trends
- Fallback data when API unavailable
- Industry adoption tracking
- Monthly trend projections

**Key Functions**:
- `fetchGrokTrendAnalysis()`: Get live data from Grok
- `generateFallbackTrendData()`: Backup data
- `getTrendAnalysisWithFallback()`: Main trend function

## Component Architecture

### Navigation System
**File**: `components/navigation.tsx`

- Responsive navigation with mobile menu
- Authentication state management
- Active page highlighting
- User profile display

### Assessment Flow
1. **Form Page** (`app/assessment/form/page.tsx`): Main assessment with auth
2. **Results Page** (`app/assessment/results/page.tsx`): Display predictions
3. **History Page** (`app/assessments/page.tsx`): Past assessments

### Community Features
1. **Community Hub** (`app/community/page.tsx`): Main community page
2. **My Contributions** (`app/my-contributions/page.tsx`): User's posts and NFTs

### Dashboard
**File**: `app/dashboard/page.tsx`

- Tabbed interface (Overview, Skills, Trends, Activity)
- Real-time charts and metrics
- Progress visualization
- Trend analysis display

## Styling & Design

### Tailwind Configuration
- Custom color system with CSS variables
- Dark mode support
- Responsive breakpoints
- Animation utilities

### Design Principles
- Gradient backgrounds for visual appeal
- Card-based layouts with backdrop blur
- Consistent spacing (8px system)
- Hover states and micro-interactions
- Apple-level design aesthetics

### Color Scheme
- Primary: Blue to Purple gradients
- Secondary: Green for positive metrics
- Warning: Yellow/Orange for medium risk
- Error: Red for high risk
- Neutral: Gray scale for text and borders

## Authentication Flow

### Google OAuth Integration
1. User clicks "Sign in with Google"
2. Supabase handles OAuth flow
3. User redirected back to app
4. Profile created/updated in database
5. Metrics calculated automatically

### Protected Routes
- Assessment form requires authentication
- Community posting requires authentication
- Dashboard requires authentication
- Public viewing of community posts allowed

## Deployment Instructions

### Prerequisites
1. Supabase project with database setup
2. Google OAuth configured in Supabase
3. Netlify account
4. (Optional) Grok API key

### Setup Steps

1. **Clone/Create Project**
```bash
npx create-next-app@13.5.1 ai-impact-navigator
cd ai-impact-navigator
```

2. **Install Dependencies**
```bash
npm install @supabase/supabase-js@^2.45.4 framer-motion@^11.0.0 chart.js@^4.4.4 react-chartjs-2@^5.2.0 algosdk@^2.7.0 lucide-react@^0.446.0 sonner@^1.5.0 next-themes@^0.3.0
```

3. **Setup shadcn/ui**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add card button input label textarea badge progress avatar dialog
```

4. **Configure Environment**
- Copy all files from this knowledge base
- Set up environment variables
- Configure Supabase database with migrations

5. **Deploy to Netlify**
- Connect GitHub repository
- Set build command: `npm run build`
- Set publish directory: `out`
- Add environment variables

### Database Setup

1. **Create Supabase Project**
2. **Enable Google OAuth** in Authentication settings
3. **Run Migrations** in order:
   - `20250616231748_golden_snow.sql`
   - `20250616233042_holy_brook.sql`
   - `20250616234346_polished_water.sql`
   - `20250618053620_emerald_art.sql`
   - `20250619123142_super_leaf.sql`
   - `20250619200005_flat_beacon.sql`

4. **Configure RLS Policies** (included in migrations)

## Key Code Patterns

### Client Component Pattern
```tsx
'use client'

import { useState, useEffect } from 'react'
// Component implementation
```

### Supabase Integration Pattern
```tsx
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', userId)
```

### Error Handling Pattern
```tsx
try {
  const result = await someAsyncOperation()
  if (!result.success) {
    toast.error(result.error)
    return
  }
  toast.success('Operation successful!')
} catch (error) {
  console.error('Error:', error)
  toast.error('An unexpected error occurred')
}
```

### Loading State Pattern
```tsx
const [loading, setLoading] = useState(true)

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true)
      // Load data
    } finally {
      setLoading(false)
    }
  }
  loadData()
}, [])
```

## Troubleshooting Guide

### Common Issues

1. **Hydration Mismatches**
   - Ensure "use client" directive is present
   - Check for server/client state differences

2. **Supabase Connection Issues**
   - Verify environment variables
   - Check RLS policies
   - Ensure user authentication

3. **Build Failures**
   - Check TypeScript errors
   - Verify all imports are correct
   - Ensure static export compatibility

4. **NFT Minting Issues**
   - Algorand integration is mocked for demo
   - Check contribution vote counts
   - Verify database triggers

### Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component where possible
   - Optimize external image URLs

2. **Bundle Size**
   - Tree-shake unused dependencies
   - Use dynamic imports for heavy components

3. **Database Queries**
   - Use indexes on frequently queried columns
   - Implement pagination for large datasets

## Future Enhancements

### Planned Features
1. **Real Algorand Integration**: Replace mock NFT system
2. **Advanced AI Models**: Integrate more sophisticated prediction models
3. **Social Features**: User following, notifications
4. **Mobile App**: React Native version
5. **API Endpoints**: Public API for integrations

### Scalability Considerations
1. **Caching**: Implement Redis for frequently accessed data
2. **CDN**: Use CDN for static assets
3. **Database Optimization**: Implement read replicas
4. **Microservices**: Split into smaller services as needed

## License & Credits

- **License**: MIT License
- **Built for**: Bolt.new Hackathon 2025
- **Powered by**: Bolt.new, Supabase, Algorand
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

---

## Quick Start Checklist

To recreate this project:

- [ ] Create Next.js project with specified version
- [ ] Install all dependencies from package.json
- [ ] Copy all files from this knowledge base
- [ ] Setup Supabase project and run migrations
- [ ] Configure Google OAuth in Supabase
- [ ] Set environment variables
- [ ] Test locally with `npm run dev`
- [ ] Deploy to Netlify with static export
- [ ] Verify all features work in production

This knowledge base contains everything needed to recreate the AI Impact Navigator project from scratch. All code, configurations, and instructions are included for a complete restoration if needed.