'use client'
import { Plus, Undo2, Redo2, Trash2, Download, Eraser } from 'lucide-react'
import { useState } from 'react'

interface ERDToolbarProps {
  onAddEntity: () => void
  onUndo: () => void
  onRedo: () => void
  onDeleteSelected: () => void
  onClear: () => void
  onExportPng: () => void
}

export function ERDToolbar({
  onAddEntity,
  onUndo,
  onRedo,
  onDeleteSelected,
  onClear,
  onExportPng,
}: ERDToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-[#141414]/90 backdrop-blur-xl border border-[#232326] rounded-full px-3 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <ToolbarButton onClick={onAddEntity} tooltip="Add Entity">
        <Plus size={15} />
        <span className="text-xs">Entity</span>
      </ToolbarButton>
      <Divider />
      <ToolbarButton onClick={onUndo} tooltip="Undo (Ctrl+Z)">
        <Undo2 size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={onRedo} tooltip="Redo (Ctrl+Y)">
        <Redo2 size={15} />
      </ToolbarButton>
      <Divider />
      <ToolbarButton onClick={onDeleteSelected} tooltip="Delete Selected (Del)" danger>
        <Trash2 size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={onClear} tooltip="Clear Canvas" danger>
        <Eraser size={15} />
      </ToolbarButton>
      <Divider />
      <ToolbarButton onClick={onExportPng} tooltip="Export as PNG">
        <Download size={15} />
      </ToolbarButton>
    </div>
  )
}

function ToolbarButton({
  children,
  onClick,
  tooltip,
  danger,
}: {
  children: React.ReactNode
  onClick: () => void
  tooltip: string
  danger?: boolean
}) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 active:scale-[0.9] ${
          danger
            ? 'text-[#71717a] hover:text-[#f87171] hover:bg-[#f87171]/10'
            : 'text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#ffffff]/[0.04]'
        }`}
      >
        {children}
      </button>
      {show && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-[#232326] text-[#f4f4f5] text-[10px] rounded-lg whitespace-nowrap pointer-events-none z-50">
          {tooltip}
        </div>
      )}
    </div>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-[#232326] mx-1" />
}
