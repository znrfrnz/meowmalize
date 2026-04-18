'use client'

import { use } from 'react'
import Link from 'next/link'
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
      <div className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-[#71717a] mb-4">Deck not found.</p>
        <Link href="/decks" className="text-[#6366f1] hover:text-[#a5b4fc] text-sm transition-colors">
          ← Back to Decks
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Link href="/decks" className="text-[#71717a] hover:text-[#fafafa] text-sm transition-colors">
          ← Back to Decks
        </Link>
        <h1 className="text-2xl font-bold mt-2">{deck.name}</h1>
      </div>
      {deck.cards.length === 0 ? (
        <p className="text-[#71717a]">This deck has no cards yet.</p>
      ) : (
        <StudySession cards={deck.cards} />
      )}
    </div>
  )
}
