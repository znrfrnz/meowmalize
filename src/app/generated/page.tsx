'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, ChevronLeft, X } from 'lucide-react'
import { StudySession } from '@/components/StudySession'
import { useFlashcardStore } from '@/stores/flashcardStore'
import { Flashcard } from '@/types'

export default function GeneratedPage() {
  const { generatedCards, addGeneratedCard, clearGeneratedCards } = useFlashcardStore()
  const [showForm, setShowForm] = useState(false)
  const [term, setTerm] = useState('')
  const [definition, setDefinition] = useState('')

  function handleAddCard(e: React.FormEvent) {
    e.preventDefault()
    const trimmedTerm = term.trim()
    const trimmedDef = definition.trim()
    if (!trimmedTerm || !trimmedDef) return
    const card: Flashcard = {
      id: `manual-${Date.now()}`,
      type: 'definition',
      term: trimmedTerm,
      definition: trimmedDef,
    }
    addGeneratedCard(card)
    setTerm('')
    setDefinition('')
    setShowForm(false)
  }

  if (generatedCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-6 text-center">
        <p className="text-[#71717a] text-sm">No generated deck yet.</p>
        <Link
          href="/generate"
          className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#4f46e5] transition-colors"
        >
          Generate from slides
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg bg-[#27272a] text-[#71717a] hover:text-[#fafafa] transition-colors"
          >
            <ChevronLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#fafafa]">My Generated Deck</h1>
            <p className="text-xs text-[#71717a]">{generatedCards.length} cards</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#27272a] text-[#71717a] text-sm hover:text-[#fafafa] transition-colors"
          >
            <Plus size={14} />
            Add Card
          </button>
          <button
            onClick={() => {
              if (confirm('Clear all generated cards?')) clearGeneratedCards()
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#27272a] text-[#71717a] text-sm hover:text-red-400 transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        </div>
      </div>

      {/* Add Card form */}
      {showForm && (
        <form
          onSubmit={handleAddCard}
          className="border border-[#27272a] rounded-xl p-4 bg-[#1a1a1a] flex flex-col gap-3"
        >
          <h2 className="text-sm font-semibold text-[#fafafa]">Add a card</h2>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Term"
            className="w-full h-9 px-3 rounded-lg bg-[#27272a] border border-[#3f3f46] text-[#fafafa] text-sm placeholder-[#52525b] focus:outline-none focus:border-[#6366f1]"
          />
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Definition"
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-[#27272a] border border-[#3f3f46] text-[#fafafa] text-sm placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="h-9 px-3 rounded-lg text-[#71717a] text-sm hover:text-[#fafafa] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!term.trim() || !definition.trim()}
              className="h-9 px-4 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#4f46e5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Study session */}
      <StudySession cards={generatedCards} />
    </div>
  )
}
