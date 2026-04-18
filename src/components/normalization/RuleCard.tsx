import { Info } from 'lucide-react'

interface RuleCardProps {
  title: string
  body: string
}

export function RuleCard({ title, body }: RuleCardProps) {
  return (
    <div className="bg-[#141414] border border-[#6366f1]/20 rounded-2xl p-4 flex gap-3">
      <Info size={18} className="text-[#6366f1] mt-0.5 shrink-0" />
      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-1">{title}</h3>
        <p className="text-sm text-[#a1a1aa] leading-relaxed">{body}</p>
      </div>
    </div>
  )
}
