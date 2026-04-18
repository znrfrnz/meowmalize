'use client'
import { BaseEdge, EdgeLabelRenderer, getStraightPath, type EdgeProps } from '@xyflow/react'
import type { ErdCardinality } from '@/types'

interface CrowsFootEdgeData {
  sourceCardinality: ErdCardinality
  targetCardinality: ErdCardinality
  sourceLabel?: string
  targetLabel?: string
}

export function CrowsFootEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
}: EdgeProps) {
  const d = data as CrowsFootEdgeData | undefined
  const srcCard = d?.sourceCardinality ?? 'mandatory-one'
  const tgtCard = d?.targetCardinality ?? 'mandatory-many'

  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: selected ? '#6366f1' : '#52525b', strokeWidth: 1.5 }}
        markerStart={`url(#cf-${srcCard})`}
        markerEnd={`url(#cf-${tgtCard})`}
      />
      <EdgeLabelRenderer>
        {d?.sourceLabel && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -100%) translate(${sourceX}px,${sourceY}px)`,
              pointerEvents: 'none',
            }}
            className="text-xs text-[#a1a1aa] bg-[#1a1a1a] px-1 rounded nodrag nopan"
          >
            {d.sourceLabel}
          </div>
        )}
        {d?.targetLabel && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, 10px) translate(${targetX}px,${targetY}px)`,
              pointerEvents: 'none',
            }}
            className="text-xs text-[#a1a1aa] bg-[#1a1a1a] px-1 rounded nodrag nopan"
          >
            {d.targetLabel}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  )
}
