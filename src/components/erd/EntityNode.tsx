'use client'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { useCallback } from 'react'
import { useErdStore } from '@/stores/erdStore'
import type { ErdAttribute, ErdAttributeRole } from '@/types'
import { X, Plus } from 'lucide-react'

export function EntityNode({ id, data, selected }: NodeProps) {
  const { updateNodeData } = useErdStore()
  const tableName = data.tableName as string
  const attributes = data.attributes as ErdAttribute[]

  const setTableName = useCallback(
    (name: string) => updateNodeData(id, { tableName: name }),
    [id, updateNodeData]
  )

  const updateAttribute = useCallback(
    (attrId: string, patch: Partial<ErdAttribute>) => {
      updateNodeData(id, {
        attributes: attributes.map((a) => (a.id === attrId ? { ...a, ...patch } : a)),
      })
    },
    [id, attributes, updateNodeData]
  )

  const addAttribute = useCallback(() => {
    updateNodeData(id, {
      attributes: [
        ...attributes,
        { id: `attr-${Date.now()}`, name: 'attribute', role: 'Attribute' as ErdAttributeRole },
      ],
    })
  }, [id, attributes, updateNodeData])

  const removeAttribute = useCallback(
    (attrId: string) => {
      updateNodeData(id, { attributes: attributes.filter((a) => a.id !== attrId) })
    },
    [id, attributes, updateNodeData]
  )

  const roleBadge: Record<ErdAttributeRole, string> = {
    PK: 'text-[#6366f1] font-bold',
    FK: 'text-[#f59e0b]',
    Attribute: 'text-[#71717a]',
  }

  return (
    <div
      className={`bg-[#1a1a1a] border rounded-xl min-w-[180px] shadow-lg text-sm ${
        selected ? 'border-[#6366f1]' : 'border-[#27272a]'
      }`}
    >
      {/* Handles on all four edges */}
      <Handle type="source" position={Position.Top} className="!bg-[#6366f1] !border-[#6366f1]" />
      <Handle type="source" position={Position.Bottom} className="!bg-[#6366f1] !border-[#6366f1]" />
      <Handle type="source" position={Position.Left} className="!bg-[#6366f1] !border-[#6366f1]" />
      <Handle type="source" position={Position.Right} className="!bg-[#6366f1] !border-[#6366f1]" />
      <Handle type="target" position={Position.Top} id="top-t" className="!bg-[#6366f1] !opacity-0" />
      <Handle type="target" position={Position.Bottom} id="bottom-t" className="!bg-[#6366f1] !opacity-0" />
      <Handle type="target" position={Position.Left} id="left-t" className="!bg-[#6366f1] !opacity-0" />
      <Handle type="target" position={Position.Right} id="right-t" className="!bg-[#6366f1] !opacity-0" />

      {/* Table name */}
      <div className="px-3 py-2 border-b border-[#27272a] bg-[#27272a]/50 rounded-t-xl">
        <input
          className="bg-transparent text-[#fafafa] font-semibold w-full outline-none text-center placeholder:text-[#71717a]"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="Entity name"
        />
      </div>

      {/* Attributes */}
      <div className="p-2 space-y-1">
        {attributes.map((attr) => (
          <div key={attr.id} className="flex items-center gap-1.5">
            <input
              className="flex-1 bg-[#27272a] rounded px-2 py-1 text-xs outline-none text-[#fafafa] min-w-0"
              value={attr.name}
              onChange={(e) => updateAttribute(attr.id, { name: e.target.value })}
              placeholder="attribute"
            />
            <select
              className={`bg-[#27272a] rounded px-1 py-1 text-xs outline-none border-none ${roleBadge[attr.role]}`}
              value={attr.role}
              onChange={(e) => updateAttribute(attr.id, { role: e.target.value as ErdAttributeRole })}
            >
              <option value="PK">PK</option>
              <option value="FK">FK</option>
              <option value="Attribute">Attr</option>
            </select>
            <button
              onClick={() => removeAttribute(attr.id)}
              className="text-[#71717a] hover:text-[#ef4444] transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={addAttribute}
          className="flex items-center gap-1 text-xs text-[#71717a] hover:text-[#6366f1] transition-colors pt-1 w-full"
        >
          <Plus size={12} /> Add attribute
        </button>
      </div>
    </div>
  )
}
