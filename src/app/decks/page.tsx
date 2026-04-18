'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useDeckStore, BUILTIN_DECK_ID } from '@/stores/deckStore'
import { Folder, Deck } from '@/types'
import { Lock, Trash2, Plus, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react'

function DeckCard({ deck, onDelete }: { deck: Deck; onDelete?: () => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0b] border border-[#232326] hover:border-[#3f3f46] transition-all duration-300">
      <Link
        href={`/decks/${deck.id}`}
        className="flex-1 flex items-center gap-2 min-w-0"
      >
        <span className="text-sm font-medium truncate">{deck.name}</span>
        <span className="text-xs text-[#3f3f46] shrink-0 font-mono tabular-nums">{deck.cards.length} cards</span>
      </Link>
      <div className="flex items-center gap-2 ml-2">
        {deck.locked ? (
          <Lock size={14} className="text-[#6366f1]" />
        ) : (
          onDelete && (
            <button
              onClick={onDelete}
              className="p-1 text-[#71717a] hover:text-[#f87171] active:scale-[0.9] transition-all duration-300"
              aria-label="Delete deck"
            >
              <Trash2 size={14} />
            </button>
          )
        )}
      </div>
    </div>
  )
}

function NewDeckInput({ onSave, onCancel }: { onSave: (name: string) => void; onCancel: () => void }) {
  const [value, setValue] = useState('')
  const handleSave = () => {
    if (value.trim()) onSave(value.trim())
    else onCancel()
  }
  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave()
          if (e.key === 'Escape') onCancel()
        }}
        placeholder="Deck name..."
        className="flex-1 px-2 py-1 text-sm bg-[#0a0a0b] border border-[#6366f1]/40 rounded-lg text-[#f4f4f5] placeholder-[#3f3f46] outline-none focus:border-[#6366f1] transition-colors"
      />
      <button onClick={handleSave} className="text-xs px-2 py-1 bg-[#6366f1] text-white rounded-lg hover:bg-[#818cf8] active:scale-[0.95] transition-all duration-300">Save</button>
      <button onClick={onCancel} className="text-xs px-2 py-1 text-[#71717a] hover:text-[#f4f4f5] transition-colors">Cancel</button>
    </div>
  )
}

function FolderSection({ folder, decks }: { folder: Folder; decks: Deck[] }) {
  const { addDeck, deleteFolder, deleteDeck } = useDeckStore()
  const [open, setOpen] = useState(true)
  const [addingDeck, setAddingDeck] = useState(false)

  const handleDeleteFolder = () => {
    if (window.confirm(`Delete folder "${folder.name}"? Its decks will become ungrouped.`)) {
      deleteFolder(folder.id)
    }
  }

  const handleDeleteDeck = (deck: Deck) => {
    if (window.confirm(`Delete deck "${deck.name}"?`)) {
      deleteDeck(deck.id)
    }
  }

  return (
    <div className="border border-[#232326] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#141414] cursor-pointer select-none">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 flex-1 min-w-0">
          {open ? <ChevronDown size={14} className="text-[#3f3f46] shrink-0" /> : <ChevronRight size={14} className="text-[#3f3f46] shrink-0" />}
          <FolderOpen size={14} className="text-[#6366f1] shrink-0" />
          <span className="text-sm font-medium truncate">{folder.name}</span>
          <span className="text-xs text-[#3f3f46] ml-1 shrink-0 font-mono">{decks.length} deck{decks.length !== 1 ? 's' : ''}</span>
        </button>
        <button
          onClick={() => setAddingDeck(true)}
          className="p-1 text-[#71717a] hover:text-[#f4f4f5] active:scale-[0.9] transition-all duration-300"
          title="Add deck"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={handleDeleteFolder}
          className="p-1 text-[#71717a] hover:text-[#f87171] active:scale-[0.9] transition-all duration-300"
          title="Delete folder"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {open && (
        <div className="p-3 space-y-2 bg-[#0a0a0b]">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} onDelete={() => handleDeleteDeck(deck)} />
          ))}
          {addingDeck && (
            <NewDeckInput
              onSave={(name) => { addDeck(name, folder.id); setAddingDeck(false) }}
              onCancel={() => setAddingDeck(false)}
            />
          )}
          {decks.length === 0 && !addingDeck && (
            <p className="text-xs text-[#3f3f46] italic px-1">No decks yet — click + to add one</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function DecksPage() {
  const { folders, decks, addFolder, addDeck, deleteDeck } = useDeckStore()

  const [addingFolder, setAddingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [addingUngroupedDeck, setAddingUngroupedDeck] = useState(false)

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim())
      setNewFolderName('')
    }
    setAddingFolder(false)
  }

  const ungroupedDecks = decks.filter((d) => d.folderId === null && d.id !== BUILTIN_DECK_ID)
  const builtinDeck = decks.find((d) => d.id === BUILTIN_DECK_ID)

  const handleDeleteUngroupedDeck = (deck: Deck) => {
    if (window.confirm(`Delete deck "${deck.name}"?`)) {
      deleteDeck(deck.id)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My decks</h1>
        <button
          onClick={() => setAddingFolder(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#6366f1] text-white rounded-xl hover:bg-[#818cf8] active:scale-[0.97] transition-all duration-300"
        >
          <Plus size={14} />
          New folder
        </button>
      </div>

      {/* New folder inline input */}
      {addingFolder && (
        <div className="mb-4 flex items-center gap-2">
          <input
            autoFocus
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddFolder()
              if (e.key === 'Escape') { setAddingFolder(false); setNewFolderName('') }
            }}
            placeholder="Folder name..."
            className="flex-1 px-3 py-2 text-sm bg-[#141414] border border-[#6366f1]/40 rounded-xl text-[#f4f4f5] placeholder-[#3f3f46] outline-none focus:border-[#6366f1] transition-colors"
          />
          <button onClick={handleAddFolder} className="px-3 py-2 text-sm bg-[#6366f1] text-white rounded-xl hover:bg-[#818cf8] active:scale-[0.95] transition-all duration-300">Save</button>
          <button onClick={() => { setAddingFolder(false); setNewFolderName('') }} className="px-3 py-2 text-sm text-[#71717a] hover:text-[#f4f4f5] transition-colors">Cancel</button>
        </div>
      )}

      <div className="space-y-4">
        {/* Folder sections */}
        {folders.map((folder) => (
          <FolderSection
            key={folder.id}
            folder={folder}
            decks={decks.filter((d) => d.folderId === folder.id)}
          />
        ))}

        {/* Ungrouped section */}
        <div className="border border-[#232326] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#141414]">
            <span className="text-sm font-medium flex-1">Ungrouped</span>
            <span className="text-xs text-[#3f3f46] font-mono">{ungroupedDecks.length} deck{ungroupedDecks.length !== 1 ? 's' : ''}</span>
            <button
              onClick={() => setAddingUngroupedDeck(true)}
              className="p-1 text-[#71717a] hover:text-[#f4f4f5] active:scale-[0.9] transition-all duration-300"
              title="Add ungrouped deck"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="p-3 space-y-2 bg-[#0a0a0b]">
            {ungroupedDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} onDelete={() => handleDeleteUngroupedDeck(deck)} />
            ))}
            {addingUngroupedDeck && (
              <NewDeckInput
                onSave={(name) => { addDeck(name, null); setAddingUngroupedDeck(false) }}
                onCancel={() => setAddingUngroupedDeck(false)}
              />
            )}
            {ungroupedDecks.length === 0 && !addingUngroupedDeck && (
              <p className="text-xs text-[#3f3f46] italic px-1">No ungrouped decks</p>
            )}
          </div>
        </div>

        {/* Built-in section */}
        {builtinDeck && (
          <div className="border border-[#6366f1]/15 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#141414]">
              <Lock size={14} className="text-[#6366f1] shrink-0" />
              <span className="text-sm font-medium flex-1 text-[#a5b4fc]">Built-in</span>
            </div>
            <div className="p-3 bg-[#0a0a0b]">
              <DeckCard deck={builtinDeck} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
