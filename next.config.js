/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nzdnbucbavoasyrclnpz.supabase.co",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["react-text-gradients"],
  },
};

module.exports = nextConfig;
