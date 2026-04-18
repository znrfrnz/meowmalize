import { StudySession } from '@/components/StudySession'
import { FLASHCARDS } from '@/data/flashcards'

export default function FlashcardsPage() {
  return <StudySession cards={FLASHCARDS} />
}
