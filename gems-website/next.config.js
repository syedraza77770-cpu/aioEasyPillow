/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    unoptimized: true
  },
  // output: 'export' -- removed to support dynamic routes with useParams()
}

module.exports = nextConfig
