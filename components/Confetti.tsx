'use client'

import { useEffect, useState } from 'react'

interface ConfettiParticle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  speedX: number
  speedY: number
  shape: 'circle' | 'square'
}

const colors = ['#FF6B9D', '#C44569', '#FFB6C1', '#FFC0CB', '#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB']

export default function Confetti({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([])

  useEffect(() => {
    if (!trigger) return

    const newParticles: ConfettiParticle[] = []
    // Create more particles for a more dramatic effect
    for (let i = 0; i < 150; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -Math.random() * 100 - 50,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 12 + 6,
        speedX: (Math.random() - 0.5) * 6,
        speedY: Math.random() * 4 + 3,
        shape: Math.random() > 0.5 ? 'circle' : 'square',
      })
    }
    setParticles(newParticles)

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            rotation: p.rotation + 8,
            speedY: p.speedY + 0.1, // Gravity effect
          }))
          .filter((p) => p.y < window.innerHeight + 100)
      )
    }, 16)

    // Clear particles after animation
    setTimeout(() => {
      setParticles([])
    }, 5000)

    return () => clearInterval(interval)
  }, [trigger])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute transition-opacity duration-300"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: `rotate(${particle.rotation}deg)`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: particle.shape === 'circle' ? '50%' : '20%',
            boxShadow: `0 0 ${particle.size / 2}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  )
}

