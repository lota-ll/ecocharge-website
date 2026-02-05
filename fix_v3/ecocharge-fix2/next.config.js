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
  
  // Headers for information disclosure (realistic, no CVE hints)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Powered-By',
            value: 'Next.js 15.0.3',
          },
          {
            key: 'X-Framework-Version',
            value: 'React 19.1.0',
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
