'use client'

import { use } from 'react'
import Link from 'next/link'
import { Sparkles, Plus } from 'lucide-react'
import { useDeckStore } from '@/stores/deckStore'
import { StudySession } from '@/components/StudySession'

interface PageProps {
  params: Promise<{ deckId: string }>
}

export default function DeckStudyPage({ params }: PageProps) {
  const { deckId } = use(params)
  const deck = useDeckStore((s) => s.decks.find((d) => d.id === deckId))

  if (!deck) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-[#71717a] mb-4">Deck not found.</p>
        <Link href="/decks" className="text-[#6366f1] hover:text-[#a5b4fc] text-sm transition-colors duration-300">
          &larr; Back to decks
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 animate-fade-up">
      <div className="mb-6">
        <Link href="/decks" className="text-[#71717a] hover:text-[#f4f4f5] text-sm transition-colors duration-300">
          &larr; Back to decks
        </Link>
        <h1 className="text-2xl font-bold mt-2 tracking-tight">{deck.name}</h1>
      </div>
      {deck.cards.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-16 text-center">
          <p className="text-[#71717a] text-sm">This deck has no cards yet.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={'/generate?deckId=' + deck.id}
              className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#6366f1] text-white text-sm font-medium hover:bg-[#818cf8] active:scale-[0.97] transition-all duration-300"
            >
              <Sparkles size={15} />
              Import from slides
            </Link>
            <Link
              href={'/decks/' + deck.id + '/add-card'}
              className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-[#232326] text-[#f4f4f5] text-sm font-medium hover:border-[#3f3f46] hover:text-[#a5b4fc] active:scale-[0.97] transition-all duration-300"
            >
              <Plus size={15} />
              Add flashcard
            </Link>
          </div>
        </div>
      ) : (
        <StudySession cards={deck.cards} />
      )}
    </div>
  )
}
