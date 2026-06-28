import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LookSpace — Exploração Espacial',
  description: 'Um universo procedural. Missões épicas. Sua frota. Sua história.',
  keywords: ['jogo espacial', 'exploração', 'cyberpunk', 'sci-fi', 'lookspace'],
  authors: [{ name: 'Bruno Brandão' }],
  creator: 'Bruno Brandão',
  manifest: '/manifest.json',
  themeColor: '#00f5ff',
  openGraph: {
    title: 'LookSpace — Exploração Espacial',
    description: 'Um universo procedural. Missões épicas. Sua frota. Sua história.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'LookSpace',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LookSpace — Exploração Espacial',
    description: 'O universo espera. Você está pronto?',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
