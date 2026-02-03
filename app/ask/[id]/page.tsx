'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Confetti from '@/components/Confetti'

type LinkStatus = 'loading' | 'not-found' | 'answered' | 'pending'

export default function AskPage() {
  const params = useParams()
  const id = params.id as string
  const [status, setStatus] = useState<LinkStatus>('loading')
  const [noClickCount, setNoClickCount] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [answered, setAnswered] = useState<'yes' | 'no' | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)

  const noButtonTexts = [
    'No',
    'Please 🥺',
    'Pretty please?',
    'Okay fine 😔',
  ]

  // Get GIF URL based on noClickCount - using reliable Giphy URLs
  const getGifUrl = () => {
    const gifs = [
      // Initial — happy hopeful cat
      'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    
      // After first No — confused / pleading
      'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
    
      // After second No — sad eyes
      'https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif',
    
      // Final — dramatic crying
      'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',
    ]
    
    return gifs[Math.min(noClickCount, gifs.length - 1)] || gifs[0]
  }

  useEffect(() => {
    const checkLink = async () => {
      try {
        const response = await fetch(`/api/check-link?id=${id}`)
        const data = await response.json()

        if (!response.ok) {
          if (response.status === 404) {
            setStatus('not-found')
          } else if (data.status === 'yes' || data.status === 'no') {
            setStatus('answered')
            setAnswered(data.status)
          } else {
            setStatus('pending')
          }
          return
        }

        if (data.status === 'yes' || data.status === 'no') {
          setStatus('answered')
          setAnswered(data.status)
        } else {
          setStatus('pending')
          setTimeout(() => setShowQuestion(true), 300)
        }
      } catch (error) {
        console.error('Error checking link:', error)
        setStatus('not-found')
      }
    }

    if (id) {
      checkLink()
    }
  }, [id])

  const handleResponse = async (answer: 'yes' | 'no') => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, answer }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Failed to submit response')
        return
      }

      if (answer === 'yes') {
        setShowConfetti(true)
        setTimeout(() => {
          setStatus('answered')
          setAnswered(answer)
        }, 2000)
      } else {
        setStatus('answered')
        setAnswered(answer)
      }
    } catch (error) {
      console.error('Error submitting response:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-300 to-rose-400 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
        <div className="text-center relative z-10">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-6xl animate-pulse shadow-2xl">
            💌
          </div>
          <p className="text-white text-2xl font-bold drop-shadow-lg">Loading something special...</p>
        </div>
      </main>
    )
  }

  if (status === 'not-found') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-300 to-rose-400 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
        <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-8 text-center relative z-10 border-2 border-white/50">
          <img
            src="https://media1.tenor.com/m/t1k5YfXQvCMAAAAd/peach-goma.gif"
            alt="Sad"
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
          <h1 className="text-3xl font-black text-gray-800 mb-3">Link Expired</h1>
          <p className="text-gray-600 font-medium">This link has expired or doesn't exist anymore 💔</p>
        </div>
      </main>
    )
  }

  if (status === 'answered') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-300 to-rose-400 flex items-center justify-center p-4 relative overflow-hidden">
        <Confetti trigger={answered === 'yes'} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
        <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-8 text-center relative z-10 border-2 border-white/50 animate-slide-in">
          <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center text-6xl shadow-2xl ${
            answered === 'yes' 
              ? 'bg-gradient-to-br from-yellow-200 to-pink-200 animate-bounce' 
              : 'bg-gradient-to-br from-gray-200 to-gray-300'
          }`}>
            {answered === 'yes' ? '🎉' : '😢'}
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-3">
            {answered === 'yes' ? (
              <>
                YES! 🎊<br />
                <span className="text-3xl bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  They said YES!
                </span>
              </>
            ) : (
              'Already Answered'
            )}
          </h1>
          <p className="text-gray-600 text-lg font-medium mb-4">
            {answered === 'yes' 
              ? 'Time to plan that perfect date! 💕✨' 
              : "You've already responded to this request."}
          </p>
          {answered === 'yes' && (
            <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border-2 border-pink-200">
              <p className="text-pink-700 font-bold">💌 They'll receive an email notification!</p>
            </div>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-300 to-rose-400 flex items-center justify-center p-4 relative overflow-hidden">
      <Confetti trigger={showConfetti} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
      
      <div className={`max-w-md w-full bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-8 text-center relative z-10 border-2 border-white/50 transition-all duration-700 ${showQuestion ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'}`}>
        {/* Main question */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-6xl shadow-xl animate-pulse">
            💌
          </div>
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent leading-tight">
            Will you go out on a date with me?
          </h1>
          <p className="text-gray-600 text-lg font-semibold">
            Someone special wants to know... 👀💕
          </p>
        </div>

        {/* GIF Container */}
        <div className="mb-8 relative">
          <div className="w-full aspect-square bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 rounded-3xl flex items-center justify-center relative overflow-hidden border-4 border-pink-300 shadow-2xl">
            <img
              src={getGifUrl()}
              alt="Cute"
              className="w-full h-full object-contain transition-all duration-700"
              key={noClickCount}
              loading="eager"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('GIF failed to load:', getGifUrl())
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const fallback = target.parentElement?.querySelector('.gif-fallback')
                if (fallback) {
                  (fallback as HTMLElement).style.display = 'flex'
                }
              }}
            />
            <div className="gif-fallback hidden absolute inset-0 items-center justify-center text-center p-8 flex-col">
              <div className="text-7xl mb-4 animate-bounce">🐱</div>
              <p className="text-gray-600 font-semibold">GIF couldn't load</p>
              <p className="text-xs text-gray-400 mt-2">Check the URL in console</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleResponse('yes')}
            disabled={submitting}
            className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 text-white py-4 rounded-2xl font-black text-lg hover:from-pink-600 hover:via-purple-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(236,72,153,0.4)] hover:shadow-[0_15px_40px_rgba(236,72,153,0.6)] flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="animate-spin text-xl">✨</span>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span className="text-xl">💕</span>
                <span>YES!</span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              if (noClickCount < noButtonTexts.length - 1) {
                setNoClickCount(noClickCount + 1)
                const btn = document.activeElement as HTMLElement
                if (btn) {
                  btn.classList.add('animate-wiggle')
                  setTimeout(() => btn.classList.remove('animate-wiggle'), 500)
                }
              } else {
                handleResponse('no')
              }
            }}
            disabled={submitting}
            className="flex-1 bg-white/80 text-gray-800 py-4 rounded-2xl font-black text-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 border-2 border-gray-200"
          >
            <span className="text-xl">
              {noClickCount === 0 ? '😔' : noClickCount === 1 ? '🥺' : noClickCount === 2 ? '🙏' : '😊'}
            </span>
            <span>{noButtonTexts[noClickCount]}</span>
          </button>
        </div>

        {noClickCount > 0 && noClickCount < noButtonTexts.length - 1 && (
          <p className="mt-6 text-pink-600 font-bold text-sm animate-pulse">Keep trying! 😉</p>
        )}
      </div>
    </main>
  )
}
