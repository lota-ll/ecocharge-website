/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Server Components (required for CVE-2025-55182)
  experimental: {
    serverActions: {
      enabled: true,
      allowedOrigins: ['*'],
    },
  },
  
  // Disable strict mode for CTF purposes
  reactStrictMode: false,
  
  // Allow all hosts
  images: {
    domains: ['*'],
    unoptimized: true,
  },
  
  // Webpack configuration for server components
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Enable vulnerable deserialization behavior
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }
    return config;
  },
  
  // Headers for CTF information disclosure
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Powered-By',
            value: 'Next.js 15.0.3 / React 19.1.0',
          },
          {
            key: 'X-Framework-Version',
            value: 'react-server-dom-webpack@19.1.0',
          },
          {
            key: 'Server',
            value: 'EcoCharge Portal v1.0',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
