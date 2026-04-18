'use client'
import { CheckCircle, XCircle } from 'lucide-react'
import { ValidationResult } from '@/lib/normalizationValidator'
import { TableAnswer } from '@/types'

interface FeedbackPanelProps {
  result: ValidationResult
  correctAnswer: TableAnswer[]
  onContinue?: () => void
}

function ReadOnlyTable({ table, index }: { table: TableAnswer; index: number }) {
  const pkCols = table.columns.filter((c) => c.isPK).map((c) => c.name)
  return (
    <div className="bg-[#27272a] rounded-xl p-4 mt-4">
      {index > 0 && (
        <p className="text-xs text-[#71717a] uppercase tracking-wide mb-2">Table {index + 1}</p>
      )}
      <div className="space-y-1 mb-3">
        {table.columns.map((col, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-[#fafafa]">{col.name}</span>
            {col.isPK && (
              <span className="text-xs bg-[#6366f1]/20 text-[#6366f1] px-1.5 py-0.5 rounded font-medium">
                PK
              </span>
            )}
          </div>
        ))}
      </div>
      {table.fds.length > 0 && (
        <div>
          <p className="text-xs text-[#71717a] uppercase tracking-wide mb-1">
            Functional Dependencies
          </p>
          {table.fds.map((fd, i) => (
            <p key={i} className="text-sm text-[#a1a1aa] font-mono">
              {fd.lhs.join(', ')} → {fd.rhs.join(', ')}
            </p>
          ))}
        </div>
      )}
      {pkCols.length > 0 && (
        <p className="text-xs text-[#71717a] mt-2">
          PK: ({pkCols.join(', ')})
        </p>
      )}
    </div>
  )
}

export function FeedbackPanel({ result, correctAnswer, onContinue }: FeedbackPanelProps) {
  if (result.pass) {
    return (
      <div className="bg-[#22c55e]/10 border border-[#22c55e]/40 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={18} className="text-[#22c55e]" />
          <h3 className="font-semibold text-[#22c55e]">Correct!</h3>
        </div>
        <p className="text-sm text-[#a1a1aa]">{result.explanation}</p>
        {onContinue && (
          <button
            onClick={onContinue}
            className="mt-4 h-10 px-5 rounded-lg bg-[#22c55e] text-white text-sm font-medium hover:bg-[#16a34a] transition-colors"
          >
            Continue →
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="bg-[#ef4444]/10 border border-[#ef4444]/40 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <XCircle size={18} className="text-[#ef4444]" />
          <h3 className="font-semibold text-[#ef4444]">Not quite</h3>
        </div>
        <p className="text-sm text-[#a1a1aa]">{result.explanation}</p>
      </div>
      <div className="mt-4">
        <p className="text-xs text-[#71717a] uppercase tracking-wide mb-2">Correct Answer</p>
        {correctAnswer.map((table, i) => (
          <ReadOnlyTable key={i} table={table} index={correctAnswer.length > 1 ? i : 0} />
        ))}
      </div>
    </div>
  )
}
