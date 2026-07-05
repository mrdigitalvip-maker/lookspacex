'use client'

import { useEffect, useMemo, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

type LoginModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const title = useMemo(() => (tab === 'login' ? 'LOGIN' : 'CADASTRO'), [tab])

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatusMessage('')

    const client = getSupabaseClient()

    if (!client) {
      setStatusMessage('Supabase ainda não está configurado. Você pode continuar como visitante.')
      setIsSubmitting(false)
      return
    }

    try {
      if (tab === 'register') {
        const { error } = await client.auth.signUp({ email, password })
        if (error) {
          throw error
        }
        setStatusMessage('Conta criada com sucesso. Verifique seu e-mail se o fluxo de confirmação estiver ativo.')
      } else {
        const { error } = await client.auth.signInWithPassword({ email, password })
        if (error) {
          throw error
        }
        setStatusMessage('Sessão iniciada com sucesso.')
      }

      setPassword('')
      onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível concluir a autenticação.'
      setStatusMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-xl" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-[2rem] border border-cyan-400/20 bg-slate-950/90 p-6 shadow-[0_0_80px_rgba(0,245,255,0.16)] backdrop-blur-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-orbitron text-xs uppercase tracking-[0.35em] text-cyan-300">ACESSO</p>
            <h3 className="text-2xl font-semibold text-white">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-slate-400 transition hover:text-cyan-200">
            Fechar
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-1">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-[0.25em] transition ${tab === 'login' ? 'bg-cyan-400/20 text-cyan-200' : 'text-slate-400'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-[0.25em] transition ${tab === 'register' ? 'bg-cyan-400/20 text-cyan-200' : 'text-slate-400'}`}
          >
            Cadastro
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-2xl border border-cyan-400/20 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-0"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Senha"
              required
              minLength={6}
              className="w-full rounded-2xl border border-cyan-400/20 bg-slate-900/70 px-4 py-3 pr-24 text-sm text-white outline-none ring-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.2em] text-cyan-200"
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-400/20 via-cyan-400/10 to-violet-500/20 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Aguarde...' : tab === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        {statusMessage ? <p className="mt-4 text-sm text-cyan-200">{statusMessage}</p> : null}

        <div className="mt-4 text-center text-sm text-slate-400">
          <button type="button" className="transition hover:text-cyan-200">Esqueci minha senha</button>
        </div>

        <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
          <div className="h-px flex-1 bg-slate-700" />
          <span>ou continue com</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        <div className="mt-6 grid gap-2">
          {['Google', 'Discord', 'GitHub'].map((provider) => (
            <button key={provider} type="button" className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-left text-sm text-slate-300">
              {provider}
              <span className="ml-2 rounded-full border border-cyan-400/20 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-300">Em breve</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-2xl border border-cyan-400/20 bg-slate-900/70 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-300 hover:text-cyan-100"
        >
          Entrar como Visitante
        </button>
      </div>
    </div>
  )
}
