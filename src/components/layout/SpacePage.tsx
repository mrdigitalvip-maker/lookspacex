import Link from 'next/link'
import StarfieldCanvas from '@/components/ui/StarfieldCanvas'

type SpacePageProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
  backHref?: string
  showBackButton?: boolean
}

export function SpacePage({
  title,
  subtitle,
  children,
  backHref = '/',
  showBackButton = true,
}: SpacePageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <StarfieldCanvas />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,245,255,0.08),_transparent_45%)]" />
      <div className="relative z-10 flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-14">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-full border border-cyan-400/20 bg-slate-950/55 px-4 py-3 backdrop-blur-xl">
          <div>
            <p className="font-orbitron text-xs uppercase tracking-[0.4em] text-cyan-300">LookSpace</p>
            <h1 className="font-orbitron text-xl font-semibold text-white">{title}</h1>
            {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
          </div>
          {showBackButton ? (
            <Link
              href={backHref}
              className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20"
            >
              Voltar ao Menu
            </Link>
          ) : null}
        </header>
        <section className="flex-1 rounded-[2rem] border border-cyan-400/20 bg-slate-950/60 p-6 shadow-[0_0_80px_rgba(0,245,255,0.08)] backdrop-blur-2xl">
          {children}
        </section>
      </div>
    </main>
  )
}
