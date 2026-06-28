import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/*': [path.resolve(__dirname, './src/')],
      '@components/*': [path.resolve(__dirname, './src/components/')],
      '@modules/*': [path.resolve(__dirname, './src/modules/')],
      '@lib/*': [path.resolve(__dirname, './src/lib/')],
      '@hooks/*': [path.resolve(__dirname, './src/hooks/')],
      '@stores/*': [path.resolve(__dirname, './src/stores/')],
      '@types/*': [path.resolve(__dirname, './src/types/')],
      '@utils/*': [path.resolve(__dirname, './src/utils/')],
      '@services/*': [path.resolve(__dirname, './src/services/')],
      '@assets/*': [path.resolve(__dirname, './src/assets/')],
      '@config/*': [path.resolve(__dirname, './src/config/')],
      '@styles/*': [path.resolve(__dirname, './src/styles/')],
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
