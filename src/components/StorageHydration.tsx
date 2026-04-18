'use client'
import { useEffect } from 'react'
import { useFlashcardStore } from '@/stores/flashcardStore'
import { useDeckStore } from '@/stores/deckStore'
import { useNormalizationStore } from '@/stores/normalizationStore'

export function StorageHydration() {
  useEffect(() => {
    useFlashcardStore.persist.rehydrate()
    useDeckStore.persist.rehydrate()
    useNormalizationStore.persist.rehydrate()
  }, [])
  return null
}
