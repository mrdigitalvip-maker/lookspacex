'use client'

import { useEffect, useRef } from 'react'

type Star = {
  x: number
  y: number
  radius: number
  opacity: number
  twinkle: number
  drift: number
}

type Particle = {
  x: number
  y: number
  radius: number
  opacity: number
  driftX: number
  driftY: number
}

type Planet = {
  x: number
  y: number
  radius: number
  opacity: number
  color: string
}

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    let animationId = 0
    let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    const resizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const handlePointerMove = (event: MouseEvent) => {
      pointer = { x: event.clientX, y: event.clientY }
    }

    resizeCanvas()

    const stars: Star[] = Array.from({ length: 400 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.2 + 0.5,
      opacity: Math.random() * 0.7 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      drift: Math.random() * 0.01 + 0.002,
    }))

    const particles: Particle[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.3 + 0.4,
      opacity: Math.random() * 0.55 + 0.15,
      driftX: (Math.random() - 0.5) * 0.18,
      driftY: (Math.random() - 0.5) * 0.12,
    }))

    const planets: Planet[] = [
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.78, radius: 140, opacity: 0.18, color: '#4f46e5' },
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.2, radius: 95, opacity: 0.14, color: '#06b6d4' },
    ]

    const nebulae = [
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.35, radius: 220, color: 'rgba(168,85,247,0.16)' },
      { x: window.innerWidth * 0.7, y: window.innerHeight * 0.25, radius: 260, color: 'rgba(6,182,212,0.14)' },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.8, radius: 280, color: 'rgba(79,70,229,0.12)' },
    ]

    const drawScene = (time: number) => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const gradient = context.createLinearGradient(0, 0, 0, window.innerHeight)
      gradient.addColorStop(0, '#01020b')
      gradient.addColorStop(1, '#030712')
      context.fillStyle = gradient
      context.fillRect(0, 0, window.innerWidth, window.innerHeight)

      nebulae.forEach((nebula, index) => {
        const glow = context.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius)
        glow.addColorStop(0, nebula.color)
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        context.globalAlpha = 0.96
        context.fillStyle = glow
        context.beginPath()
        context.arc(nebula.x + Math.sin(time * 0.00006 + index) * 20, nebula.y + Math.cos(time * 0.00005 + index) * 20, nebula.radius, 0, Math.PI * 2)
        context.fill()
      })

      planets.forEach((planet, index) => {
        const glow = context.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, planet.radius)
        glow.addColorStop(0, planet.color)
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        context.globalAlpha = planet.opacity
        context.fillStyle = glow
        context.beginPath()
        context.arc(planet.x, planet.y, planet.radius + index * 8, 0, Math.PI * 2)
        context.fill()
      })

      context.globalAlpha = 1
      stars.forEach((star) => {
        const pulse = 0.5 + Math.sin(time * 0.001 + star.twinkle) * 0.5
        const parallaxX = (pointer.x - window.innerWidth / 2) * 0.0025 * (star.radius / 2)
        const parallaxY = (pointer.y - window.innerHeight / 2) * 0.0025 * (star.radius / 2)
        const x = star.x + parallaxX
        const y = star.y + parallaxY

        context.beginPath()
        context.arc(x, y, star.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(255, 255, 255, ${star.opacity * pulse})`
        context.fill()

        star.x += star.drift
        if (star.x > window.innerWidth + 4) {
          star.x = -4
        }
      })

      particles.forEach((particle) => {
        const x = particle.x + Math.sin(time * 0.0004 + particle.driftX * 20) * 2
        const y = particle.y + Math.cos(time * 0.0003 + particle.driftY * 20) * 2
        context.beginPath()
        context.arc(x, y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(0, 245, 255, ${particle.opacity})`
        context.fill()
        particle.x += particle.driftX
        particle.y += particle.driftY
        if (particle.x < -4 || particle.x > window.innerWidth + 4) {
          particle.x = Math.random() * window.innerWidth
        }
        if (particle.y < -4 || particle.y > window.innerHeight + 4) {
          particle.y = Math.random() * window.innerHeight
        }
      })

      animationId = window.requestAnimationFrame(drawScene)
    }

    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('resize', resizeCanvas)
    animationId = window.requestAnimationFrame(drawScene)

    return () => {
      window.cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
}
