/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode for CTF purposes
  reactStrictMode: false,
  
  // Allow all image hosts
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  
  // Disable powered-by header (we set custom ones below)
  poweredByHeader: false,
  
  // Headers for information disclosure
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Powered-By',
            value: 'Next.js',
          },
          {
            key: 'Server',
            value: 'EcoCharge Portal v1.1',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
