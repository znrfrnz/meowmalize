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
    <div className="group relative rounded-2xl p-[1px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] active:scale-[0.98]" style={{ background: 'linear-gradient(145deg, rgba(99,102,241,0.2), transparent 50%)' }}>
      <div className="relative rounded-2xl bg-[#141414] border border-[#6366f1]/20 p-6 flex flex-col gap-4 h-full overflow-hidden group-hover:border-[#6366f1]/40 transition-colors duration-300">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] bg-[#6366f1] opacity-0 group-hover:opacity-25 transition-opacity duration-700" />
        <div className="relative w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
          <Sparkles size={20} className="text-[#6366f1]" strokeWidth={1.5} />
        </div>
        <div className="relative">
          <h2 className="text-lg font-semibold mb-1 tracking-tight">{recent.name}</h2>
          <p className="text-sm text-[#71717a]">
            {recent.cards.length} card{recent.cards.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="relative mt-auto flex flex-col gap-2 pt-2">
          <Link
            href={`/decks/${recent.id}`}
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-[#6366f1] text-white text-sm font-medium hover:bg-[#818cf8] active:scale-[0.97] transition-all duration-300"
          >
            Study deck
          </Link>
          <Link
            href="/decks"
            className="inline-flex items-center justify-center h-9 px-4 rounded-xl border border-[#232326] text-[#71717a] text-sm hover:text-[#f4f4f5] hover:border-[#3f3f46] transition-all duration-300"
          >
            All decks
          </Link>
        </div>
      </div>
    </div>
  )
}
