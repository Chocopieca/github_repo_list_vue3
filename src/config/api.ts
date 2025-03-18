export const API_CONFIG = {
  GITHUB_API_URL: 'https://api.github.com',
  DEFAULT_PER_PAGE: 10,
  DEFAULT_ORGANIZATION: 'nodejs',
  // You can add a token via env variable if needed
  GITHUB_TOKEN: import.meta.env.VITE_GITHUB_TOKEN || '',
} as const
