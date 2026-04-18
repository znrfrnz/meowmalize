'use client'
import { ERDCanvas } from '@/components/erd/ERDCanvas'

export default function ERDDrawPage() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <ERDCanvas />
    </div>
  )
}
