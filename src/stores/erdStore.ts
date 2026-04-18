'use client'
import { create } from 'zustand'
import type { Node, Edge } from '@xyflow/react'

interface Snapshot {
  nodes: Node[]
  edges: Edge[]
}

const MAX_HISTORY = 50

interface ErdState {
  nodes: Node[]
  edges: Edge[]
  _past: Snapshot[]
  _future: Snapshot[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  /** Sync from React Flow without pushing history (for drag, resize, etc.) */
  syncNodes: (nodes: Node[]) => void
  syncEdges: (edges: Edge[]) => void
  addNode: (node: Node) => void
  removeNode: (nodeId: string) => void
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void
  clearCanvas: () => void
  undo: () => void
  redo: () => void
}

function pushHistory(state: ErdState): Partial<ErdState> {
  const snapshot: Snapshot = { nodes: state.nodes, edges: state.edges }
  return {
    _past: [...state._past.slice(-MAX_HISTORY + 1), snapshot],
    _future: [],
  }
}

export const useErdStore = create<ErdState>()((set, get) => ({
  nodes: [],
  edges: [],
  _past: [],
  _future: [],

  setNodes: (nodes) => set((s) => ({ ...pushHistory(s), nodes })),
  setEdges: (edges) => set((s) => ({ ...pushHistory(s), edges })),

  syncNodes: (nodes) => set({ nodes }),
  syncEdges: (edges) => set({ edges }),

  addNode: (node) =>
    set((s) => ({ ...pushHistory(s), nodes: [...s.nodes, node] })),

  removeNode: (nodeId) =>
    set((s) => ({
      ...pushHistory(s),
      nodes: s.nodes.filter((n) => n.id !== nodeId),
      edges: s.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    })),

  updateNodeData: (nodeId, data) =>
    set((s) => ({
      ...pushHistory(s),
      nodes: s.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  clearCanvas: () => set((s) => ({ ...pushHistory(s), nodes: [], edges: [] })),

  undo: () => {
    const { _past, _future, nodes, edges } = get()
    if (_past.length === 0) return
    const prev = _past[_past.length - 1]
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      _past: _past.slice(0, -1),
      _future: [{ nodes, edges }, ..._future.slice(0, MAX_HISTORY - 1)],
    })
  },

  redo: () => {
    const { _past, _future, nodes, edges } = get()
    if (_future.length === 0) return
    const next = _future[0]
    set({
      nodes: next.nodes,
      edges: next.edges,
      _past: [..._past, { nodes, edges }],
      _future: _future.slice(1),
    })
  },
}))

export function loadErdCanvas(key: string) {
  try {
    const raw = localStorage.getItem(`infoman:erd:${key}`)
    if (raw) {
      const { nodes, edges } = JSON.parse(raw)
      useErdStore.setState({ nodes: nodes ?? [], edges: edges ?? [], _past: [], _future: [] })
    } else {
      useErdStore.setState({ nodes: [], edges: [], _past: [], _future: [] })
    }
  } catch {
    useErdStore.setState({ nodes: [], edges: [], _past: [], _future: [] })
  }
}

export function saveErdCanvas(key: string) {
  const { nodes, edges } = useErdStore.getState()
  try {
    localStorage.setItem(`infoman:erd:${key}`, JSON.stringify({ nodes, edges }))
  } catch { /* quota exceeded */ }
}
