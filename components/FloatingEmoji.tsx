'use client'

import { useEffect, useState } from 'react'

interface FloatingEmojiProps {
  emoji: string
  delay?: number
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function FloatingEmoji({ emoji, delay = 0, size = 'medium', className = '' }: FloatingEmojiProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    // Random starting position
    setPosition({
      x: Math.random() * 100,
      y: Math.random() * 100,
    })

    // Continuous rotation
    const rotateInterval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360)
    }, 50)

    // Floating movement
    const floatInterval = setInterval(() => {
      setPosition(prev => ({
        x: prev.x + (Math.random() - 0.5) * 2,
        y: prev.y + (Math.random() - 0.5) * 2,
      }))
    }, 2000)

    return () => {
      clearInterval(rotateInterval)
      clearInterval(floatInterval)
    }
  }, [])

  const sizeClasses = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-7xl',
  }

  return (
    <div
      className={`absolute pointer-events-none ${sizeClasses[size]} ${className}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `rotate(${rotation}deg)`,
        animationDelay: `${delay}s`,
      }}
    >
      <span className="inline-block animate-bounce-emoji">{emoji}</span>
    </div>
  )
}

