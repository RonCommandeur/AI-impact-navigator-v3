/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure environment variables are available at build time
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Add webpack configuration to handle potential build issues
  webpack: (config, { isServer }) => {
    // Handle potential issues with server-side rendering
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
      };
    }
    
    // Ignore problematic modules during build
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'algosdk': 'algosdk',
        'crypto': 'crypto',
      });
    }
    
    // Handle Chart.js and other client-side libraries
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/(chart\.js|react-chartjs-2)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    });
    
    return config;
  },
  // Disable static optimization for pages that need runtime data
  experimental: {
    esmExternals: 'loose',
  },
  // Ensure proper handling of dynamic routes
  generateBuildId: async () => {
    return 'ai-impact-navigator-build'
  },
  // Add transpile packages for problematic modules
  transpilePackages: ['chart.js', 'react-chartjs-2'],
};

module.exports = nextConfig;