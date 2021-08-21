module.exports = {
  reactStrictMode: true,
  eslint: {
    dirs: ['src'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/rio',
        permanent: true,
      },
    ];
  },
};
