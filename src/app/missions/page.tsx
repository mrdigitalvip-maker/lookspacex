import { SpacePage } from '@/components/layout/SpacePage'

export default function MissionsPage() {
  return (
    <SpacePage title="Missões" subtitle="Operações em andamento" backHref="/">
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Em construção</p>
        <h2 className="text-3xl font-semibold text-white">Missões e objetivos estarão prontos em breve.</h2>
        <p className="max-w-xl text-slate-400">A estrutura para campanhas, contratos e sistemas de recompensas já está sendo preparada.</p>
      </div>
    </SpacePage>
  )
}
