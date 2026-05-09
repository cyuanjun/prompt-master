import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage public URLs follow this pattern.
      // Once your project URL is in .env.local, this will Just Work.
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/**' },
    ],
  },
}

export default nextConfig
