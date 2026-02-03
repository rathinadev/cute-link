'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedCatProps {
  noClickCount: number
  onHover?: boolean
}

export default function AnimatedCat({ noClickCount, onHover }: AnimatedCatProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const x = e.clientX - centerX
        const y = e.clientY - centerY
        
        // Only update if mouse is within reasonable distance
        if (Math.abs(x) < 500 && Math.abs(y) < 500) {
          setMousePos({ x, y })
        }
      }
    }

    if (onHover) {
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [onHover])

  // Make cat always look at mouse when hovering is enabled
  useEffect(() => {
    if (onHover) {
      setIsHovering(true)
    }
  }, [onHover])

  // Different cat expressions based on noClickCount
  const getCatEmoji = () => {
    if (noClickCount === 0) return '🐱'
    if (noClickCount === 1) return '😿'
    if (noClickCount === 2) return '🥺'
    return '😭'
  }

  // Calculate rotation based on mouse position (smooth following)
  const baseRotation = onHover && isHovering 
    ? Math.atan2(mousePos.y, mousePos.x) * (180 / Math.PI) * 0.3 // Dampen rotation
    : 0

  // Calculate scale based on distance from center
  const distance = Math.sqrt(mousePos.x ** 2 + mousePos.y ** 2)
  const scale = onHover && isHovering && distance > 0
    ? 1 + Math.min(distance / 300, 0.2)
    : 1

  // Add extra bounce when noClickCount increases
  const bounceScale = noClickCount > 0 ? 1 + (noClickCount * 0.05) : 1

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
    >
      <div
        className="text-9xl transition-all duration-200 ease-out animate-dance"
        style={{
          transform: `rotate(${baseRotation}deg) scale(${scale * bounceScale})`,
          transformOrigin: 'center',
        }}
      >
        {getCatEmoji()}
      </div>
      
      {/* Floating hearts around cat */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 text-4xl animate-float-heart" style={{ animationDelay: '0s' }}>💕</div>
        <div className="absolute top-1/4 left-0 text-3xl animate-float-heart" style={{ animationDelay: '0.5s' }}>✨</div>
        <div className="absolute top-1/4 right-0 text-3xl animate-float-heart" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute bottom-0 left-1/4 text-3xl animate-float-heart" style={{ animationDelay: '0.7s' }}>💖</div>
        <div className="absolute bottom-0 right-1/4 text-3xl animate-float-heart" style={{ animationDelay: '1.2s' }}>💝</div>
      </div>
    </div>
  )
}

