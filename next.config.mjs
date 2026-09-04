/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'books.google.com',
      },
      {
        hostname: 'covers.openlibrary.org',
      },
    ],
  },
};

export default nextConfig;
