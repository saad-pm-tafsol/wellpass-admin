/** @type {import('next').NextConfig} */
const nextConfig = {
  // Framework migration lint rules can block production builds; run `npm run lint`
  // separately and keep `next build` focused on type-checking + compilation.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
