'use client'
import { useState } from 'react'
import { CheckCircle, XCircle, Eye } from 'lucide-react'
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
    <div className="bg-[#141414] rounded-2xl p-4 mt-4">
      {index > 0 && (
        <p className="text-xs text-[#71717a] uppercase tracking-wide mb-2">Table {index + 1}</p>
      )}
      <div className="space-y-1 mb-3">
        {table.columns.map((col, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-[#f4f4f5]">{col.name}</span>
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
              {fd.lhs.join(', ')}  {fd.rhs.join(', ')}
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
  const [showAnswer, setShowAnswer] = useState(false)

  if (result.pass) {
    return (
      <div className="bg-[#34d399]/10 border border-[#34d399]/30 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={18} className="text-[#34d399]" />
          <h3 className="font-semibold text-[#34d399]">Correct</h3>
        </div>
        <p className="text-sm text-[#a1a1aa]">{result.explanation}</p>
        {onContinue && (
          <button
            onClick={onContinue}
            className="mt-4 h-10 px-5 rounded-xl bg-[#34d399] text-[#052e16] text-sm font-medium hover:bg-[#6ee7b7] active:scale-[0.97] transition-all duration-300"
          >
            Continue 
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="bg-[#f87171]/10 border border-[#f87171]/30 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <XCircle size={18} className="text-[#f87171]" />
          <h3 className="font-semibold text-[#f87171]">Not quite</h3>
        </div>
        <p className="text-sm text-[#a1a1aa]">{result.explanation}</p>
        <button
          onClick={() => setShowAnswer((v) => !v)}
          className="mt-3 flex items-center gap-1.5 text-sm text-[#71717a] hover:text-[#f4f4f5] transition-colors duration-300"
        >
          <Eye size={14} />
          {showAnswer ? 'Hide answer' : 'Show answer'}
        </button>
      </div>
      {showAnswer && (
        <div className="mt-4">
          <p className="text-xs text-[#71717a] uppercase tracking-wide mb-2">Correct Answer</p>
          {correctAnswer.map((table, i) => (
            <ReadOnlyTable key={i} table={table} index={correctAnswer.length > 1 ? i : 0} />
          ))}
        </div>
      )}
    </div>
  )
}