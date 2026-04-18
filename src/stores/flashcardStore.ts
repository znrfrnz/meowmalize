'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProgressStatus } from '@/types'

interface FlashcardState {
  progress: Record<string, ProgressStatus>
  markKnown: (id: string) => void
  markLearning: (id: string) => void
  resetProgress: () => void
  getKnownCount: () => number
  getLearningCount: () => number
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
    }),
    {
      name: 'infoman-flashcard-progress',
      skipHydration: true,   // CRITICAL: prevents SSR/client hydration mismatch
    }
  )
)
