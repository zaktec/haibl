/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['postgres']
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    domains: ['your-bucket-name.s3.us-east-1.amazonaws.com']
  },
  compress: true,
  poweredByHeader: false
};

module.exports = nextConfig;