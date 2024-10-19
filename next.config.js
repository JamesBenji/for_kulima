/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('chrome-aws-lambda');
    }
    return config;
  },
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
