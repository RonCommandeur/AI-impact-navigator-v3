# AI Impact Navigator

A platform that empowers individuals, communities, and citizen developers to navigate the impact of AI on their lives through AI-driven assessments, community collaboration, and real-time metrics.

Built for the Bolt.new Hackathon 2025.

## Features

- **AI Impact Assessment**: Get personalized insights on how AI will affect your career
- **Community Hub**: Share experiences and earn blockchain-verified NFTs
- **Progress Dashboard**: Track your AI adaptation journey with real-time metrics

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase
- **Blockchain**: Algorand (NFTs)
- **AI**: Claude (via Bolt.new)
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This app is configured for Netlify deployment with static export.

### Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Add environment variables in Netlify dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Manual Build

```bash
npm run build
```

This creates an `out` directory with static files ready for deployment.

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Contributing

Built for the Bolt.new Hackathon 2025. See project documentation for development guidelines.

## License

MIT License - see LICENSE file for details.