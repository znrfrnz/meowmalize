'use client'

import { useState } from 'react'
import Link from 'next/link'
import { erdExercises } from '@/data/erdExercises'
import { GitFork, Pencil, CheckSquare, ChevronDown } from 'lucide-react'

export default function ERDPage() {
  const [exercisesOpen, setExercisesOpen] = useState(false)

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-fade-up">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/10 flex items-center justify-center">
          <GitFork size={20} className="text-[#fbbf24]" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">ERD Simulator</h1>
      </div>
      <p className="text-[#71717a] mb-12 ml-[52px]">
        Draw Crow&apos;s Foot entity-relationship diagrams. Practice on a free canvas or work through structured exercises.
      </p>

      {/* Mode cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Link
          href="/erd/draw"
          className="group relative border border-[#232326] rounded-2xl p-6 bg-[#141414] flex flex-col gap-3 hover:border-[#3f3f46] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] bg-[#6366f1] opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
          <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
            <Pencil size={20} className="text-[#6366f1]" strokeWidth={1.5} />
          </div>
          <div className="relative">
            <h2 className="font-semibold text-[#f4f4f5] mb-1">Free canvas</h2>
            <p className="text-sm text-[#71717a] leading-relaxed">
              Blank canvas for open-ended ERD practice. Draw any schema, save to your browser.
            </p>
          </div>
        </Link>

        <button
          onClick={() => setExercisesOpen(!exercisesOpen)}
          className="group relative border border-[#232326] rounded-2xl p-6 bg-[#141414] flex flex-col gap-3 text-left hover:border-[#3f3f46] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#34d399]/10 flex items-center justify-center">
            <CheckSquare size={20} className="text-[#34d399]" strokeWidth={1.5} />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-[#f4f4f5] mb-1">Exercises</h2>
              <p className="text-sm text-[#71717a] leading-relaxed">
                Draw the ERD for a normalized schema. Validate against the reference answer.
              </p>
            </div>
            <ChevronDown
              size={18}
              className={`text-[#71717a] mt-1 flex-shrink-0 transition-transform duration-300 ${exercisesOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>
      </div>

      {/* Exercise list (inside Exercises card) */}
      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          exercisesOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {erdExercises.map((exercise, i) => (
              <Link
                key={exercise.id}
                href={`/erd/${exercise.id}`}
                className={`animate-fade-up stagger-${i + 1} group border border-[#232326] rounded-2xl p-5 bg-[#141414] hover:border-[#3f3f46] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`}
              >
                <h3 className="font-medium text-[#f4f4f5] mb-2">{exercise.title}</h3>
                <p className="text-xs text-[#71717a] line-clamp-3 leading-relaxed">{exercise.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
