'use client'
import { useEffect } from 'react'
import { useFlashcardStore } from '@/stores/flashcardStore'

export function StorageHydration() {
  useEffect(() => {
    useFlashcardStore.persist.rehydrate()
  }, [])
  return null
}
