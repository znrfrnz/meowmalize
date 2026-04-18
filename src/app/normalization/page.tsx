import Link from 'next/link'
import { exercises } from '@/data/exercises'

export default function NormalizationPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Normalization Simulator</h1>
      <p className="text-[#71717a] mb-12">
        Practice database normalization step-by-step: UNF → 1NF → 2NF → 3NF.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((ex) => (
          <Link
            key={ex.id}
            href={`/normalization/${ex.id}`}
            className="border border-[#27272a] rounded-xl p-6 bg-[#1a1a1a] hover:border-[#6366f1]/50 hover:-translate-y-0.5 transition-all flex flex-col gap-3"
          >
            <div>
              <h2 className="text-lg font-semibold mb-1">{ex.title}</h2>
              <p className="text-sm text-[#71717a] leading-relaxed">{ex.description}</p>
            </div>
            <p className="text-xs text-[#52525b] font-mono truncate">
              {ex.unfTable.columns.join(', ')}
            </p>
            <span className="mt-auto text-sm text-[#6366f1] font-medium">
              Start Exercise →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
