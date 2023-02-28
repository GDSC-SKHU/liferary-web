/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  api: {
    bodyParser: false,
  },
  async rewrites() {
    return [
      {
        source: '/:path*', // path 주소
        destination: 'http://api-liferary.duckdns.org/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
