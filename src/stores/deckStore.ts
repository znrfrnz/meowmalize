'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Folder, Deck, Flashcard } from '@/types'
import { FLASHCARDS } from '@/data/flashcards'

export const BUILTIN_DECK_ID = 'builtin-flashcards'

const BUILTIN_DECK: Deck = {
  id: BUILTIN_DECK_ID,
  name: 'Database Concepts',
  folderId: null,
  cards: FLASHCARDS,
  createdAt: '2026-01-01T00:00:00.000Z',
  locked: true,
}

interface DeckState {
  folders: Folder[]
  decks: Deck[]
  // Folder CRUD
  addFolder: (name: string) => Folder
  renameFolder: (id: string, name: string) => void
  deleteFolder: (id: string) => void  // moves its decks to ungrouped (folderId: null), does NOT delete them
  // Deck CRUD
  addDeck: (name: string, folderId: string | null, cards?: Flashcard[]) => Deck
  renameDeck: (id: string, name: string) => void
  deleteDeck: (id: string) => void  // noop if deck.locked === true
  addCardToDeck: (deckId: string, card: Flashcard) => void
  removeCardFromDeck: (deckId: string, cardId: string) => void
  updateCardInDeck: (deckId: string, card: Flashcard) => void
  setDeckCards: (deckId: string, cards: Flashcard[]) => void
}

export const useDeckStore = create<DeckState>()(
  persist(
    (set, get) => ({
      folders: [],
      decks: [BUILTIN_DECK],

      addFolder: (name) => {
        const folder: Folder = {
          id: crypto.randomUUID(),
          name,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ folders: [...state.folders, folder] }))
        return folder
      },

      renameFolder: (id, name) =>
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, name } : f)),
        })),

      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          decks: state.decks.map((d) =>
            d.folderId === id ? { ...d, folderId: null } : d
          ),
        })),

      addDeck: (name, folderId, cards = []) => {
        const deck: Deck = {
          id: crypto.randomUUID(),
          name,
          folderId,
          cards,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ decks: [...state.decks, deck] }))
        return deck
      },

      renameDeck: (id, name) =>
        set((state) => ({
          decks: state.decks.map((d) => (d.id === id ? { ...d, name } : d)),
        })),

      deleteDeck: (id) => {
        const deck = get().decks.find((d) => d.id === id)
        if (deck?.locked) return
        set((state) => ({ decks: state.decks.filter((d) => d.id !== id) }))
      },

      addCardToDeck: (deckId, card) =>
        set((state) => ({
          decks: state.decks.map((d) =>
            d.id === deckId ? { ...d, cards: [...d.cards, card] } : d
          ),
        })),

      removeCardFromDeck: (deckId, cardId) =>
        set((state) => ({
          decks: state.decks.map((d) =>
            d.id === deckId
              ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) }
              : d
          ),
        })),

      updateCardInDeck: (deckId, card) =>
        set((state) => ({
          decks: state.decks.map((d) =>
            d.id === deckId
              ? { ...d, cards: d.cards.map((c) => (c.id === card.id ? card : c)) }
              : d
          ),
        })),

      setDeckCards: (deckId, cards) =>
        set((state) => ({
          decks: state.decks.map((d) =>
            d.id === deckId ? { ...d, cards } : d
          ),
        })),
    }),
    {
      name: 'infoman-decks',
      skipHydration: true,  // CRITICAL: prevents SSR/client hydration mismatch
    }
  )
)
