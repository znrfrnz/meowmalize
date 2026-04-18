import { getExercise } from '@/data/exercises'
import { notFound } from 'next/navigation'
import { NormalizationWizard } from '@/components/normalization/NormalizationWizard'

export default async function NormalizationExercisePage({ params }: { params: Promise<{ exerciseId: string }> }) {
  const { exerciseId } = await params
  const exercise = getExercise(exerciseId)
  if (!exercise) notFound()
  return <NormalizationWizard exercise={exercise} />
}