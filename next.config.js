/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const repositoryName = 'tripPlanner';

const nextConfig = {
  images: { unoptimized: true },
  // GitHub Pages can only publish static files. Other hosts (such as Netlify)
  // keep the normal Next.js server build, including API routes.
  ...(isGitHubPages
    ? {
        output: 'export',
        basePath: `/${repositoryName}`,
        assetPrefix: `/${repositoryName}/`,
        trailingSlash: true,
      }
    : {}),
};

module.exports = nextConfig;
