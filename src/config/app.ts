export const APP_CONFIG = {
  name: 'LookSpace',
  version: '0.1.0',
  description: 'Um jogo de exploração espacial futurista',
  domain: 'lookspacex.com',
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const
