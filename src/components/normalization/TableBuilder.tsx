'use client'
import { Trash2 } from 'lucide-react'
import { TableAnswer, FDPair } from '@/types'
import { FDInput } from './FDInput'

interface TableBuilderProps {
  value: TableAnswer
  onChange: (answer: TableAnswer) => void
}

export function TableBuilder({ value, onChange }: TableBuilderProps) {
  const addColumn = () => {
    onChange({
      ...value,
      columns: [...value.columns, { name: '', isPK: false }],
    })
  }

  const removeColumn = (index: number) => {
    if (value.columns.length <= 1) return
    const updated = value.columns.filter((_, i) => i !== index)
    onChange({ ...value, columns: updated })
  }

  const updateColumn = (index: number, field: 'name' | 'isPK', val: string | boolean) => {
    const updated = value.columns.map((col, i) =>
      i === index ? { ...col, [field]: val } : col
    )
    onChange({ ...value, columns: updated })
  }

  const handleFDChange = (fds: FDPair[]) => {
    onChange({ ...value, fds })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs text-[#71717a] uppercase tracking-wide font-medium">Columns</label>
        {value.columns.map((col, i) => (
          <div key={i} className="flex items-center gap-3">
            <input
              type="text"
              value={col.name}
              onChange={(e) => updateColumn(i, 'name', e.target.value)}
              placeholder="Column name"
              className="flex-1 h-9 px-3 rounded-lg bg-[#27272a] border border-[#3f3f46] text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1]/60"
            />
            <label className="flex items-center gap-1.5 text-sm text-[#a1a1aa] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={col.isPK}
                onChange={(e) => updateColumn(i, 'isPK', e.target.checked)}
                className="w-4 h-4 rounded border-[#6366f1] accent-[#6366f1] cursor-pointer"
              />
              PK
            </label>
            <button
              onClick={() => removeColumn(i)}
              disabled={value.columns.length <= 1}
              className="p-1.5 rounded-lg text-[#71717a] hover:text-[#ef4444] hover:bg-[#ef4444]/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Remove column"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={addColumn}
          className="text-sm text-[#6366f1] hover:text-[#4f46e5] underline underline-offset-2 transition-colors"
        >
          + Add column
        </button>
      </div>

      <FDInput
        value={value.fds}
        onChange={handleFDChange}
        columns={value.columns.map((c) => c.name)}
      />
    </div>
  )
}
