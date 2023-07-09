const nextConfig = {
  experimental: {
    appDir: true,
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
};

module.exports = nextConfig;