import Link from 'next/link'
import { exercises } from '@/data/exercises'
import { Table2 } from 'lucide-react'

export default function NormalizationPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-fade-up">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#34d399]/10 flex items-center justify-center">
          <Table2 size={20} className="text-[#34d399]" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Normalization Simulator</h1>
      </div>
      <p className="text-[#71717a] mb-12 ml-[52px]">
        Practice database normalization step-by-step: UNF → 1NF → 2NF → 3NF.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exercises.map((ex, i) => (
          <Link
            key={ex.id}
            href={`/normalization/${ex.id}`}
            className={`animate-fade-up stagger-${i + 1} group relative border border-[#232326] rounded-2xl p-6 bg-[#141414] hover:border-[#3f3f46] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col gap-3 overflow-hidden`}
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] bg-[#34d399] opacity-0 group-hover:opacity-15 transition-opacity duration-700" />
            <div className="relative">
              <h2 className="text-lg font-semibold mb-1.5 tracking-tight">{ex.title}</h2>
              <p className="text-sm text-[#71717a] leading-relaxed">{ex.description}</p>
            </div>
            <p className="relative text-xs text-[#3f3f46] font-mono truncate">
              {ex.unfTable.columns.join(', ')}
            </p>
            <span className="relative mt-auto text-sm text-[#34d399] font-medium">
              Start exercise
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
