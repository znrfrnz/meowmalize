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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-2xl p-10 flex flex-col items-center gap-6 text-center min-h-[280px] justify-center">
          <Trophy size={48} className="text-[#6366f1]" />
          <div>
            <h2 className="text-2xl font-bold text-[#fafafa] mb-2">Deck Complete!</h2>
            <p className="text-sm text-[#71717a]">
              <span className="text-[#22c55e] font-medium">{knownCount} Known</span>
              {' · '}
              <span className="text-[#f59e0b] font-medium">{learningCount} Still Learning</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            {learningCount > 0 && (
              <button
                onClick={handleReviewLearning}
                className="flex-1 h-11 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#4f46e5] transition-colors"
              >
                Review Still Learning
              </button>
            )}
            <button
              onClick={handleReshuffleAll}
              className="flex-1 h-11 rounded-lg border border-[#27272a] bg-[#1a1a1a] text-[#fafafa] text-sm font-medium hover:bg-[#27272a] transition-colors"
            >
              Reshuffle All
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentCard) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-[#71717a] text-lg">No cards match this filter</p>
        <p className="text-sm text-[#71717a] mt-2">Try selecting a different type, or reset your filter.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Filter + Control Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {(['all', 'definition', 'enumeration'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-[#6366f1] text-white'
                  : 'bg-[#27272a] text-[#71717a] hover:text-[#fafafa]'
              }`}
            >
              {f === 'all' ? 'All' : f === 'definition' ? 'Definitions' : 'Enumerations'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShuffle}
            aria-label="Shuffle deck"
            className="p-2 rounded-lg bg-[#27272a] text-[#71717a] hover:text-[#fafafa] transition-colors"
          >
            <Shuffle size={16} />
          </button>
          <button
            onClick={handleReset}
            aria-label="Reset progress"
            className="p-2 rounded-lg bg-[#27272a] text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-xs">
          <span className="text-[#22c55e] font-medium">{knownCount} Known</span>
          <span className="text-[#f59e0b] font-medium">{learningCount} Learning</span>
        </div>
        <p className="font-mono text-sm text-[#71717a]">
          Card {currentIndex + 1} of {deck.length}
        </p>
      </div>

      {/* Flashcard */}
      <FlashCard card={currentCard} isFlipped={isFlipped} onFlip={flip} />

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => { markKnown(currentCard.id); goNext() }}
          className="flex-1 h-11 rounded-lg bg-[#22c55e] text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#16a34a] transition-colors"
        >
          <CheckCircle size={18} />
          Know it
        </button>
        <button
          onClick={() => { markLearning(currentCard.id); goNext() }}
          className="flex-1 h-11 rounded-lg bg-[#f59e0b] text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#d97706] transition-colors"
        >
          <RotateCcw size={18} />
          Still learning
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-lg bg-[#27272a] text-[#71717a] text-sm hover:text-[#fafafa] disabled:opacity-30 transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={goNext}
          className="px-4 py-2 rounded-lg bg-[#27272a] text-[#71717a] text-sm hover:text-[#fafafa] transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Keyboard legend */}
      <p className="text-center text-xs text-[#71717a] font-mono">
        ← → Navigate&nbsp;&nbsp;|&nbsp;&nbsp;Space Flip&nbsp;&nbsp;|&nbsp;&nbsp;K Know it&nbsp;&nbsp;|&nbsp;&nbsp;L Still learning
      </p>
    </div>
  )
}
