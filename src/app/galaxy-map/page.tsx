import { SpacePage } from '@/components/layout/SpacePage'

export default function GalaxyMapPage() {
  return (
    <SpacePage title="Mapa Galáctico" subtitle="Sistema estelar em expansão" backHref="/">
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Em construção</p>
        <h2 className="text-3xl font-semibold text-white">O mapa galáctico será liberado em breve.</h2>
        <p className="max-w-xl text-slate-400">A navegação por sistemas, rotas e fronteiras será integrada aqui.</p>
      </div>
    </SpacePage>
  )
}
