'use client'
import { Plus, Undo2, Redo2, Trash2, Download } from 'lucide-react'

interface ERDToolbarProps {
  onAddEntity: () => void
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  onExportPng: () => void
}

export function ERDToolbar({
  onAddEntity,
  onUndo,
  onRedo,
  onClear,
  onExportPng,
}: ERDToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-[#1a1a1a] border border-[#27272a] rounded-full px-3 py-2 shadow-xl">
      <ToolbarButton onClick={onAddEntity} title="Add Entity">
        <Plus size={15} />
        <span className="text-xs">Entity</span>
      </ToolbarButton>
      <Divider />
      <ToolbarButton onClick={onUndo} title="Undo (Ctrl+Z)">
        <Undo2 size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={onRedo} title="Redo (Ctrl+Y)">
        <Redo2 size={15} />
      </ToolbarButton>
      <Divider />
      <ToolbarButton onClick={onClear} title="Clear Canvas" danger>
        <Trash2 size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={onExportPng} title="Export PNG">
        <Download size={15} />
      </ToolbarButton>
    </div>
  )
}

function ToolbarButton({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-sm transition-colors ${
        danger
          ? 'text-[#71717a] hover:text-[#ef4444]'
          : 'text-[#a1a1aa] hover:text-[#fafafa]'
      }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-4 bg-[#27272a] mx-1" />
}
