'use client'
import { StudySession } from '@/components/StudySession'
import { FLASHCARDS } from '@/data/flashcards'
import { useFlashcardStore } from '@/stores/flashcardStore'

export default function FlashcardsPage() {
  const generatedCards = useFlashcardStore((s) => s.generatedCards)
  const cards = generatedCards.length > 0 ? generatedCards : FLASHCARDS
  return <StudySession cards={cards} />
}
