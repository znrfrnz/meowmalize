'use client'
import { useState } from 'react'
import { Flashcard } from '@/types'
import { GenerateUpload } from '@/components/GenerateUpload'
import { CardReview } from '@/components/CardReview'

export default function GeneratePage() {
  const [generatedCards, setGeneratedCards] = useState<Flashcard[] | null>(null)

  if (generatedCards !== null) {
    return <CardReview cards={generatedCards} onBack={() => setGeneratedCards(null)} />
  }

  return <GenerateUpload onComplete={setGeneratedCards} />
}
