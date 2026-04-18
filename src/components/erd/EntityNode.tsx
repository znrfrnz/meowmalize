'use client'
import { Handle, Position, useReactFlow, type NodeProps } from '@xyflow/react'
import { useCallback } from 'react'
import type { ErdAttribute, ErdAttributeRole } from '@/types'
import { X, Plus } from 'lucide-react'

export function EntityNode({ id, data, selected }: NodeProps) {
  const { updateNodeData } = useReactFlow()
  const tableName = data.tableName as string
  const attributes = (data.attributes as ErdAttribute[]) ?? []
  const validationStatus = data.validationStatus as 'correct' | 'incorrect' | 'extra' | undefined

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
      className={`bg-[#141414] border rounded-2xl min-w-[180px] shadow-[0_4px_24px_rgba(0,0,0,0.3)] text-sm transition-colors duration-300 ${
        validationStatus === 'correct'
          ? 'border-[#34d399] ring-1 ring-[#34d399]/30'
          : validationStatus === 'incorrect'
            ? 'border-[#f87171] ring-1 ring-[#f87171]/30'
            : validationStatus === 'extra'
              ? 'border-[#fbbf24] ring-1 ring-[#fbbf24]/30'
              : selected
                ? 'border-[#6366f1]'
                : 'border-[#232326]'
      }`}
    >
      {/* Top handles */}
      <Handle type="source" position={Position.Top} id="s-t1" style={{ left: '20%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="source" position={Position.Top} id="s-t2" style={{ left: '50%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="source" position={Position.Top} id="s-t3" style={{ left: '80%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      {/* Bottom handles */}
      <Handle type="source" position={Position.Bottom} id="s-b1" style={{ left: '20%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="source" position={Position.Bottom} id="s-b2" style={{ left: '50%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="source" position={Position.Bottom} id="s-b3" style={{ left: '80%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      {/* Left handles */}
      <Handle type="source" position={Position.Left} id="s-l1" style={{ top: '25%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="source" position={Position.Left} id="s-l2" style={{ top: '50%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="source" position={Position.Left} id="s-l3" style={{ top: '75%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      {/* Right handles */}
      <Handle type="source" position={Position.Right} id="s-r1" style={{ top: '25%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="source" position={Position.Right} id="s-r2" style={{ top: '50%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="source" position={Position.Right} id="s-r3" style={{ top: '75%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      {/* Target handles mirror source */}
      <Handle type="target" position={Position.Top} id="t-t1" style={{ left: '20%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="target" position={Position.Top} id="t-t2" style={{ left: '50%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="target" position={Position.Top} id="t-t3" style={{ left: '80%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="target" position={Position.Bottom} id="t-b1" style={{ left: '20%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="target" position={Position.Bottom} id="t-b2" style={{ left: '50%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="target" position={Position.Bottom} id="t-b3" style={{ left: '80%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="target" position={Position.Left} id="t-l1" style={{ top: '25%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="target" position={Position.Left} id="t-l2" style={{ top: '50%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="target" position={Position.Left} id="t-l3" style={{ top: '75%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="target" position={Position.Right} id="t-r1" style={{ top: '25%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="target" position={Position.Right} id="t-r2" style={{ top: '50%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />
      <Handle type="target" position={Position.Right} id="t-r3" style={{ top: '75%' }} className="!w-1 !h-1 !bg-transparent !border-none !opacity-0" />

      <div className="px-3 py-2 border-b border-[#232326] bg-[#1c1c1e] rounded-t-2xl">
        <input
          className="bg-transparent text-[#f4f4f5] font-semibold w-full outline-none text-center placeholder:text-[#3f3f46]"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="Entity name"
        />
      </div>

      <div className="p-2 space-y-1">
        {attributes.map((attr) => (
          <div key={attr.id} className="flex items-center gap-1.5">
            <input
              className="flex-1 bg-[#0a0a0b] rounded-lg px-2 py-1 text-xs outline-none text-[#f4f4f5] min-w-0"
              value={attr.name}
              onChange={(e) => updateAttribute(attr.id, { name: e.target.value })}
              placeholder="attribute"
            />
            <select
              className={`bg-[#0a0a0b] rounded-lg px-1 py-1 text-xs outline-none border-none ${roleBadge[attr.role]}`}
              value={attr.role}
              onChange={(e) => updateAttribute(attr.id, { role: e.target.value as ErdAttributeRole })}
            >
              <option value="PK">PK</option>
              <option value="FK">FK</option>
              <option value="Attribute">Attr</option>
            </select>
            <button
              onClick={() => removeAttribute(attr.id)}
              className="text-[#71717a] hover:text-[#f87171] transition-colors duration-300"
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
