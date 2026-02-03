'use client'

import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [link, setLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [devMode, setDevMode] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setLink(null)
    setShowSuccess(false)

    try {
      const response = await fetch('/api/create-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: devMode ? 'dev@example.com' : email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create link')
      }

      setLink(data.url)
      setEmail('')
      setShowSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-300 to-rose-400 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
      
      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-8 relative z-10 border-2 border-white/50 animate-slide-in">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="https://media1.tenor.com/m/K2qL1vWvFzAAAAAd/peach-goma-peach-and-goma.gif"
            alt="Cute"
            className="w-32 h-32 mx-auto mb-4 object-contain"
          />
          <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
            Will You Go Out With Me?
          </h1>
          <p className="text-gray-600 text-lg font-semibold">
            Create a magical link to ask that special someone 💕
          </p>
        </div>

        {/* Dev Mode Toggle */}
        <div className="mb-6 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl shadow-md">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={devMode}
              onChange={(e) => setDevMode(e.target.checked)}
              className="w-5 h-5 rounded border-pink-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
            />
            <span className="text-sm font-bold text-yellow-900">🔧 Dev Mode (no emails/storage)</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-base font-bold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-xl">📧</span>
              <span>Your Email {devMode && <span className="text-xs text-gray-500 font-normal">(optional)</span>}</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={!devMode}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-400 focus:border-pink-500 outline-none transition-all text-base font-medium shadow-inner bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 text-white py-4 rounded-xl font-black text-lg hover:from-pink-600 hover:via-purple-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(236,72,153,0.4)] hover:shadow-[0_15px_40px_rgba(236,72,153,0.6)] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin text-xl">✨</span>
                <span>Creating your magic link...</span>
              </>
            ) : (
              <>
                <span className="text-xl">✨</span>
                <span>Create My Link</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 text-sm flex items-center gap-3 shadow-lg animate-slide-in">
            <span className="text-2xl">😿</span>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {showSuccess && link && (
          <div className="mt-6 p-5 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-xl shadow-xl animate-slide-in">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl animate-bounce">🎉</span>
              <p className="text-base font-black text-green-800">Your link is ready! Share it:</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={link}
                readOnly
                className="flex-1 px-3 py-2 bg-white border-2 border-green-300 rounded-lg text-sm text-gray-700 font-mono shadow-inner"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(link)
                  const btn = document.activeElement as HTMLElement
                  if (btn) {
                    const originalText = btn.textContent
                    btn.textContent = 'Copied! 🎊'
                    setTimeout(() => {
                      btn.textContent = originalText
                    }, 2000)
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition transform hover:scale-110 active:scale-95 shadow-md"
              >
                📋 Copy
              </button>
            </div>
            <p className="mt-3 text-xs text-green-700 font-medium text-center">💡 Send this link to them!</p>
          </div>
        )}
      </div>
    </main>
  )
}
