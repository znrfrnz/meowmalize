'use client'
import { Trash2 } from 'lucide-react'
import { FDPair } from '@/types'

interface FDInputProps {
  value: FDPair[]
  onChange: (fds: FDPair[]) => void
  columns: string[]
}

function parseColumns(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function FDInput({ value, onChange }: FDInputProps) {
  const addFD = () => {
    onChange([...value, { lhs: [], rhs: [] }])
  }

  const removeFD = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const updateLhs = (index: number, raw: string) => {
    const updated = value.map((fd, i) =>
      i === index ? { ...fd, lhs: parseColumns(raw) } : fd
    )
    onChange(updated)
  }

  const updateRhs = (index: number, raw: string) => {
    const updated = value.map((fd, i) =>
      i === index ? { ...fd, rhs: parseColumns(raw) } : fd
    )
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      <label className="text-xs text-[#71717a] uppercase tracking-wide font-medium">
        Functional Dependencies
      </label>
      {value.map((fd, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            defaultValue={fd.lhs.join(', ')}
            onBlur={(e) => updateLhs(i, e.target.value)}
            placeholder="LHS (comma-separated)"
            className="flex-1 h-9 px-3 rounded-lg bg-[#27272a] border border-[#3f3f46] text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1]/60"
          />
          <span className="text-[#71717a] text-sm font-mono">→</span>
          <input
            type="text"
            defaultValue={fd.rhs.join(', ')}
            onBlur={(e) => updateRhs(i, e.target.value)}
            placeholder="RHS (comma-separated)"
            className="flex-1 h-9 px-3 rounded-lg bg-[#27272a] border border-[#3f3f46] text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1]/60"
          />
          <button
            onClick={() => removeFD(i)}
            className="p-1.5 rounded-lg text-[#71717a] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
            aria-label="Remove FD"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={addFD}
        className="text-sm text-[#6366f1] hover:text-[#4f46e5] underline underline-offset-2 transition-colors"
      >
        + Add FD
      </button>
    </div>
  )
}
