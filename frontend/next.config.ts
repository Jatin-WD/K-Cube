import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // Intermediate widths prevent small certificate/cards from jumping to 640px.
    deviceSizes: [360, 480, 560, 640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
    qualities: [70, 75],
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }],
  },
  allowedDevOrigins: ['127.0.0.1'],
  async rewrites() {
    return [{ source: '/api/v1/:path*', destination: `${process.env.KCUBE_API_ORIGIN || 'http://127.0.0.1:4000'}/api/v1/:path*` }];
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
