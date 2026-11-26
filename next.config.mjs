/** @type {import('next').NextConfig} */
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
const nextConfig = {
  output: 'export',
  basePath: base,
  assetPrefix: base || undefined,
  images: { unoptimized: true },
  reactStrictMode: false,
};
export default nextConfig;
