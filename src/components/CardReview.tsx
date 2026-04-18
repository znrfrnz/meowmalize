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
      editDefinition: card.type === 'enumeration' && card.items?.length
        ? card.items.join('\n')
        : card.definition,
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
        const editedText = item.editDefinition.trim()
        const isEnum = item.card.type === 'enumeration'
        const updatedCard = {
          ...item.card,
          term: item.editTerm.trim() || item.card.term,
        }
        if (isEnum) {
          const newItems = editedText.split('\n').map((s) => s.trim()).filter(Boolean)
          updatedCard.items = newItems
          updatedCard.itemCount = newItems.length
        } else {
          updatedCard.definition = editedText || item.card.definition
        }
        return { ...item, editing: false, card: updatedCard }
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
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6 animate-fade-up">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-[#141414] border border-[#232326] text-[#71717a] hover:text-[#f4f4f5] hover:border-[#3f3f46] active:scale-[0.95] transition-all duration-300"
        >
          <ChevronLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#f4f4f5] tracking-tight">Review generated cards</h1>
          <p className="text-xs text-[#3f3f46] font-mono tabular-nums">
            {acceptedCount} of {items.length} accepted
          </p>
        </div>
      </div>

      {/* Batch controls */}
      <div className="flex gap-2">
        <button
          onClick={acceptAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#34d399]/10 text-[#34d399] text-xs font-medium hover:bg-[#34d399]/20 active:scale-[0.95] transition-all duration-300 border border-[#34d399]/20"
        >
          <Check size={12} /> Accept all
        </button>
        <button
          onClick={rejectAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f87171]/10 text-[#f87171] text-xs font-medium hover:bg-[#f87171]/20 active:scale-[0.95] transition-all duration-300 border border-[#f87171]/20"
        >
          <X size={12} /> Reject all
        </button>
      </div>

      {/* Card list */}
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <div
            key={item.card.id}
            className={`border rounded-2xl p-4 transition-all duration-300 ${
              item.accepted
                ? 'border-[#232326] bg-[#141414]'
                : 'border-[#232326]/40 bg-[#141414]/40 opacity-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Type badge */}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium mb-2 ${
                    item.card.type === 'definition'
                      ? 'bg-[#6366f1]/10 text-[#a5b4fc] border border-[#6366f1]/20'
                      : 'bg-[#a78bfa]/10 text-[#c4b5fd] border border-[#a78bfa]/20'
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
                      className="w-full bg-[#0a0a0b] border border-[#232326] rounded-xl px-3 py-1.5 text-sm text-[#f4f4f5] focus:outline-none focus:border-[#6366f1]/40 transition-colors"
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
                      placeholder={item.card.type === 'enumeration' ? 'One item per line' : 'Definition'}
                      rows={item.card.type === 'enumeration' ? Math.max(3, (item.editDefinition.split('\n').length || 3)) : 3}
                      className="w-full bg-[#0a0a0b] border border-[#232326] rounded-xl px-3 py-1.5 text-sm text-[#f4f4f5] focus:outline-none focus:border-[#6366f1]/40 resize-none transition-colors"
                    />
                    <button
                      onClick={() => saveEdit(idx)}
                      className="self-start px-3 py-1 rounded-xl bg-[#6366f1] text-white text-xs font-medium hover:bg-[#818cf8] active:scale-[0.95] transition-all duration-300"
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
                    <p className="text-sm font-semibold text-[#f4f4f5] group-hover:text-[#a5b4fc] transition-colors duration-300">
                      {item.card.term}
                    </p>
                    {item.card.type === 'enumeration' && item.card.items?.length ? (
                      <ol className="mt-1 space-y-0.5 list-decimal list-inside">
                        {item.card.items.map((it, i) => (
                          <li key={i} className="text-xs text-[#a1a1aa]">{it}</li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-xs text-[#71717a] mt-0.5 line-clamp-2">
                        {item.card.definition}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Accept/Reject toggle */}
              <button
                onClick={() => toggle(idx)}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center active:scale-[0.9] transition-all duration-300 ${
                  item.accepted
                    ? 'bg-[#34d399] text-[#052e16] hover:bg-[#6ee7b7]'
                    : 'bg-[#232326] text-[#71717a] hover:bg-[#f87171] hover:text-white'
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
      <div className="flex flex-col gap-3 p-4 border border-[#232326] rounded-2xl bg-[#141414]">
        <div>
          <label className="text-xs text-[#3f3f46] mb-1 block">Deck name</label>
          <input
            value={deckNameInput}
            onChange={(e) => setDeckNameInput(e.target.value)}
            placeholder="My Generated Deck"
            className="w-full bg-[#0a0a0b] border border-[#232326] rounded-xl px-3 py-2 text-sm text-[#f4f4f5] placeholder-[#3f3f46] focus:outline-none focus:border-[#6366f1]/40 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-[#3f3f46] mb-1 block">Save to folder</label>
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
            className="w-full bg-[#0a0a0b] border border-[#232326] rounded-xl px-3 py-2 text-sm text-[#f4f4f5] focus:outline-none focus:border-[#6366f1]/40 transition-colors"
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
            className="w-full bg-[#0a0a0b] border border-[#6366f1]/40 rounded-xl px-3 py-2 text-sm text-[#f4f4f5] placeholder-[#3f3f46] focus:outline-none focus:border-[#6366f1] transition-colors"
          />
        )}
      </div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={acceptedCount === 0}
        className="h-11 rounded-xl bg-[#6366f1] text-white text-sm font-medium hover:bg-[#818cf8] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-300"
      >
        Save {acceptedCount} card{acceptedCount !== 1 ? 's' : ''} to deck
      </button>
    </div>
  )
}



