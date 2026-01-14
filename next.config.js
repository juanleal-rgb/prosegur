/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Railway will set PORT automatically, Next.js will use it
  // No need to configure it here - Next.js reads process.env.PORT automatically
}

module.exports = nextConfig
