'use client'
import { CheckCircle2 } from 'lucide-react'
import { NormFormStep } from '@/types'

const STEPS: NormFormStep[] = ['UNF', '1NF', '2NF', '3NF']

interface WizardTabsProps {
  activeStep: NormFormStep
  completedSteps: NormFormStep[]
  onStepClick: (step: NormFormStep) => void
}

export function WizardTabs({ activeStep, completedSteps, onStepClick }: WizardTabsProps) {
  const allCompleted = ['UNF', ...completedSteps]

  const isClickable = (step: NormFormStep) => {
    if (allCompleted.includes(step)) return true
    const idx = STEPS.indexOf(step)
    const prevStep = STEPS[idx - 1]
    return prevStep ? allCompleted.includes(prevStep) : false
  }

  return (
    <div className="flex border-b border-[#232326] mb-6">
      {STEPS.map((step) => {
        const completed = allCompleted.includes(step)
        const active = activeStep === step
        const clickable = isClickable(step)

        return (
          <button
            key={step}
            onClick={() => clickable && onStepClick(step)}
            disabled={!clickable}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-300 ${
              active
                ? 'border-[#6366f1] text-[#a5b4fc]'
                : completed
                ? 'border-transparent text-[#a1a1aa] hover:text-[#f4f4f5]'
                : 'border-transparent text-[#71717a] opacity-40 cursor-not-allowed'
            }`}
          >
            {completed && !active && (
              <CheckCircle2 size={14} className="text-[#6366f1]" />
            )}
            {step}
          </button>
        )
      })}
    </div>
  )
}
