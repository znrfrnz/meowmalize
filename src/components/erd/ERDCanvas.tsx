'use client'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  ConnectionMode,
  type Node,
  type Edge,
} from '@xyflow/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useErdStore, loadErdCanvas, saveErdCanvas } from '@/stores/erdStore'
import { EntityNode } from './EntityNode'
import { CrowsFootEdge } from './CrowsFootEdge'
import { ERDToolbar } from './ERDToolbar'
import { NotationLegend } from './NotationLegend'
import { CardinalityPopover } from './CardinalityPopover'
import type { ErdCardinality } from '@/types'

// MUST be at module scope  defining inside component causes infinite re-renders
const nodeTypes = { entityNode: EntityNode }
const edgeTypes = { crowsFoot: CrowsFootEdge }

interface ERDCanvasProps {
  storageKey?: string
  readOnly?: boolean
  validationOverlay?: Map<string, 'correct' | 'incorrect' | 'extra'>
}

export function ERDCanvas({ storageKey = 'free', readOnly = false, validationOverlay }: ERDCanvasProps) {
  const nodes = useErdStore((s) => s.nodes)
  const edges = useErdStore((s) => s.edges)
  const syncNodes = useErdStore((s) => s.syncNodes)
  const syncEdges = useErdStore((s) => s.syncEdges)
  const storeSetNodes = useErdStore((s) => s.setNodes)
  const storeSetEdges = useErdStore((s) => s.setEdges)
  const addNode = useErdStore((s) => s.addNode)
  const clearCanvas = useErdStore((s) => s.clearCanvas)
  const undo = useErdStore((s) => s.undo)
  const redo = useErdStore((s) => s.redo)

  const keyRef = useRef(storageKey)

  // Load canvas from localStorage on mount or key change
  useEffect(() => {
    loadErdCanvas(storageKey)
    keyRef.current = storageKey
  }, [storageKey])

  // Save to localStorage on every store change
  useEffect(() => {
    const unsub = useErdStore.subscribe(() => {
      saveErdCanvas(keyRef.current)
    })
    return unsub
  }, [])

  // Handle React Flow node changes (drag, select, remove)
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const hasRemove = changes.some((c) => c.type === 'remove')
      const updated = applyNodeChanges(changes, nodes)
      if (hasRemove) {
        // Push history for structural changes
        storeSetNodes(updated)
      } else {
        // No history for position/selection/dimension changes
        syncNodes(updated)
      }
    },
    [nodes, storeSetNodes, syncNodes]
  )

  // Handle React Flow edge changes (select, remove)
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const hasRemove = changes.some((c) => c.type === 'remove')
      const updated = applyEdgeChanges(changes, edges)
      if (hasRemove) {
        storeSetEdges(updated)
      } else {
        syncEdges(updated)
      }
    },
    [edges, storeSetEdges, syncEdges]
  )

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
      // Push history for new connection
      storeSetEdges(addEdge(newEdge, edges))
    },
    [edges, storeSetEdges]
  )

  // Popover state
  const [activeEdgeId, setActiveEdgeId] = useState<string | null>(null)
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 })

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      if (readOnly) return
      setActiveEdgeId(edge.id)
      setPopoverPos({ x: event.clientX, y: event.clientY })
    },
    [readOnly]
  )

  const handleClear = useCallback(() => {
    clearCanvas()
  }, [clearCanvas])

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
    addNode(newNode)
  }, [addNode])

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

  const handleDeleteSelected = useCallback(() => {
    const newNodes = nodes.filter((n) => !n.selected)
    const removedIds = new Set(nodes.filter((n) => n.selected).map((n) => n.id))
    const newEdges = edges.filter(
      (e) => !e.selected && !removedIds.has(e.source) && !removedIds.has(e.target)
    )
    storeSetNodes(newNodes)
    storeSetEdges(newEdges)
  }, [nodes, edges, storeSetNodes, storeSetEdges])

  // Keyboard undo/redo/delete
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        handleDeleteSelected()
        return
      }
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
  }, [undo, redo, handleDeleteSelected])

  return (
    <ReactFlowProvider>
      {/* SVG Crow's Foot marker definitions */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          {/* -e markers: markerEnd, high-x = near target entity */}
          <marker id="cf-mandatory-one-e" markerWidth="12" markerHeight="10" refX="10" refY="5" orient="auto">
            <line x1="6" y1="0" x2="6" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="9" y1="0" x2="9" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
          </marker>
          <marker id="cf-mandatory-many-e" markerWidth="14" markerHeight="10" refX="12" refY="5" orient="auto">
            <line x1="2" y1="0" x2="2" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="2" y1="5" x2="12" y2="0" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="2" y1="5" x2="12" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
          </marker>
          <marker id="cf-optional-one-e" markerWidth="16" markerHeight="10" refX="14" refY="5" orient="auto">
            <circle cx="5" cy="5" r="3" stroke="#a1a1aa" strokeWidth="1.5" fill="none" />
            <line x1="13" y1="0" x2="13" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
          </marker>
          <marker id="cf-optional-many-e" markerWidth="20" markerHeight="10" refX="18" refY="5" orient="auto">
            <circle cx="5" cy="5" r="3" stroke="#a1a1aa" strokeWidth="1.5" fill="none" />
            <line x1="8" y1="5" x2="18" y2="0" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="8" y1="5" x2="18" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
          </marker>

          {/* -s markers: markerStart, low-x = near source entity */}
          <marker id="cf-mandatory-one-s" markerWidth="12" markerHeight="10" refX="2" refY="5" orient="auto">
            <line x1="3" y1="0" x2="3" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="6" y1="0" x2="6" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
          </marker>
          <marker id="cf-mandatory-many-s" markerWidth="14" markerHeight="10" refX="2" refY="5" orient="auto">
            <line x1="12" y1="0" x2="12" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="12" y1="5" x2="2" y2="0" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="12" y1="5" x2="2" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
          </marker>
          <marker id="cf-optional-one-s" markerWidth="16" markerHeight="10" refX="2" refY="5" orient="auto">
            <line x1="3" y1="0" x2="3" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
            <circle cx="11" cy="5" r="3" stroke="#a1a1aa" strokeWidth="1.5" fill="none" />
          </marker>
          <marker id="cf-optional-many-s" markerWidth="20" markerHeight="10" refX="2" refY="5" orient="auto">
            <line x1="12" y1="5" x2="2" y2="0" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="12" y1="5" x2="2" y2="10" stroke="#a1a1aa" strokeWidth="1.5" />
            <circle cx="15" cy="5" r="3" stroke="#a1a1aa" strokeWidth="1.5" fill="none" />
          </marker>
        </defs>
      </svg>

      <div className="relative w-full h-full">
        <ReactFlow
          nodes={validationOverlay ? nodes.map(n => ({ ...n, data: { ...n.data, validationStatus: validationOverlay.get(n.id) } })) : nodes}
          edges={validationOverlay ? edges.map(e => ({ ...e, data: { ...e.data, validationStatus: validationOverlay.get(e.id) } })) : edges}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={readOnly ? undefined : onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          connectionMode={ConnectionMode.Loose}
          connectionRadius={40}
          proOptions={{ hideAttribution: true }}
          className="bg-[#0f0f0f]"
        >
          <Background color="#27272a" gap={24} />
          <Controls className="!bg-[#1a1a1a] !border-[#27272a] [&>button]:!bg-[#1a1a1a] [&>button]:!border-[#27272a] [&>button]:!fill-[#a1a1aa] [&>button:hover]:!fill-[#fafafa]" showInteractive />
        </ReactFlow>

        {!readOnly && (
          <ERDToolbar
            onAddEntity={handleAddEntity}
            onUndo={undo}
            onRedo={redo}
            onDeleteSelected={handleDeleteSelected}
            onClear={handleClear}
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
              storeSetEdges(edges.map((e) => (e.id === id ? { ...e, data } : e)))
            }}
            onDelete={(id) => {
              storeSetEdges(edges.filter((e) => e.id !== id))
              setActiveEdgeId(null)
            }}
            onClose={() => setActiveEdgeId(null)}
          />
        )}
      </div>
    </ReactFlowProvider>
  )
}
