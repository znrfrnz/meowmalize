'use client'
import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, RotateCcw, Shuffle, Trash2, Trophy } from 'lucide-react'
import { Flashcard } from '@/types'
import { useFlashcardStore } from '@/stores/flashcardStore'
import { FlashCard } from '@/components/FlashCard'

type Filter = 'all' | 'definition' | 'enumeration'

interface StudySessionProps {
  cards: Flashcard[]
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function StudySession({ cards }: StudySessionProps) {
  const { progress, markKnown, markLearning, resetProgress, getKnownCount, getLearningCount } =
    useFlashcardStore()

  const [filter, setFilter] = useState<Filter>('all')
  const [deck, setDeck] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)

  // Build filtered deck
  const buildDeck = useCallback(
    (f: Filter) => {
      if (f === 'all') return cards
      return cards.filter((c) => c.type === f)
    },
    [cards]
  )

  // Initialize deck on mount
  useEffect(() => {
    setDeck(buildDeck('all'))
  }, [buildDeck])

  // Rebuild deck when filter changes
  useEffect(() => {
    setDeck(buildDeck(filter))
    setCurrentIndex(0)
    setIsFlipped(false)
    setSessionComplete(false)
  }, [filter, buildDeck])

  const currentCard = deck[currentIndex]
  const knownCount = getKnownCount()
  const learningCount = getLearningCount()

  const goNext = useCallback(() => {
    setIsFlipped(false)
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      setSessionComplete(true)
    }
  }, [currentIndex, deck.length])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setCurrentIndex((i) => i - 1)
    }
  }, [currentIndex])

  const flip = useCallback(() => {
    setIsFlipped((f) => !f)
  }, [])

  const handleShuffle = () => {
    setDeck((d) => shuffleArray(d))
    setCurrentIndex(0)
    setIsFlipped(false)
    setSessionComplete(false)
  }

  const handleReset = () => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      resetProgress()
    }
  }

  const handleReviewLearning = () => {
    const learningCards = cards.filter((c) => progress[c.id] === 'learning')
    if (learningCards.length > 0) {
      setDeck(learningCards)
      setCurrentIndex(0)
      setIsFlipped(false)
      setSessionComplete(false)
    }
  }

  const handleReshuffleAll = () => {
    setFilter('all')
    setDeck(shuffleArray(cards))
    setCurrentIndex(0)
    setIsFlipped(false)
    setSessionComplete(false)
  }

  // Keyboard handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!currentCard || sessionComplete) return
      switch (e.key) {
        case 'ArrowRight':
          goNext()
          break
        case 'ArrowLeft':
          goPrev()
          break
        case ' ':
          e.preventDefault()
          flip()
          break
        case 'k':
        case 'K':
          markKnown(currentCard.id)
          goNext()
          break
        case 'l':
        case 'L':
          markLearning(currentCard.id)
          goNext()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentCard, sessionComplete, goNext, goPrev, flip, markKnown, markLearning])

  // Completion screen
  if (sessionComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-up">
        <div className="bg-[#141414] border border-[#232326] rounded-2xl p-10 flex flex-col items-center gap-6 text-center min-h-[280px] justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="w-16 h-16 rounded-2xl bg-[#6366f1]/10 flex items-center justify-center">
            <Trophy size={32} className="text-[#6366f1]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#f4f4f5] mb-2 tracking-tight">Deck complete</h2>
            <p className="text-sm text-[#71717a]">
              <span className="text-[#34d399] font-medium">{knownCount} Known</span>
              {' · '}
              <span className="text-[#fbbf24] font-medium">{learningCount} Still learning</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            {learningCount > 0 && (
              <button
                onClick={handleReviewLearning}
                className="flex-1 h-10 rounded-xl bg-[#6366f1] text-white text-sm font-medium hover:bg-[#818cf8] active:scale-[0.97] transition-all duration-300"
              >
                Review learning
              </button>
            )}
            <button
              onClick={handleReshuffleAll}
              className="flex-1 h-10 rounded-xl border border-[#232326] bg-[#141414] text-[#f4f4f5] text-sm font-medium hover:bg-[#1c1c1e] hover:border-[#3f3f46] active:scale-[0.97] transition-all duration-300"
            >
              Reshuffle all
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentCard) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center animate-fade-up">
        <p className="text-[#71717a] text-lg">No cards match this filter</p>
        <p className="text-sm text-[#3f3f46] mt-2">Try selecting a different type, or reset your filter.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-5 animate-fade-up">
      {/* Filter + Control Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1.5 p-1 bg-[#141414] border border-[#232326] rounded-xl">
          {(['all', 'definition', 'enumeration'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                filter === f
                  ? 'bg-[#6366f1]/15 text-[#a5b4fc]'
                  : 'text-[#71717a] hover:text-[#f4f4f5]'
              }`}
            >
              {f === 'all' ? 'All' : f === 'definition' ? 'Definitions' : 'Enumerations'}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={handleShuffle}
            aria-label="Shuffle deck"
            className="p-2 rounded-xl bg-[#141414] border border-[#232326] text-[#71717a] hover:text-[#f4f4f5] hover:border-[#3f3f46] active:scale-[0.95] transition-all duration-300"
          >
            <Shuffle size={15} />
          </button>
          <button
            onClick={handleReset}
            aria-label="Reset progress"
            className="p-2 rounded-xl bg-[#141414] border border-[#232326] text-[#f87171] hover:bg-[#f87171]/10 hover:border-[#f87171]/30 active:scale-[0.95] transition-all duration-300"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-xs">
          <span className="text-[#34d399] font-medium">{knownCount} Known</span>
          <span className="text-[#fbbf24] font-medium">{learningCount} Learning</span>
        </div>
        <p className="font-mono text-xs text-[#3f3f46] tabular-nums">
          {currentIndex + 1} / {deck.length}
        </p>
      </div>

      {/* Thin progress track */}
      <div className="h-0.5 bg-[#232326] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6366f1] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <FlashCard card={currentCard} isFlipped={isFlipped} onFlip={flip} />

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => { markKnown(currentCard.id); goNext() }}
          className="flex-1 h-11 rounded-xl bg-[#34d399] text-[#052e16] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#6ee7b7] active:scale-[0.97] transition-all duration-300"
        >
          <CheckCircle size={16} strokeWidth={2} />
          Know it
        </button>
        <button
          onClick={() => { markLearning(currentCard.id); goNext() }}
          className="flex-1 h-11 rounded-xl bg-[#fbbf24] text-[#422006] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#fcd34d] active:scale-[0.97] transition-all duration-300"
        >
          <RotateCcw size={16} strokeWidth={2} />
          Still learning
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-xl bg-[#141414] border border-[#232326] text-[#71717a] text-sm hover:text-[#f4f4f5] hover:border-[#3f3f46] disabled:opacity-20 active:scale-[0.97] transition-all duration-300"
        >
          Prev
        </button>
        <button
          onClick={goNext}
          className="px-4 py-2 rounded-xl bg-[#141414] border border-[#232326] text-[#71717a] text-sm hover:text-[#f4f4f5] hover:border-[#3f3f46] active:scale-[0.97] transition-all duration-300"
        >
          Next
        </button>
      </div>

      {/* Keyboard legend */}
      <p className="text-center text-[11px] text-[#3f3f46] font-mono tracking-wide">
        ← → Navigate · Space Flip · K Know it · L Still learning
      </p>
    </div>
  )
}
