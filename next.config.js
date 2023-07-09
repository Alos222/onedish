const nextConfig = {
  experimental: {
    appDir: true,
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.gstatic.com',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;