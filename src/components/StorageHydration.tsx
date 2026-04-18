'use client'
import { useEffect } from 'react'
import { useFlashcardStore } from '@/stores/flashcardStore'
import { useDeckStore } from '@/stores/deckStore'

export function StorageHydration() {
  useEffect(() => {
    useFlashcardStore.persist.rehydrate()
    useDeckStore.persist.rehydrate()
  }, [])
  return null
}
