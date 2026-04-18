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

  // Offset labels 25% along the line from each end so they don't hide behind nodes
  const srcLabelX = sourceX + (targetX - sourceX) * 0.2
  const srcLabelY = sourceY + (targetY - sourceY) * 0.2
  const tgtLabelX = targetX + (sourceX - targetX) * 0.2
  const tgtLabelY = targetY + (sourceY - targetY) * 0.2

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: selected ? '#6366f1' : '#52525b', strokeWidth: 1.5 }}
        markerStart={`url(#cf-${srcCard}-s)`}
        markerEnd={`url(#cf-${tgtCard}-e)`}
      />
      <EdgeLabelRenderer>
        {d?.sourceLabel && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -120%) translate(${srcLabelX}px,${srcLabelY}px)`,
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
              transform: `translate(-50%, -120%) translate(${tgtLabelX}px,${tgtLabelY}px)`,
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