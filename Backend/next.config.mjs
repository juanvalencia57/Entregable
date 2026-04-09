/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  rewrites: async () => {
    return {
      afterFiles: [
        {
          source: '/:path((?!api|_next|public).*)',
          destination: '/app/:path*',
        },
      ],
    }
  },
}

export default nextConfig
