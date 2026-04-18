'use client'
import { useEffect, useRef } from 'react'
import type { Edge } from '@xyflow/react'
import type { ErdCardinality } from '@/types'
import { X, Trash2 } from 'lucide-react'

const CARDINALITY_OPTIONS: { value: ErdCardinality; label: string }[] = [
  { value: 'mandatory-one', label: 'Mandatory One (||)' },
  { value: 'mandatory-many', label: 'Mandatory Many (|<)' },
  { value: 'optional-one', label: 'Optional One (O|)' },
  { value: 'optional-many', label: 'Optional Many (O<)' },
]

interface CardinalityPopoverProps {
  edgeId: string
  position: { x: number; y: number }
  edges: Edge[]
  onUpdate: (edgeId: string, data: Record<string, unknown>) => void
  onDelete: (edgeId: string) => void
  onClose: () => void
}

export function CardinalityPopover({
  edgeId,
  position,
  edges,
  onUpdate,
  onDelete,
  onClose,
}: CardinalityPopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const edge = edges.find((e) => e.id === edgeId)
  const data = (edge?.data ?? {}) as {
    sourceCardinality?: ErdCardinality
    targetCardinality?: ErdCardinality
    sourceLabel?: string
    targetLabel?: string
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  if (!edge) return null

  const update = (patch: Record<string, unknown>) => onUpdate(edgeId, { ...data, ...patch })

  return (
    <div
      ref={ref}
      style={{ left: position.x + 8, top: position.y + 8 }}
      className="fixed z-50 bg-[#1a1a1a] border border-[#27272a] rounded-xl p-4 shadow-2xl min-w-[220px]"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#fafafa]">Relationship</span>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#fafafa]">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-[#71717a] mb-1 block">Source label</label>
          <input
            className="w-full bg-[#27272a] rounded px-2 py-1 text-xs text-[#fafafa] outline-none"
            value={data.sourceLabel ?? ''}
            onChange={(e) => update({ sourceLabel: e.target.value })}
            placeholder="e.g. Submits"
          />
        </div>
        <div>
          <label className="text-xs text-[#71717a] mb-1 block">Source cardinality</label>
          <select
            className="w-full bg-[#27272a] rounded px-2 py-1 text-xs text-[#fafafa] outline-none"
            value={data.sourceCardinality ?? 'mandatory-one'}
            onChange={(e) => update({ sourceCardinality: e.target.value as ErdCardinality })}
          >
            {CARDINALITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-[#71717a] mb-1 block">Target label</label>
          <input
            className="w-full bg-[#27272a] rounded px-2 py-1 text-xs text-[#fafafa] outline-none"
            value={data.targetLabel ?? ''}
            onChange={(e) => update({ targetLabel: e.target.value })}
            placeholder="e.g. Submitted_by"
          />
        </div>
        <div>
          <label className="text-xs text-[#71717a] mb-1 block">Target cardinality</label>
          <select
            className="w-full bg-[#27272a] rounded px-2 py-1 text-xs text-[#fafafa] outline-none"
            value={data.targetCardinality ?? 'mandatory-many'}
            onChange={(e) => update({ targetCardinality: e.target.value as ErdCardinality })}
          >
            {CARDINALITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => { onDelete(edgeId); onClose() }}
        className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-[#ef4444] border border-[#27272a] rounded-lg hover:bg-[#ef4444]/10 transition-colors"
      >
        <Trash2 size={12} /> Delete relationship
      </button>
    </div>
  )
}
