import { SpacePage } from '@/components/layout/SpacePage'
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'

export default async function ProfilePage() {
  const client = getSupabaseClient()
  const user = client?.auth.getUser ? await client.auth.getUser().then((result) => result.data.user) : null

  return (
    <SpacePage title="Perfil" subtitle="Dados do piloto" backHref="/">
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Status</p>
        <h2 className="text-3xl font-semibold text-white">{user ? `Piloto ${user.email ?? 'conectado'}` : 'Visitante'}</h2>
        <p className="max-w-xl text-slate-400">
          {isSupabaseConfigured()
            ? 'Sua sessão será sincronizada com o Supabase quando a autenticação estiver ativada.'
            : 'As credenciais do Supabase ainda não foram configuradas. O modo visitante continua disponível.'}
        </p>
      </div>
    </SpacePage>
  )
}
