import { defineConfig } from 'astro/config';

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const owner = process.env.GITHUB_REPOSITORY_OWNER;

export default defineConfig({
  ...(owner ? { site: `https://${owner}.github.io` } : {}),
  base: isGitHubActions ? `/${repository || 'SiyaRamColourWorks'}` : '/',
  server: { port: 4321, host: true },
});
