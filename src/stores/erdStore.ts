'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { temporal } from 'zundo'
import type { Node, Edge } from '@xyflow/react'

interface ErdState {
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  addNode: (node: Node) => void
  removeNode: (nodeId: string) => void
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void
  clearCanvas: () => void
}

export const useErdStore = create<ErdState>()(
  temporal(
    persist(
      (set) => ({
        nodes: [],
        edges: [],
        setNodes: (nodes) => set({ nodes }),
        setEdges: (edges) => set({ edges }),
        addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
        removeNode: (nodeId) =>
          set((state) => ({
            nodes: state.nodes.filter((n) => n.id !== nodeId),
            edges: state.edges.filter(
              (e) => e.source !== nodeId && e.target !== nodeId
            ),
          })),
        updateNodeData: (nodeId, data) =>
          set((state) => ({
            nodes: state.nodes.map((n) =>
              n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
            ),
          })),
        clearCanvas: () => set({ nodes: [], edges: [] }),
      }),
      { name: 'infoman:erd', skipHydration: true }
    )
  )
)
