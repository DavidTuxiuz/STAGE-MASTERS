/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Add your Supabase storage / CDN hostname here once you have one,
      // e.g. { protocol: 'https', hostname: '<project-ref>.supabase.co' }
    ],
  },
};

module.exports = nextConfig;
