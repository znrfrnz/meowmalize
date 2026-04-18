'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, ChevronLeft } from 'lucide-react'
import { Flashcard } from '@/types'
import { useDeckStore } from '@/stores/deckStore'

interface ReviewCard {
  card: Flashcard
  accepted: boolean
  editing: boolean
  editTerm: string
  editDefinition: string
}

interface CardReviewProps {
  cards: Flashcard[]
  onBack: () => void
  targetDeckId?: string
}

export function CardReview({ cards, onBack, targetDeckId }: CardReviewProps) {
  const router = useRouter()
  const { folders, addFolder, addDeck, setDeckCards, decks } = useDeckStore()

  const [deckNameInput, setDeckNameInput] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [items, setItems] = useState<ReviewCard[]>(
    cards.map((card) => ({
      card,
      accepted: true,
      editing: false,
      editTerm: card.term,
      editDefinition: card.definition,
    }))
  )

  function toggle(idx: number) {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, accepted: !item.accepted } : item))
    )
  }

  function startEdit(idx: number) {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, editing: true } : item))
    )
  }

  function saveEdit(idx: number) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item
        return {
          ...item,
          editing: false,
          card: {
            ...item.card,
            term: item.editTerm.trim() || item.card.term,
            definition: item.editDefinition.trim() || item.card.definition,
          },
        }
      })
    )
  }

  function acceptAll() {
    setItems((prev) => prev.map((item) => ({ ...item, accepted: true })))
  }

  function rejectAll() {
    setItems((prev) => prev.map((item) => ({ ...item, accepted: false })))
  }

  function handleSave() {
    const accepted = items.filter((item) => item.accepted).map((item) => item.card)
    if (targetDeckId) {
      const target = decks.find((d) => d.id === targetDeckId)
      if (target) {
        setDeckCards(targetDeckId, [...target.cards, ...accepted])
        router.push('/decks/' + targetDeckId)
        return
      }
    }
    let folderId = selectedFolderId
    if (creatingFolder && newFolderName.trim()) {
      const newFolder = addFolder(newFolderName.trim())
      folderId = newFolder.id
    }
    const name = deckNameInput.trim() || 'My Generated Deck'
    const newDeck = addDeck(name, folderId, accepted)
    router.push('/decks/' + newDeck.id)
  }

  const acceptedCount = items.filter((i) => i.accepted).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-[#27272a] text-[#71717a] hover:text-[#fafafa] transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#fafafa]">Review Generated Cards</h1>
          <p className="text-xs text-[#71717a]">
            {acceptedCount} of {items.length} accepted
          </p>
        </div>
      </div>

      {/* Batch controls */}
      <div className="flex gap-2">
        <button
          onClick={acceptAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22c55e]/10 text-[#22c55e] text-xs font-medium hover:bg-[#22c55e]/20 transition-colors border border-[#22c55e]/20"
        >
          <Check size={12} /> Accept All
        </button>
        <button
          onClick={rejectAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ef4444]/10 text-[#ef4444] text-xs font-medium hover:bg-[#ef4444]/20 transition-colors border border-[#ef4444]/20"
        >
          <X size={12} /> Reject All
        </button>
      </div>

      {/* Card list */}
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <div
            key={item.card.id}
            className={`border rounded-xl p-4 transition-all ${
              item.accepted
                ? 'border-[#27272a] bg-[#1a1a1a]'
                : 'border-[#27272a]/40 bg-[#1a1a1a]/40 opacity-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Type badge */}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${
                    item.card.type === 'definition'
                      ? 'bg-indigo-900 text-indigo-300'
                      : 'bg-violet-900 text-violet-300'
                  }`}
                >
                  {item.card.type === 'definition' ? 'Definition' : 'Enumeration'}
                </span>

                {item.editing ? (
                  <div className="flex flex-col gap-2">
                    <input
                      value={item.editTerm}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((it, i) =>
                            i === idx ? { ...it, editTerm: e.target.value } : it
                          )
                        )
                      }
                      placeholder="Term"
                      className="w-full bg-[#27272a] border border-[#27272a] rounded-lg px-3 py-1.5 text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1]"
                    />
                    <textarea
                      value={item.editDefinition}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((it, i) =>
                            i === idx ? { ...it, editDefinition: e.target.value } : it
                          )
                        )
                      }
                      placeholder="Definition"
                      rows={3}
                      className="w-full bg-[#27272a] border border-[#27272a] rounded-lg px-3 py-1.5 text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1] resize-none"
                    />
                    <button
                      onClick={() => saveEdit(idx)}
                      className="self-start px-3 py-1 rounded-lg bg-[#6366f1] text-white text-xs font-medium hover:bg-[#4f46e5] transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => startEdit(idx)}
                    className="cursor-pointer group"
                    title="Click to edit"
                  >
                    <p className="text-sm font-semibold text-[#fafafa] group-hover:text-[#6366f1] transition-colors">
                      {item.card.term}
                    </p>
                    <p className="text-xs text-[#71717a] mt-0.5 line-clamp-2">
                      {item.card.definition}
                    </p>
                    {item.card.type === 'enumeration' && (
                      <p className="text-xs text-[#6366f1] mt-0.5 font-mono">
                        List {item.card.itemCount} items
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Accept/Reject toggle */}
              <button
                onClick={() => toggle(idx)}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  item.accepted
                    ? 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
                    : 'bg-[#27272a] text-[#71717a] hover:bg-[#ef4444] hover:text-white'
                }`}
              >
                {item.accepted ? <Check size={14} /> : <X size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Deck name + folder picker  only shown when creating a new deck */}
      {!targetDeckId && (
      <div className="flex flex-col gap-3 p-4 border border-[#27272a] rounded-xl bg-[#1a1a1a]">
        <div>
          <label className="text-xs text-[#71717a] mb-1 block">Deck name</label>
          <input
            value={deckNameInput}
            onChange={(e) => setDeckNameInput(e.target.value)}
            placeholder="My Generated Deck"
            className="w-full bg-[#0f0f0f] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
          />
        </div>
        <div>
          <label className="text-xs text-[#71717a] mb-1 block">Save to folder</label>
          <select
            value={creatingFolder ? '__new__' : (selectedFolderId ?? '')}
            onChange={(e) => {
              if (e.target.value === '__new__') {
                setCreatingFolder(true)
                setSelectedFolderId(null)
              } else {
                setCreatingFolder(false)
                setSelectedFolderId(e.target.value || null)
              }
            }}
            className="w-full bg-[#0f0f0f] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1]"
          >
            <option value="">Ungrouped</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
            <option value="__new__">+ New folder...</option>
          </select>
        </div>
        {creatingFolder && (
          <input
            autoFocus
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name..."
            className="w-full bg-[#0f0f0f] border border-[#6366f1] rounded-lg px-3 py-2 text-sm text-[#fafafa] placeholder-[#71717a] focus:outline-none"
          />
        )}
      </div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={acceptedCount === 0}
        className="h-11 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#4f46e5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Save {acceptedCount} Card{acceptedCount !== 1 ? 's' : ''} to Deck
      </button>
    </div>
  )
}



