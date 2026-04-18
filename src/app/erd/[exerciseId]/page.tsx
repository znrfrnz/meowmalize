import { getErdExercise } from '@/data/erdExercises'
import { ErdExerciseWizard } from '@/components/erd/ErdExerciseWizard'
import { notFound } from 'next/navigation'

export default async function ErdExercisePage({
  params,
}: {
  params: Promise<{ exerciseId: string }>
}) {
  const { exerciseId } = await params
  const exercise = getErdExercise(exerciseId)
  if (!exercise) notFound()
  return <ErdExerciseWizard exercise={exercise} />
}
