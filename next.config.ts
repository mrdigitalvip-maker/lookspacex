import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/*': [require('path').resolve(__dirname, './src/')],
      '@components/*': [require('path').resolve(__dirname, './src/components/')],
      '@modules/*': [require('path').resolve(__dirname, './src/modules/')],
      '@lib/*': [require('path').resolve(__dirname, './src/lib/')],
      '@hooks/*': [require('path').resolve(__dirname, './src/hooks/')],
      '@stores/*': [require('path').resolve(__dirname, './src/stores/')],
      '@types/*': [require('path').resolve(__dirname, './src/types/')],
      '@utils/*': [require('path').resolve(__dirname, './src/utils/')],
      '@services/*': [require('path').resolve(__dirname, './src/services/')],
      '@assets/*': [require('path').resolve(__dirname, './src/assets/')],
      '@config/*': [require('path').resolve(__dirname, './src/config/')],
      '@styles/*': [require('path').resolve(__dirname, './src/styles/')],
    }
    return config
  },
  images: {
    domains: [],
  },
  // Suporte futuro para assets 3D será adicionado aqui
  // remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
}

export default nextConfig
