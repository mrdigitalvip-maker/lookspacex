import { SpacePage } from '@/components/layout/SpacePage'

export default function ShipsPage() {
  return (
    <SpacePage title="Naves" subtitle="Frota e sistemas" backHref="/">
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Em construção</p>
        <h2 className="text-3xl font-semibold text-white">A frota será revelada em futuras atualizações.</h2>
        <p className="max-w-xl text-slate-400">Esta seção organizará as naves, módulos e melhorias de combate.</p>
      </div>
    </SpacePage>
  )
}
