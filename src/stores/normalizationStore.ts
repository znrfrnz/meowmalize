'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { NormalizationProgress, NormFormStep, TableAnswer } from '@/types'

interface NormalizationState {
  progress: NormalizationProgress
  markStepComplete: (exerciseId: string, step: NormFormStep, answer: TableAnswer[]) => void
  saveStepAnswer: (exerciseId: string, step: NormFormStep, answer: TableAnswer[]) => void
  revealHint: (exerciseId: string, step: NormFormStep) => void
  getHintIndex: (exerciseId: string, step: NormFormStep) => number
  getCompletedSteps: (exerciseId: string) => NormFormStep[]
  getSavedAnswer: (exerciseId: string, step: NormFormStep) => TableAnswer[] | undefined
  resetExercise: (exerciseId: string) => void
}

export const useNormalizationStore = create<NormalizationState>()(
  persist(
    (set, get) => ({
      progress: {},
      markStepComplete: (exerciseId, step, answer) =>
        set((state) => {
          const ex = state.progress[exerciseId] ?? { completedSteps: [], stepAnswers: {}, hintIndexes: {} }
          return {
            progress: {
              ...state.progress,
              [exerciseId]: {
                ...ex,
                completedSteps: ex.completedSteps.includes(step) ? ex.completedSteps : [...ex.completedSteps, step],
                stepAnswers: { ...ex.stepAnswers, [step]: answer },
              },
            },
          }
        }),
      saveStepAnswer: (exerciseId, step, answer) =>
        set((state) => {
          const ex = state.progress[exerciseId] ?? { completedSteps: [], stepAnswers: {}, hintIndexes: {} }
          return { progress: { ...state.progress, [exerciseId]: { ...ex, stepAnswers: { ...ex.stepAnswers, [step]: answer } } } }
        }),
      revealHint: (exerciseId, step) =>
        set((state) => {
          const ex = state.progress[exerciseId] ?? { completedSteps: [], stepAnswers: {}, hintIndexes: {} }
          const current = ex.hintIndexes?.[step] ?? 0
          return { progress: { ...state.progress, [exerciseId]: { ...ex, hintIndexes: { ...ex.hintIndexes, [step]: current + 1 } } } }
        }),
      getHintIndex: (exerciseId, step) => get().progress[exerciseId]?.hintIndexes?.[step] ?? 0,
      getCompletedSteps: (exerciseId) => get().progress[exerciseId]?.completedSteps ?? [],
      getSavedAnswer: (exerciseId, step) => get().progress[exerciseId]?.stepAnswers?.[step],
      resetExercise: (exerciseId) =>
        set((state) => {
          const { [exerciseId]: _, ...rest } = state.progress
          return { progress: rest }
        }),
    }),
    {
      name: 'infoman-normalization-progress',
      skipHydration: true,
    }
  )
)
