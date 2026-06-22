import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      }
    ]
  },
  serverExternalPackages: ['pdfkit'],
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.couup.in',
          },
        ],
        destination: 'https://couup.in/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
