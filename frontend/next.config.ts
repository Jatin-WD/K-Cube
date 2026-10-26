import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
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
