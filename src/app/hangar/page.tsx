import { SpacePage } from '@/components/layout/SpacePage'

export default function HangarPage() {
  return (
    <SpacePage title="Hangar" subtitle="Sua frota em construção" backHref="/">
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Em breve</p>
        <h2 className="text-3xl font-semibold text-white">O hangar estará disponível em breve.</h2>
        <p className="max-w-xl text-slate-400">A base do universo já está pronta para receber naves, módulos e missões.</p>
      </div>
    </SpacePage>
  )
}
