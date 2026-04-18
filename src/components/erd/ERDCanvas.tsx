'use client'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type Node,
  type Edge,
} from '@xyflow/react'
import { useCallback, useEffect, useState } from 'react'
import { useErdStore } from '@/stores/erdStore'
import { EntityNode } from './EntityNode'
import { CrowsFootEdge } from './CrowsFootEdge'
import { ERDToolbar } from './ERDToolbar'
import { NotationLegend } from './NotationLegend'
import { CardinalityPopover } from './CardinalityPopover'
import type { ErdCardinality } from '@/types'

// MUST be at module scope — defining inside component causes infinite re-renders
const nodeTypes = { entityNode: EntityNode }
const edgeTypes = { crowsFoot: CrowsFootEdge }

interface ERDCanvasProps {
  readOnly?: boolean
  validationOverlay?: Map<string, 'correct' | 'incorrect' | 'extra'>
}

export function ERDCanvas({ readOnly = false, validationOverlay }: ERDCanvasProps) {
  const {
    nodes: storedNodes,
    edges: storedEdges,
    setNodes: saveNodes,
    setEdges: saveEdges,
    clearCanvas,
  } = useErdStore()
  const { undo, redo } = useErdStore.temporal.getState()

  const [nodes, setNodes, onNodesChange] = useNodesState(storedNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(storedEdges)

  // Sync to store on every change
  useEffect(() => {
    saveNodes(nodes)
  }, [nodes, saveNodes])
  useEffect(() => {
    saveEdges(edges)
  }, [edges, saveEdges])

  // Popover state
  const [activeEdgeId, setActiveEdgeId] = useState<string | null>(null)
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 })

  const onConnect: OnConnect = useCallback(
    (connection) => {
      const newEdge: Edge = {
        ...connection,
        id: `edge-${Date.now()}`,
        type: 'crowsFoot',
        data: {
          sourceCardinality: 'mandatory-one' as ErdCardinality,
          targetCardinality: 'mandatory-many' as ErdCardinality,
          sourceLabel: '',
          targetLabel: '',
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges]
  )

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      if (readOnly) return
      setActiveEdgeId(edge.id)
      setPopoverPos({ x: event.clientX, y: event.clientY })
    },
    [readOnly]
  )

  const handleAddEntity = useCallback(() => {
    const newNode: Node = {
      id: `entity-${Date.now()}`,
      type: 'entityNode',
      position: { x: 200 + Math.random() * 100, y: 150 + Math.random() * 100 },
      data: {
        tableName: 'NewEntity',
        attributes: [{ id: `attr-${Date.now()}`, name: 'id', role: 'PK' }],
      },
    }
    setNodes((nds) => [...nds, newNode])
  }, [setNodes])

  const handleExportPng = useCallback(async () => {
    const { toPng } = await import('html-to-image')
    const el = document.querySelector('.react-flow__viewport') as HTMLElement
    if (!el) return
    const dataUrl = await toPng(el, { cacheBust: true, backgroundColor: '#0f0f0f' })
    const link = document.createElement('a')
    link.download = 'erd.png'
    link.href = dataUrl
    link.click()
  }, [])

  // Keyboard undo/redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'y' || (e.key === 'z' && e.shiftKey))
      ) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  return (
    <ReactFlowProvider>
      {/* SVG Crow's Foot marker definitions */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          {/* Mandatory One: || */}
          <marker id="cf-mandatory-one" markerWidth="12" markerHeight="10" refX="10" refY="5" orient="auto">
            <line x1="9" y1="0" x2="9" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="6" y1="0" x2="6" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
          </marker>
          {/* Mandatory Many: |< */}
          <marker id="cf-mandatory-many" markerWidth="14" markerHeight="10" refX="12" refY="5" orient="auto">
            <line x1="11" y1="0" x2="11" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="11" y1="5" x2="3" y2="0" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="11" y1="5" x2="3" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
          </marker>
          {/* Optional One: O| */}
          <marker id="cf-optional-one" markerWidth="16" markerHeight="10" refX="14" refY="5" orient="auto">
            <circle cx="4" cy="5" r="3" stroke="#a1a1aa" strokeWidth="1.5" fill="none" />
            <line x1="12" y1="0" x2="12" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
          </marker>
          {/* Optional Many: O< */}
          <marker id="cf-optional-many" markerWidth="16" markerHeight="10" refX="14" refY="5" orient="auto">
            <circle cx="4" cy="5" r="3" stroke="#a1a1aa" strokeWidth="1.5" fill="none" />
            <line x1="13" y1="5" x2="7" y2="0" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="13" y1="5" x2="7" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
          </marker>
        </defs>
      </svg>

      <div className="relative w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={readOnly ? undefined : onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className="bg-[#0f0f0f]"
        >
          <Background color="#27272a" gap={24} />
          <Controls className="!bg-[#1a1a1a] !border-[#27272a]" />
        </ReactFlow>

        {!readOnly && (
          <ERDToolbar
            onAddEntity={handleAddEntity}
            onUndo={undo}
            onRedo={redo}
            onClear={clearCanvas}
            onExportPng={handleExportPng}
          />
        )}

        <NotationLegend />

        {activeEdgeId && !readOnly && (
          <CardinalityPopover
            edgeId={activeEdgeId}
            position={popoverPos}
            edges={edges}
            onUpdate={(id, data) => {
              setEdges((eds) => eds.map((e) => (e.id === id ? { ...e, data } : e)))
              setActiveEdgeId(null)
            }}
            onClose={() => setActiveEdgeId(null)}
          />
        )}
      </div>
    </ReactFlowProvider>
  )
}
