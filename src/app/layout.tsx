import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LookSpace',
  description: 'Um jogo de exploração espacial futurista',
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
