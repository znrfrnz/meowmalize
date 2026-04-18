'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Plus, Trash2, Upload, X } from 'lucide-react'
import { useFlashcardStore } from '@/stores/flashcardStore'
import { Flashcard } from '@/types'

type Tab = 'cards' | 'add' | 'import'

function parseImportText(raw: string): Flashcard[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      // Support tab separator (Quizlet/Gizmo default) or " - " (dash with spaces)
      const tabIdx = line.indexOf('\t')
      if (tabIdx !== -1) {
        return [{ term: line.slice(0, tabIdx).trim(), definition: line.slice(tabIdx + 1).trim() }]
      }
      const dashIdx = line.indexOf(' - ')
      if (dashIdx !== -1) {
        return [{ term: line.slice(0, dashIdx).trim(), definition: line.slice(dashIdx + 3).trim() }]
      }
      return []
    })
    .filter((p) => p.term && p.definition)
    .map((p, i) => ({
      id: `import-${Date.now()}-${i}`,
      type: 'definition' as const,
      term: p.term,
      definition: p.definition,
    }))
}

export default function EditDeckPage() {
  const { generatedCards, addGeneratedCard, removeGeneratedCard, setGeneratedCards } = useFlashcardStore()
  const [tab, setTab] = useState<Tab>('cards')

  // Add card form state
  const [term, setTerm] = useState('')
  const [definition, setDefinition] = useState('')

  // Import state
  const [importText, setImportText] = useState('')
  const [importPreview, setImportPreview] = useState<Flashcard[]>([])
  const [importParsed, setImportParsed] = useState(false)

  function handleAddCard(e: React.FormEvent) {
    e.preventDefault()
    const t = term.trim()
    const d = definition.trim()
    if (!t || !d) return
    addGeneratedCard({ id: `manual-${Date.now()}`, type: 'definition', term: t, definition: d })
    setTerm('')
    setDefinition('')
  }

  function handleParseImport() {
    const parsed = parseImportText(importText)
    setImportPreview(parsed)
    setImportParsed(true)
  }

  function handleConfirmImport() {
    importPreview.forEach((card) => addGeneratedCard(card))
    setImportText('')
    setImportPreview([])
    setImportParsed(false)
    setTab('cards')
  }

  function handleRemovePreviewItem(idx: number) {
    setImportPreview((prev) => prev.filter((_, i) => i !== idx))
  }

  const tabClass = (t: Tab) =>
    `h-9 px-4 text-sm rounded-lg transition-colors ${
      tab === t
        ? 'bg-[#6366f1] text-white font-medium'
        : 'bg-[#27272a] text-[#71717a] hover:text-[#fafafa]'
    }`

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/generated"
          className="p-2 rounded-lg bg-[#27272a] text-[#71717a] hover:text-[#fafafa] transition-colors"
        >
          <ChevronLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#fafafa]">Edit Deck</h1>
          <p className="text-xs text-[#71717a]">{generatedCards.length} cards</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button className={tabClass('cards')} onClick={() => setTab('cards')}>
          Cards
        </button>
        <button className={tabClass('add')} onClick={() => setTab('add')}>
          <span className="flex items-center gap-1.5"><Plus size={13} />Add</span>
        </button>
        <button className={tabClass('import')} onClick={() => setTab('import')}>
          <span className="flex items-center gap-1.5"><Upload size={13} />Import</span>
        </button>
      </div>

      {/* Cards tab */}
      {tab === 'cards' && (
        <div className="flex flex-col gap-2">
          {generatedCards.length === 0 && (
            <p className="text-sm text-[#71717a] text-center py-8">No cards yet. Add some above.</p>
          )}
          {generatedCards.map((card) => (
            <div
              key={card.id}
              className="flex items-start gap-3 border border-[#27272a] rounded-xl px-4 py-3 bg-[#1a1a1a]"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#fafafa] truncate">{card.term}</p>
                <p className="text-xs text-[#71717a] mt-0.5 line-clamp-2">
                  {card.type === 'enumeration' && card.items
                    ? card.items.join(', ')
                    : card.definition}
                </p>
              </div>
              <button
                onClick={() => removeGeneratedCard(card.id)}
                className="shrink-0 p-1.5 rounded-lg text-[#52525b] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                aria-label="Remove card"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add tab */}
      {tab === 'add' && (
        <form onSubmit={handleAddCard} className="flex flex-col gap-3">
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
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-[#27272a] border border-[#3f3f46] text-[#fafafa] text-sm placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] resize-none"
          />
          <button
            type="submit"
            disabled={!term.trim() || !definition.trim()}
            className="h-10 px-4 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#4f46e5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-end"
          >
            Add Card
          </button>
        </form>
      )}

      {/* Import tab */}
      {tab === 'import' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-[#71717a]">
              Paste cards from Quizlet, Gizmo, or any tab-separated or{' '}
              <code className="text-[#a1a1aa]">" - "</code>-separated list. One card per line.
            </p>
            <p className="text-xs text-[#52525b]">
              Example: <code className="text-[#a1a1aa]">Term[tab]Definition</code> or{' '}
              <code className="text-[#a1a1aa]">Term - Definition</code>
            </p>
          </div>

          <textarea
            value={importText}
            onChange={(e) => { setImportText(e.target.value); setImportParsed(false); setImportPreview([]) }}
            placeholder={'CPU\tCentral Processing Unit\nRAM - Random Access Memory'}
            rows={8}
            className="w-full px-3 py-2 rounded-lg bg-[#27272a] border border-[#3f3f46] text-[#fafafa] text-sm placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] resize-none font-mono"
          />

          {!importParsed ? (
            <button
              onClick={handleParseImport}
              disabled={!importText.trim()}
              className="h-10 px-4 rounded-lg bg-[#27272a] text-[#fafafa] text-sm font-medium hover:bg-[#3f3f46] disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-start"
            >
              Preview
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#fafafa] font-medium">
                  {importPreview.length} card{importPreview.length !== 1 ? 's' : ''} parsed
                </p>
                <button
                  onClick={() => { setImportParsed(false); setImportPreview([]) }}
                  className="text-xs text-[#71717a] hover:text-[#fafafa] transition-colors"
                >
                  Edit text
                </button>
              </div>

              {importPreview.length === 0 && (
                <p className="text-xs text-red-400">
                  No cards could be parsed. Make sure each line uses a tab or{' '}
                  <code>" - "</code> separator.
                </p>
              )}

              <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto">
                {importPreview.map((card, idx) => (
                  <div
                    key={card.id}
                    className="flex items-start gap-3 border border-[#27272a] rounded-lg px-3 py-2 bg-[#1a1a1a] text-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-[#fafafa]">{card.term}</span>
                      <span className="text-[#52525b] mx-1.5">—</span>
                      <span className="text-[#a1a1aa]">{card.definition}</span>
                    </div>
                    <button
                      onClick={() => handleRemovePreviewItem(idx)}
                      className="shrink-0 text-[#52525b] hover:text-red-400 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {importPreview.length > 0 && (
                <button
                  onClick={handleConfirmImport}
                  className="h-10 px-4 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#4f46e5] transition-colors self-start"
                >
                  Add {importPreview.length} card{importPreview.length !== 1 ? 's' : ''} to deck
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
