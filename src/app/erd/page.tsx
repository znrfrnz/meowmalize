import Link from 'next/link'
import { erdExercises } from '@/data/erdExercises'
import { GitFork, Pencil, CheckSquare } from 'lucide-react'

export default function ERDPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 mb-2">
        <GitFork size={24} className="text-[#6366f1]" />
        <h1 className="text-3xl font-bold">ERD Simulator</h1>
      </div>
      <p className="text-[#71717a] mb-12">
        Draw Crow&apos;s Foot entity-relationship diagrams. Practice on a free canvas or work through structured exercises.
      </p>

      {/* Mode cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <Link
          href="/erd/draw"
          className="border border-[#27272a] rounded-xl p-6 bg-[#1a1a1a] flex flex-col gap-3 hover:-translate-y-0.5 hover:border-[#6366f1]/50 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#27272a] flex items-center justify-center">
            <Pencil size={20} className="text-[#6366f1]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#fafafa] mb-1">Free Canvas</h2>
            <p className="text-sm text-[#71717a]">
              Blank canvas for open-ended ERD practice. Draw any schema, save to your browser.
            </p>
          </div>
        </Link>

        <div className="border border-[#27272a] rounded-xl p-6 bg-[#1a1a1a] flex flex-col gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#27272a] flex items-center justify-center">
            <CheckSquare size={20} className="text-[#6366f1]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#fafafa] mb-1">Exercises</h2>
            <p className="text-sm text-[#71717a]">
              Draw the ERD for a normalized schema. Validate against the reference answer.
            </p>
          </div>
        </div>
      </div>

      {/* Exercise list */}
      <h2 className="text-lg font-semibold mb-4">Exercises</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {erdExercises.map((exercise) => (
          <Link
            key={exercise.id}
            href={`/erd/${exercise.id}`}
            className="border border-[#27272a] rounded-xl p-5 bg-[#1a1a1a] hover:-translate-y-0.5 hover:border-[#6366f1]/50 transition-all"
          >
            <h3 className="font-medium text-[#fafafa] mb-2">{exercise.title}</h3>
            <p className="text-xs text-[#71717a] line-clamp-3">{exercise.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
