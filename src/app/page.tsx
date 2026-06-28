'use client'

import { useEffect, useRef, useState } from 'react'

const ROTATING_TEXTS = [
  '327 SISTEMAS ESTELARES AGUARDAM EXPLORAÇÃO',
  '48 CLASSES DE NAVES DISPONÍVEIS',
  'MISSÕES ÉPICAS EM GALÁXIAS DESCONHECIDAS',
  'MODO FOTO · STARBASES · INVENTÁRIO PROFUNDO',
]

const TYPEWRITER_TEXT = 'UM UNIVERSO PROCEDURAL. MISSÕES ÉPICAS. SUA FROTA. SUA HISTÓRIA.'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const [typewriterDone, setTypewriterDone] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const [rotatingIndex, setRotatingIndex] = useState(0)
  const [rotatingVisible, setRotatingVisible] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [booting, setBooting] = useState(false)
  const [energy, setEnergy] = useState(0)
  const [pageReady, setPageReady] = useState(false)

  // Canvas stars
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 350 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.3,
      speed: Math.random() * 0.25 + 0.05,
      opacity: Math.random(),
      blink: Math.random() > 0.8,
      blinkOffset: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.85,
    }))

    let frame = 0
    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Nebula
      const nebulae = [
        { x: canvas.width * 0.15, y: canvas.height * 0.2, r: 400, color: 'rgba(0,245,255,0.05)' },
        { x: canvas.width * 0.85, y: canvas.height * 0.8, r: 350, color: 'rgba(255,0,170,0.04)' },
        { x: canvas.width * 0.5, y: canvas.height * 0.5, r: 300, color: 'rgba(102,0,255,0.04)' },
      ]
      nebulae.forEach(n => {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r)
        g.addColorStop(0, n.color)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      // Planet
      const px = canvas.width - 160
      const py = canvas.height - 120
      const pr = 140
      const pg = ctx.createRadialGradient(px - 30, py - 30, 10, px, py, pr)
      pg.addColorStop(0, '#2a0055')
      pg.addColorStop(1, '#000005')
      ctx.beginPath()
      ctx.arc(px, py, pr, 0, Math.PI * 2)
      ctx.fillStyle = pg
      ctx.shadowBlur = 20
      ctx.shadowColor = '#00f5ff'
      ctx.fill()
      ctx.shadowBlur = 0

      // Stars
      stars.forEach(s => {
        s.x += s.speed * 0.3
        s.y += s.speed * 0.15
        if (s.x > canvas.width) s.x = 0
        if (s.y > canvas.height) s.y = 0

        let op = s.opacity
        if (s.blink) op = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.02 + s.blinkOffset))

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = s.gold
          ? `rgba(255,215,0,${op})`
          : `rgba(255,255,255,${op})`
        ctx.fill()
      })

      frame++
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Page intro
  useEffect(() => {
    setTimeout(() => setPageReady(true), 100)
    setTimeout(() => setEnergy(87), 300)
  }, [])

  // Typewriter
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayText(TYPEWRITER_TEXT.slice(0, i))
      i++
      if (i > TYPEWRITER_TEXT.length) {
        clearInterval(interval)
        setTypewriterDone(true)
      }
    }, 45)
    return () => clearInterval(interval)
  }, [])

  // Rotating texts
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingVisible(false)
      setTimeout(() => {
        setRotatingIndex(i => (i + 1) % ROTATING_TEXTS.length)
        setRotatingVisible(true)
      }, 400)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Coordinates seconds
  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => (s + 1) % 60), 1000)
    return () => clearInterval(interval)
  }, [])

  // Glitch
  useEffect(() => {
    const interval = setInterval(() => {
      if (!titleRef.current) return
      titleRef.current.classList.add('glitch')
      setTimeout(() => titleRef.current?.classList.remove('glitch'), 200)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleMission = () => {
    setBooting(true)
    setTimeout(() => setBooting(false), 300)
  }

  return (
    <main
      className={`relative min-h-screen transition-opacity duration-1000 ${pageReady ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: '#000005' }}
    >
      {booting && (
        <div
          className="fixed inset-0 z-[500] pointer-events-none boot-flash"
          style={{ background: 'rgba(0,245,255,0.12)' }}
        />
      )}

      {/* Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      {/* Corner brackets */}
      <div className="corner corner-tl" />
      <div className="corner corner-tr" />
      <div className="corner corner-bl hidden sm:block" />
      <div className="corner corner-br" />

      {/* HUD Top Left */}
      <div
        className="fixed top-8 left-8 z-[100] hidden md:block"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        <p className="text-xs mb-1" style={{ color: '#00f5ff' }}>LOOKSPACE OS v2.4.1</p>
        <p className="text-xs blink" style={{ color: '#00f5ff' }}>NAV SYSTEM: ONLINE</p>
        <p className="text-xs mt-2" style={{ color: '#4a9eff' }}>
          RA: 14h 29m {String(43 + (seconds % 17)).padStart(2, '0')}.{seconds % 9}s
        </p>
        <p className="text-xs" style={{ color: '#4a9eff' }}>DEC: -62° 40′ 46″</p>
        <p className="text-xs" style={{ color: '#4a9eff' }}>DIST: 4.243 LY</p>
      </div>

      {/* HUD Top Right */}
      <div
        className="fixed top-8 right-8 z-[100] text-right"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        <p className="text-xs font-orbitron mb-1" style={{ color: '#00f5ff', fontFamily: "'Orbitron', monospace" }}>
          CAPT. BRUNO BRANDÃO
        </p>
        <p className="text-xs mb-2" style={{ color: '#4a9eff' }}>CLASSE: EXPLORADOR ESTELAR</p>
        <div className="flex items-center justify-end gap-2 mb-1">
          <span className="text-xs" style={{ color: '#4a4a6a' }}>ENERGIA</span>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ width: '80px', background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.3)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-[3000ms] ease-out"
              style={{ width: `${energy}%`, background: '#00f5ff', boxShadow: '0 0 8px #00f5ff' }}
            />
          </div>
          <span className="text-xs" style={{ color: '#00f5ff' }}>{energy}%</span>
        </div>
        <p className="text-xs" style={{ color: '#4a9eff' }}>PROPULSÃO: NOMINAL</p>
      </div>

      {/* HUD Bottom Left — Radar */}
      <div className="fixed bottom-8 left-8 z-[100] hidden md:block">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="38" stroke="rgba(0,245,255,0.15)" strokeWidth="1" fill="none" />
          <circle cx="40" cy="40" r="26" stroke="rgba(0,245,255,0.1)" strokeWidth="1" fill="none" />
          <circle cx="40" cy="40" r="14" stroke="rgba(0,245,255,0.1)" strokeWidth="1" fill="none" />
          <line x1="40" y1="2" x2="40" y2="78" stroke="rgba(0,245,255,0.08)" strokeWidth="1" />
          <line x1="2" y1="40" x2="78" y2="40" stroke="rgba(0,245,255,0.08)" strokeWidth="1" />
          <g style={{ transformOrigin: '40px 40px', animation: 'orbitRotate 4s linear infinite' }}>
            <line x1="40" y1="40" x2="40" y2="2" stroke="rgba(0,245,255,0.5)" strokeWidth="1" />
          </g>
          <circle cx="55" cy="22" r="2" fill="#00f5ff" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="25" cy="58" r="2" fill="#ff00aa" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.1s" repeatCount="indefinite" />
          </circle>
          <circle cx="62" cy="50" r="1.5" fill="#ffd700" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
        <p
          className="text-xs mt-1"
          style={{ color: '#4a4a6a', fontFamily: "'Share Tech Mono', monospace" }}
        >
          RADAR: SETOR 7-ALPHA
        </p>
      </div>

      {/* HUD Bottom Right */}
      <div
        className="fixed bottom-8 right-8 z-[100] text-right"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        <p className="text-xs" style={{ color: '#4a4a6a' }}>© 2025 LOOKSPACE</p>
        <p className="text-xs" style={{ color: '#4a4a6a' }}>DEV: BRUNO BRANDÃO</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f5ff" strokeWidth="2">
            <path d="M1 6s4-4 11-4 11 4 11 4" /><path d="M5 10s3-3 7-3 7 3 7 3" />
            <path d="M9 14s1-1 3-1 3 1 3 1" /><circle cx="12" cy="18" r="1" fill="#00f5ff" />
          </svg>
          <span className="text-xs blink" style={{ color: '#00f5ff' }}>TRANSMISSÃO ATIVA</span>
        </div>
      </div>

      {/* HERO — Centro */}
      <section className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 text-center">

        {/* Logo SVG */}
        <div className="glow-pulse mb-8" style={{ width: 'clamp(72px, 15vw, 130px)', height: 'clamp(72px, 15vw, 130px)' }}>
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <ellipse cx="100" cy="100" rx="70" ry="28"
              stroke="#ff00aa" strokeWidth="1.5" fill="none" opacity="0.7"
              style={{ transformOrigin: '100px 100px', animation: 'orbitRotate 20s linear infinite' }}
            />
            <ellipse cx="100" cy="100" rx="28" ry="70"
              stroke="#ff00aa" strokeWidth="1" fill="none" opacity="0.4"
              style={{ transformOrigin: '100px 100px', animation: 'orbitRotate 30s linear infinite reverse' }}
            />
            <line x1="60" y1="150" x2="140" y2="70" stroke="#00f5ff" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="145" cy="65" r="14" stroke="#00f5ff" strokeWidth="2" fill="none" />
            <circle cx="145" cy="65" r="6" stroke="#00f5ff" strokeWidth="1.5" fill="none" />
            <circle cx="55" cy="155" r="8" stroke="#00f5ff" strokeWidth="2" fill="none" />
            <line x1="48" y1="163" x2="38" y2="178" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="62" y1="163" x2="62" y2="180" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="55" y1="163" x2="45" y2="182" stroke="#00f5ff" strokeWidth="1" strokeLinecap="round" />
            <path d="M138 50 L142 58 L138 66 L134 58 Z" fill="#ffd700" opacity="0.9" />
          </svg>
        </div>

        {/* Título */}
        <div ref={titleRef} className="mb-4" style={{ lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "'Orbitron', monospace",
              fontWeight: 900,
              fontSize: 'clamp(2.8rem, 9vw, 9rem)',
              color: '#e8e8f0',
              letterSpacing: '0.1em',
            }}
          >
            LOOK
          </span>
          <span
            style={{
              fontFamily: "'Orbitron', monospace",
              fontWeight: 900,
              fontSize: 'clamp(2.8rem, 9vw, 9rem)',
              color: '#00f5ff',
              letterSpacing: '0.1em',
              textShadow: '0 0 30px rgba(0,245,255,0.6), 0 0 60px rgba(0,245,255,0.3)',
            }}
          >
            SPACE
          </span>
        </div>

        {/* Subtítulo */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 max-w-16" style={{ background: '#00f5ff', opacity: 0.5 }} />
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 'clamp(0.65rem, 2vw, 0.85rem)',
              color: '#4a9eff',
              letterSpacing: '0.3em',
            }}
          >
            EXPLORAÇÃO ESPACIAL · TEMPORADA 01
          </p>
          <div className="h-px flex-1 max-w-16" style={{ background: '#00f5ff', opacity: 0.5 }} />
        </div>

        {/* Typewriter */}
        <p
          className="mb-2 max-w-2xl"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 'clamp(0.75rem, 2vw, 1rem)',
            color: '#e8e8f0',
            letterSpacing: '0.08em',
            minHeight: '2rem',
          }}
        >
          {displayText}
          {!typewriterDone && (
            <span className="blink" style={{ color: '#00f5ff' }}>|</span>
          )}
          {typewriterDone && (
            <span className="blink" style={{ color: '#00f5ff' }}>|</span>
          )}
        </p>

        {/* Rotating text */}
        <p
          className="mb-10 transition-opacity duration-400"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)',
            color: '#ffd700',
            letterSpacing: '0.15em',
            opacity: rotatingVisible ? 1 : 0,
            minHeight: '1.5rem',
          }}
        >
          ▶ {ROTATING_TEXTS[rotatingIndex]}
        </p>

        {/* Botão */}
        <button
          onClick={handleMission}
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            color: '#00f5ff',
            background: 'transparent',
            border: '1px solid #00f5ff',
            padding: 'clamp(12px, 2vw, 16px) clamp(28px, 6vw, 56px)',
            letterSpacing: '0.2em',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textShadow: '0 0 10px rgba(0,245,255,0.5)',
          }}
          onMouseEnter={e => {
            const t = e.currentTarget
            t.style.background = 'rgba(0,245,255,0.08)'
            t.style.boxShadow = '0 0 30px rgba(0,245,255,0.3), inset 0 0 20px rgba(0,245,255,0.05)'
          }}
          onMouseLeave={e => {
            const t = e.currentTarget
            t.style.background = 'transparent'
            t.style.boxShadow = 'none'
          }}
        >
          [ INICIAR MISSÃO ]
        </button>

        <p
          className="mt-4"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.7rem',
            color: '#4a4a6a',
            letterSpacing: '0.2em',
          }}
        >
          EM DESENVOLVIMENTO · FASE ALPHA
        </p>
      </section>

      {/* SEÇÃO — Cards */}
      <section className="relative z-20 px-4 pb-32 pt-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {[
            {
              icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="10" stroke="#00f5ff" strokeWidth="1.5" />
                  <ellipse cx="24" cy="24" rx="22" ry="8" stroke="#00f5ff" strokeWidth="1" opacity="0.5" />
                  <circle cx="24" cy="24" r="3" fill="#00f5ff" opacity="0.6" />
                </svg>
              ),
              title: 'GALÁXIAS VIVAS',
              text: 'Sistemas estelares gerados proceduralmente. Cada planeta, único. Cada nebulosa, real.',
              footer: '327 SISTEMAS · INFINITAS POSSIBILIDADES',
            },
            {
              icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" stroke="#00f5ff" strokeWidth="1.5" />
                  <circle cx="24" cy="24" r="12" stroke="#00f5ff" strokeWidth="1" opacity="0.5" />
                  <circle cx="24" cy="24" r="4" stroke="#ff00aa" strokeWidth="1.5" />
                  <line x1="24" y1="4" x2="24" y2="12" stroke="#00f5ff" strokeWidth="1.5" />
                  <line x1="24" y1="36" x2="24" y2="44" stroke="#00f5ff" strokeWidth="1.5" />
                  <line x1="4" y1="24" x2="12" y2="24" stroke="#00f5ff" strokeWidth="1.5" />
                  <line x1="36" y1="24" x2="44" y2="24" stroke="#00f5ff" strokeWidth="1.5" />
                </svg>
              ),
              title: 'MISSÕES ÉPICAS',
              text: 'Contratos. Anomalias cósmicas. Batalhas estelares. Você define o destino da tripulação.',
              footer: '48 TIPOS DE MISSÃO · DIFICULDADE ADAPTATIVA',
            },
            {
              icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 8 L38 20 L38 34 L24 40 L10 34 L10 20 Z" stroke="#00f5ff" strokeWidth="1.5" fill="none" />
                  <path d="M24 14 L32 22 L32 30 L24 34 L16 30 L16 22 Z" stroke="#00f5ff" strokeWidth="1" fill="none" opacity="0.5" />
                  <line x1="24" y1="8" x2="24" y2="4" stroke="#ff00aa" strokeWidth="2" />
                  <line x1="10" y1="20" x2="6" y2="17" stroke="#ff00aa" strokeWidth="1.5" />
                  <line x1="38" y1="20" x2="42" y2="17" stroke="#ff00aa" strokeWidth="1.5" />
                </svg>
              ),
              title: 'SUA FROTA',
              text: 'Construa, customize e evolua suas naves. Inventário profundo. Tripulação com personalidade.',
              footer: '12 CLASSES DE NAVE · UPGRADES ILIMITADOS',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="group transition-all duration-300"
              style={{
                background: 'rgba(0,0,10,0.75)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0,245,255,0.25)',
                borderRadius: '4px',
                padding: '2rem',
              }}
              onMouseEnter={e => {
                const t = e.currentTarget
                t.style.borderColor = 'rgba(0,245,255,0.8)'
                t.style.transform = 'translateY(-6px)'
                t.style.boxShadow = '0 0 40px rgba(0,245,255,0.12)'
              }}
              onMouseLeave={e => {
                const t = e.currentTarget
                t.style.borderColor = 'rgba(0,245,255,0.25)'
                t.style.transform = 'translateY(0)'
                t.style.boxShadow = 'none'
              }}
            >
              <div className="mb-4">{card.icon}</div>
              <h3
                className="mb-3"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: '0.9rem',
                  color: '#00f5ff',
                  letterSpacing: '0.15em',
                }}
              >
                {card.title}
              </h3>
              <p
                className="mb-4"
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.85rem',
                  color: '#e8e8f0',
                  lineHeight: 1.7,
                  opacity: 0.85,
                }}
              >
                {card.text}
              </p>
              <p
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.7rem',
                  color: '#4a9eff',
                  letterSpacing: '0.1em',
                  borderTop: '1px solid rgba(0,245,255,0.15)',
                  paddingTop: '0.75rem',
                }}
              >
                {card.footer}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="h-px max-w-xs mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)' }} />
          <p
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 'clamp(1rem, 3vw, 1.4rem)',
              fontWeight: 900,
              background: 'linear-gradient(90deg, #00f5ff, #ff00aa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.1em',
            }}
          >
            BRUNO BRANDÃO
          </p>
          <p
            className="mt-2"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.75rem',
              color: '#4a4a6a',
              letterSpacing: '0.2em',
            }}
          >
            LOOKSPACE · TODOS OS DIREITOS RESERVADOS · 2025
          </p>
        </div>
      </section>
    </main>
  )
}
