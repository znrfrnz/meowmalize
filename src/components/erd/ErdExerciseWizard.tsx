'use client'
import { useState, useCallback } from 'react'
import { ERDCanvas } from './ERDCanvas'
import { useErdStore } from '@/stores/erdStore'
import { compareErd } from '@/lib/erdValidator'
import type { ErdExercise, ErdValidationResult, ErdAnswer, ErdAttributeRole, ErdCardinality } from '@/types'
import type { Node, Edge } from '@xyflow/react'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'

interface ErdExerciseWizardProps {
  exercise: ErdExercise
}

// Convert React Flow Node[] + Edge[] to ErdAnswer for comparison
function toErdAnswer(nodes: Node[], edges: Edge[]): ErdAnswer {
  const entities = nodes
    .filter((n) => n.type === 'entityNode')
    .map((n) => ({
      id: n.id,
      tableName: (n.data.tableName as string) ?? '',
      attributes: (
        (n.data.attributes as { id: string; name: string; role: ErdAttributeRole }[]) ?? []
      ).map((a) => ({
        id: a.id,
        name: a.name,
        role: a.role,
      })),
    }))
  const relationships = edges.map((e) => ({
    id: e.id,
    sourceEntityId: e.source,
    targetEntityId: e.target,
    sourceCardinality:
      ((e.data as Record<string, unknown>)?.sourceCardinality as ErdCardinality) ?? 'mandatory-one',
    targetCardinality:
      ((e.data as Record<string, unknown>)?.targetCardinality as ErdCardinality) ?? 'mandatory-many',
    sourceLabel: (e.data as Record<string, unknown>)?.sourceLabel as string | undefined,
    targetLabel: (e.data as Record<string, unknown>)?.targetLabel as string | undefined,
  }))
  return { entities, relationships }
}

export function ErdExerciseWizard({ exercise }: ErdExerciseWizardProps) {
  const { nodes, edges, clearCanvas } = useErdStore()
  const [validationResult, setValidationResult] = useState<ErdValidationResult | null>(null)

  const handleCheckAnswer = useCallback(() => {
    const studentAnswer = toErdAnswer(nodes, edges)
    const result = compareErd(studentAnswer, exercise.referenceAnswer)
    setValidationResult(result)
  }, [nodes, edges, exercise.referenceAnswer])

  const handleReset = useCallback(() => {
    clearCanvas()
    setValidationResult(null)
  }, [clearCanvas])

  // Build validation overlay map: elementId → status
  const validationOverlay = validationResult
    ? new Map<string, 'correct' | 'incorrect' | 'extra'>([
        ...validationResult.entityResults.map(
          (e) => [e.entityId, e.status] as [string, 'correct' | 'incorrect' | 'extra']
        ),
        ...validationResult.relationshipResults.map(
          (r) => [r.relationshipId, r.status] as [string, 'correct' | 'incorrect' | 'extra']
        ),
      ])
    : undefined

  const correctCount = validationResult
    ? validationResult.entityResults.filter((e) => e.status === 'correct').length +
      validationResult.relationshipResults.filter((r) => r.status === 'correct').length
    : 0
  const totalCount = validationResult
    ? validationResult.entityResults.length + validationResult.relationshipResults.length
    : 0

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Exercise header */}
      <div className="px-6 py-4 border-b border-[#27272a] bg-[#0f0f0f] flex items-start justify-between gap-4 flex-shrink-0">
        <div className="max-w-2xl">
          <h1 className="text-lg font-semibold text-[#fafafa] mb-1">{exercise.title}</h1>
          <p className="text-sm text-[#71717a]">{exercise.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#71717a] border border-[#27272a] rounded-lg hover:border-[#71717a] transition-colors"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={handleCheckAnswer}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-[#6366f1] hover:bg-[#4f52c7] text-white rounded-lg transition-colors font-medium"
          >
            Check Answer
          </button>
        </div>
      </div>

      {/* Validation result banner */}
      {validationResult && (
        <div
          className={`px-6 py-3 border-b flex items-center gap-3 flex-shrink-0 ${
            validationResult.isFullyCorrect
              ? 'bg-[#22c55e]/10 border-[#22c55e]/40'
              : 'bg-[#ef4444]/10 border-[#ef4444]/40'
          }`}
        >
          {validationResult.isFullyCorrect ? (
            <CheckCircle size={16} className="text-[#22c55e]" />
          ) : (
            <XCircle size={16} className="text-[#ef4444]" />
          )}
          <span
            className={`text-sm font-medium ${
              validationResult.isFullyCorrect ? 'text-[#22c55e]' : 'text-[#ef4444]'
            }`}
          >
            {validationResult.isFullyCorrect
              ? 'Correct! All entities, attributes, and relationships match the reference answer.'
              : `${correctCount} of ${totalCount} elements correct. Review highlighted items.`}
          </span>

          {/* Legend for diff overlay */}
          {!validationResult.isFullyCorrect && (
            <div className="ml-auto flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[#22c55e]">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block" /> Correct
              </span>
              <span className="flex items-center gap-1 text-[#ef4444]">
                <span className="w-2 h-2 rounded-full bg-[#ef4444] inline-block" /> Incorrect/Missing
              </span>
              <span className="flex items-center gap-1 text-[#f59e0b]">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b] inline-block" /> Extra
              </span>
            </div>
          )}
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 min-h-0">
        <ERDCanvas validationOverlay={validationOverlay} />
      </div>
    </div>
  )
}
