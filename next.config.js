module.exports = {
  reactStrictMode: true,
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
