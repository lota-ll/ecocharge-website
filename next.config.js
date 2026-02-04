/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for server actions
  experimental: {
    serverActions: true,
  },
  
  // Disable strict mode for CTF purposes
  reactStrictMode: false,
  
  // Allow all hosts
  images: {
    domains: ['*'],
    unoptimized: true,
  },
  
  // Headers for CTF information disclosure
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Powered-By',
            value: 'Next.js 14.2.5 / React 18.3.1',
          },
          {
            key: 'X-Framework-Version',
            value: 'react-server-dom-webpack@18.3.1 (simulated CVE-2025-55182)',
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
