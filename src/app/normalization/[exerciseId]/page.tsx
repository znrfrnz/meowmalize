import { getExercise } from '@/data/exercises'
import { notFound } from 'next/navigation'
import { NormalizationWizard } from '@/components/normalization/NormalizationWizard'

export default function NormalizationExercisePage({ params }: { params: { exerciseId: string } }) {
  const exercise = getExercise(params.exerciseId)
  if (!exercise) notFound()
  return <NormalizationWizard exercise={exercise} />
}
