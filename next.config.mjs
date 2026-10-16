/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Added to fix Sanity and SWR build errors in Next.js
  transpilePackages: ['sanity', 'next-sanity', '@sanity/ui', 'swr'],
}

export default nextConfig
