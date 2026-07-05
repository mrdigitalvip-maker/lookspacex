import { SpacePage } from '@/components/layout/SpacePage'

export default function ExplorationPage() {
  return (
    <SpacePage title="Exploração" subtitle="Mapas e sistemas em expansão" backHref="/">
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Em breve</p>
        <h2 className="text-3xl font-semibold text-white">A exploração cósmica começa aqui.</h2>
        <p className="max-w-xl text-slate-400">As rotas de navegação e os sistemas estelares serão liberados em atualizações futuras.</p>
      </div>
    </SpacePage>
  )
}
