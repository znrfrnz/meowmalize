'use client'
import { Flashcard } from '@/types'

interface FlashCardProps {
  card: Flashcard
  isFlipped: boolean
  onFlip: () => void
}

export function FlashCard({ card, isFlipped, onFlip }: FlashCardProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === ' ') {
      e.preventDefault()
      onFlip()
    }
  }

  const typeBadge =
    card.type === 'definition' ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-300">
        Definition
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-900 text-violet-300">
        Enumeration
      </span>
    )

  return (
    <div className="card-perspective max-w-2xl w-full mx-auto min-h-[280px]">
      <div
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? 'Flip back' : 'Flip card'}
        onClick={onFlip}
        onKeyDown={handleKeyDown}
        className={`card-3d relative w-full min-h-[280px] transition-transform duration-500 ease-in-out cursor-pointer focus-visible:outline-2 focus-visible:outline-[#6366f1] focus-visible:outline-offset-2 ${
          isFlipped ? 'card-rotated' : ''
        }`}
      >
        {/* Front face */}
        <div className="card-backface-hidden absolute inset-0 bg-[#1a1a1a] border border-[#27272a] rounded-2xl p-6 flex flex-col hover:border-[#6366f1]/40 transition-colors">
          <div className="flex justify-end">{typeBadge}</div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-2xl font-bold text-center text-[#fafafa]">{card.term}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            {card.type === 'enumeration' && (
              <p className="font-mono text-sm text-[#71717a]">List {card.itemCount} items</p>
            )}
            <p className="text-xs text-[#71717a]">Space or click to flip</p>
          </div>
        </div>

        {/* Back face */}
        <div className="card-backface-hidden card-rotated absolute inset-0 bg-[#1a1a1a] border border-[#27272a] rounded-2xl p-6 flex flex-col">
          <div className="flex justify-end">{typeBadge}</div>
          <div className="flex-1 flex items-center justify-center overflow-auto">
            {card.type === 'definition' ? (
              <p className="text-base text-[#fafafa] text-center leading-relaxed">{card.definition}</p>
            ) : (
              <ol className="list-decimal list-inside space-y-2 text-left w-full">
                {card.items?.map((item, i) => (
                  <li key={i} className="text-base text-[#fafafa] leading-relaxed">
                    {item}
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="flex justify-center mt-2">
            <p className="text-xs text-[#71717a]">Space or click to flip back</p>
          </div>
        </div>
      </div>
    </div>
  )
}
