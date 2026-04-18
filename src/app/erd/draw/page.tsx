'use client'
import { ERDCanvas } from '@/components/erd/ERDCanvas'

export default function ERDDrawPage() {
  return (
    <div className="h-[calc(100vh-5rem)] w-full">
      <ERDCanvas storageKey="free" />
    </div>
  )
}
