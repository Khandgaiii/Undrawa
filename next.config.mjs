/** @type {import('next').NextConfig} */
const isMobileBuild = process.env.npm_lifecycle_event === 'build:mobile'

const nextConfig = {
  ...(isMobileBuild
    ? { output: 'export', trailingSlash: true }
    : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
