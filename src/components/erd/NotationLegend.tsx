'use client'

const SYMBOLS = [
  { label: 'Mandatory One', symbol: '||', description: 'Exactly one' },
  { label: 'Mandatory Many', symbol: '|<', description: 'One or more' },
  { label: 'Optional One', symbol: 'O|', description: 'Zero or one' },
  { label: 'Optional Many', symbol: 'O<', description: 'Zero or many' },
]

export function NotationLegend() {
  return (
    <div className="absolute bottom-4 right-4 z-10 bg-[#1a1a1a] border border-[#27272a] rounded-xl p-3 shadow-xl min-w-[160px]">
      <p className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider mb-2">
        Crow&apos;s Foot
      </p>
      <div className="space-y-1.5">
        {SYMBOLS.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="font-mono text-sm text-[#6366f1] w-6 text-center">{s.symbol}</span>
            <div>
              <p className="text-xs text-[#fafafa] leading-none">{s.label}</p>
              <p className="text-[10px] text-[#52525b]">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
