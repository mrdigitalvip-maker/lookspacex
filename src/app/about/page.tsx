import { SpacePage } from '@/components/layout/SpacePage'

export default function AboutPage() {
  return (
    <SpacePage title="Sobre" subtitle="LookSpace Alpha" backHref="/">
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Visão</p>
        <h2 className="text-3xl font-semibold text-white">Uma experiência de launcher espacial moderna e imersiva.</h2>
        <p className="max-w-2xl text-slate-400">Esta primeira versão entrega a base cinematográfica, o universo vivo e a estrutura das telas principais para evolução contínua.</p>
      </div>
    </SpacePage>
  )
}
