'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Flashcard } from '@/types'
import { GenerateUpload } from '@/components/GenerateUpload'
import { CardReview } from '@/components/CardReview'

function GenerateContent() {
  const searchParams = useSearchParams()
  const targetDeckId = searchParams.get('deckId') ?? undefined
  const [generatedCards, setGeneratedCards] = useState<Flashcard[] | null>(null)

  if (generatedCards !== null) {
    return (
      <CardReview
        cards={generatedCards}
        onBack={() => setGeneratedCards(null)}
        targetDeckId={targetDeckId}
      />
    )
  }

  return <GenerateUpload onComplete={setGeneratedCards} />
}

export default function GeneratePage() {
  return (
    <Suspense>
      <GenerateContent />
    </Suspense>
  )
}
