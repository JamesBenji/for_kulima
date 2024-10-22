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
  // webpack: (config, { isServer }) => {
  //   // Define externals only for the client-side
  //   if (!isServer) {
  //     config.externals = {
  //       ...config.externals,
  //       canvg: "canvg",
  //       html2canvas: "html2canvas",
  //       dompurify: "dompurify"
  //     };
  //   }

  //   return config;
  // }
};



module.exports = nextConfig;


// webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     config.externals.push('chrome-aws-lambda');
  //   }
  //   return config;
  // },
