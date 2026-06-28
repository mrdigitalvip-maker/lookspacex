import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

let supabaseClient: ReturnType<typeof createBrowserClient> | undefined

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseClient() deve ser chamado apenas no cliente')
  }

  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
  }

  return supabaseClient
}
