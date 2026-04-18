'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Flashcard, ProgressStatus } from '@/types'

interface FlashcardState {
  progress: Record<string, ProgressStatus>
  markKnown: (id: string) => void
  markLearning: (id: string) => void
  resetProgress: () => void
  getKnownCount: () => number
  getLearningCount: () => number
  generatedCards: Flashcard[]
  setGeneratedCards: (cards: Flashcard[]) => void
  clearGeneratedCards: () => void
  addGeneratedCard: (card: Flashcard) => void
  removeGeneratedCard: (id: string) => void
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      progress: {},
      markKnown: (id) => set((state) => ({ progress: { ...state.progress, [id]: 'known' } })),
      markLearning: (id) => set((state) => ({ progress: { ...state.progress, [id]: 'learning' } })),
      resetProgress: () => set({ progress: {} }),
      getKnownCount: () => Object.values(get().progress).filter(v => v === 'known').length,
      getLearningCount: () => Object.values(get().progress).filter(v => v === 'learning').length,
      generatedCards: [],
      setGeneratedCards: (cards) => set({ generatedCards: cards }),
      clearGeneratedCards: () => set({ generatedCards: [] }),
      addGeneratedCard: (card) => set((state) => ({ generatedCards: [...state.generatedCards, card] })),
      removeGeneratedCard: (id) => set((state) => ({ generatedCards: state.generatedCards.filter((c) => c.id !== id) })),
    }),
    {
      name: 'infoman-flashcard-progress',
      skipHydration: true,   // CRITICAL: prevents SSR/client hydration mismatch
    }
  )
)
