'use client'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6 text-center text-slate-100">
      <div className="max-w-md rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-8 backdrop-blur-xl">
        <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Falha inesperada</p>
        <h2 className="mt-4 text-2xl font-semibold">Algo saiu do controle.</h2>
        <p className="mt-3 text-sm text-slate-400">O universo retornará em breve. {error.message}</p>
      </div>
    </div>
  )
}
