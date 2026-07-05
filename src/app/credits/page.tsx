import { SpacePage } from '@/components/layout/SpacePage'

export default function CreditsPage() {
  return (
    <SpacePage title="Créditos" subtitle="Equipe e visão" backHref="/">
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Equipe</p>
        <h2 className="text-3xl font-semibold text-white">LookSpace Alpha — uma visão de launcher espacial imersivo.</h2>
        <p className="max-w-xl text-slate-400">Em desenvolvimento com foco em atmosfera, identidade visual e primeira experiência jogável.</p>
      </div>
    </SpacePage>
  )
}
