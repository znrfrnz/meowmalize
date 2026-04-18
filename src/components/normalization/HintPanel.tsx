'use client'
import { NormFormStep } from '@/types'
import { useNormalizationStore } from '@/stores/normalizationStore'

interface HintPanelProps {
  hints: string[]
  exerciseId: string
  step: NormFormStep
}

export function HintPanel({ hints, exerciseId, step }: HintPanelProps) {
  const { getHintIndex, revealHint } = useNormalizationStore()
  const hintIndex = getHintIndex(exerciseId, step)

  const revealedHints = hints.slice(0, hintIndex)

  return (
    <div className="space-y-2">
      {revealedHints.length > 0 && (
        <ol className="space-y-1.5 list-decimal list-inside">
          {revealedHints.map((hint, i) => (
            <li key={i} className="text-sm text-[#a1a1aa] leading-relaxed">
              {hint}
            </li>
          ))}
        </ol>
      )}
      <div className="flex items-center gap-3">
        {hintIndex < hints.length ? (
          <button
            onClick={() => revealHint(exerciseId, step)}
            className="text-sm text-[#6366f1] underline underline-offset-2 hover:text-[#4f46e5] transition-colors"
          >
            Show hint
          </button>
        ) : (
          <span className="text-sm text-[#52525b]">All hints revealed</span>
        )}
        <span className="text-xs text-[#52525b]">
          Hint {hintIndex} / {hints.length}
        </span>
      </div>
    </div>
  )
}
