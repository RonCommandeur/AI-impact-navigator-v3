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
  // Add webpack configuration to handle build issues
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
        bufferutil: false,
        'utf-8-validate': false,
      };
    }
    
    // Ignore problematic modules during build
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'algosdk': 'algosdk',
        'crypto': 'crypto',
        'bufferutil': 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
        'ws': 'ws',
      });
    }
    
    // Remove the babel-loader rule that's causing issues
    config.module.rules = config.module.rules.filter(rule => {
      if (rule.use && rule.use.loader === 'babel-loader') {
        return false;
      }
      return true;
    });
    
    // Fix for ws module issues and Supabase realtime
    config.resolve.alias = {
      ...config.resolve.alias,
      'bufferutil': false,
      'utf-8-validate': false,
    };
    
    // Ignore dynamic requires that cause issues
    config.module = {
      ...config.module,
      unknownContextCritical: false,
      unknownContextRegExp: /^\.\/.*$/,
      unknownContextRequest: '.',
    };
    
    return config;
  },
  // Disable static optimization for problematic pages
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  // Ensure proper handling of dynamic routes
  generateBuildId: async () => {
    return 'ai-impact-navigator-build'
  },
  // Add transpile packages for problematic modules
  transpilePackages: ['chart.js', 'react-chartjs-2'],
  // Disable SWC minification to prevent syntax errors
  swcMinify: false,
  // Add compiler options to handle build issues
  compiler: {
    removeConsole: false,
  },
  // Optimize build for static export
  distDir: '.next',
};

module.exports = nextConfig;