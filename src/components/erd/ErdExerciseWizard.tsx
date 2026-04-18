'use client'
import { useState, useCallback } from 'react'
import { ERDCanvas } from './ERDCanvas'
import { useErdStore } from '@/stores/erdStore'
import { compareErd } from '@/lib/erdValidator'
import type { ErdExercise, ErdValidationResult, ErdAnswer, ErdAttributeRole, ErdCardinality } from '@/types'
import type { Node, Edge } from '@xyflow/react'
import { CheckCircle, XCircle, RotateCcw, ChevronDown, ChevronRight, Table2 } from 'lucide-react'

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

const roleBadge: Record<ErdAttributeRole, string> = {
  PK: 'text-[#6366f1] font-semibold',
  FK: 'text-[#f59e0b]',
  Attribute: 'text-[#a1a1aa]',
}

export function ErdExerciseWizard({ exercise }: ErdExerciseWizardProps) {
  const { nodes, edges, clearCanvas } = useErdStore()
  const [validationResult, setValidationResult] = useState<ErdValidationResult | null>(null)
  const [refOpen, setRefOpen] = useState(true)

  const handleCheckAnswer = useCallback(() => {
    const studentAnswer = toErdAnswer(nodes, edges)
    const result = compareErd(studentAnswer, exercise.referenceAnswer)
    setValidationResult(result)
  }, [nodes, edges, exercise.referenceAnswer])

  const handleReset = useCallback(() => {
    clearCanvas()
    setValidationResult(null)
  }, [clearCanvas])

  // Build validation overlay map: elementId -> status
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

  const refEntities = exercise.referenceAnswer.entities

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Exercise header */}
      <div className="px-6 py-4 border-b border-[#232326] bg-[#0a0a0b] flex items-start justify-between gap-4 flex-shrink-0">
        <div className="max-w-2xl">
          <h1 className="text-lg font-semibold text-[#f4f4f5] mb-1 tracking-tight">{exercise.title}</h1>
          <p className="text-sm text-[#71717a]">{exercise.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#71717a] border border-[#232326] rounded-xl hover:border-[#3f3f46] active:scale-[0.95] transition-all duration-300"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={handleCheckAnswer}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-[#6366f1] hover:bg-[#818cf8] text-white rounded-xl active:scale-[0.97] transition-all duration-300 font-medium"
          >
            Check answer
          </button>
        </div>
      </div>

      {/* 3NF Reference Tables */}
      <div className="border-b border-[#232326] bg-[#0a0a0b] flex-shrink-0">
        <button
          onClick={() => setRefOpen(!refOpen)}
          className="w-full px-6 py-2.5 flex items-center gap-2 text-xs font-medium text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors duration-300"
        >
          <Table2 size={13} />
          <span>3NF Reference Tables</span>
          {refOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>
        {refOpen && (
          <div className="px-6 pb-4 flex gap-3 overflow-x-auto">
            {refEntities.map((entity) => (
              <div
                key={entity.id}
                className="min-w-[140px] border border-[#232326] rounded-2xl bg-[#141414] text-xs flex-shrink-0"
              >
                <div className="px-3 py-1.5 border-b border-[#232326] bg-[#1c1c1e] rounded-t-2xl">
                  <span className="font-semibold text-[#f4f4f5]">{entity.tableName}</span>
                </div>
                <div className="px-3 py-1.5 space-y-0.5">
                  {entity.attributes.map((attr) => (
                    <div key={attr.id} className="flex items-center justify-between gap-2">
                      <span className="text-[#d4d4d8]">{attr.name}</span>
                      <span className={`text-[10px] ${roleBadge[attr.role]}`}>{attr.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Validation result banner */}
      {validationResult && (
        <div
          className={`px-6 py-3 border-b flex items-center gap-3 flex-shrink-0 ${
            validationResult.isFullyCorrect
              ? 'bg-[#34d399]/10 border-[#34d399]/30'
              : 'bg-[#f87171]/10 border-[#f87171]/30'
          }`}
        >
          {validationResult.isFullyCorrect ? (
            <CheckCircle size={16} className="text-[#34d399]" />
          ) : (
            <XCircle size={16} className="text-[#f87171]" />
          )}
          <span
            className={`text-sm font-medium ${
              validationResult.isFullyCorrect ? 'text-[#34d399]' : 'text-[#f87171]'
            }`}
          >
            {validationResult.isFullyCorrect
              ? 'Correct! All entities, attributes, and relationships match the reference answer.'
              : `${correctCount} of ${totalCount} elements correct. Review highlighted items.`}
          </span>

          {/* Legend for diff overlay */}
          {!validationResult.isFullyCorrect && (
            <div className="ml-auto flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[#34d399]">
                <span className="w-2 h-2 rounded-full bg-[#34d399] inline-block" /> Correct
              </span>
              <span className="flex items-center gap-1 text-[#f87171]">
                <span className="w-2 h-2 rounded-full bg-[#f87171] inline-block" /> Incorrect/Missing
              </span>
              <span className="flex items-center gap-1 text-[#fbbf24]">
                <span className="w-2 h-2 rounded-full bg-[#fbbf24] inline-block" /> Extra
              </span>
            </div>
          )}
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 min-h-0">
        <ERDCanvas storageKey={`exercise-${exercise.id}`} validationOverlay={validationOverlay} />
      </div>
    </div>
  )
}