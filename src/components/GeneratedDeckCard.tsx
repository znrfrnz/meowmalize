'use client'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { useDeckStore } from '@/stores/deckStore'

export function GeneratedDeckCard() {
  const decks = useDeckStore((s) => s.decks)
  const recent = [...decks]
    .filter((d) => !d.locked)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
  if (!recent) return null
  return (
    <div className="border border-[#6366f1]/30 rounded-xl p-6 bg-[#1a1a1a] flex flex-col gap-4 hover:-translate-y-0.5 hover:border-[#6366f1]/60 transition-all">
      <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
        <Sparkles size={20} className="text-[#6366f1]" />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-1">{recent.name}</h2>
        <p className="text-sm text-[#71717a]">
          {recent.cards.length} card{recent.cards.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="mt-auto flex flex-col gap-2">
        <Link
          href={`/decks/${recent.id}`}
          className="inline-flex items-center justify-center h-11 px-4 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#4f46e5] transition-colors"
        >
          Study Deck
        </Link>
        <Link
          href="/decks"
          className="inline-flex items-center justify-center h-10 px-4 rounded-lg border border-[#27272a] text-[#71717a] text-sm hover:text-[#fafafa] hover:border-[#6366f1]/50 transition-colors"
        >
          All Decks
        </Link>
      </div>
    </div>
  )
}
