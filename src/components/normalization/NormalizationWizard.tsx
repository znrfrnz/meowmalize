'use client'
import { useState } from 'react'
import { Exercise, NormFormStep, TableAnswer } from '@/types'
import { WizardTabs } from './WizardTabs'
import { RuleCard } from './RuleCard'
import { TableBuilder } from './TableBuilder'
import { useNormalizationStore } from '@/stores/normalizationStore'

const STEP_ORDER: NormFormStep[] = ['UNF', '1NF', '2NF', '3NF']
const STEP_INDEX: Record<NormFormStep, number> = { UNF: 0, '1NF': 1, '2NF': 2, '3NF': 3 }

const emptyAnswer = (): TableAnswer => ({ columns: [{ name: '', isPK: false }], fds: [] })

interface NormalizationWizardProps {
  exercise: Exercise
}

export function NormalizationWizard({ exercise }: NormalizationWizardProps) {
  const [activeStep, setActiveStep] = useState<NormFormStep>('UNF')
  const [currentAnswer, setCurrentAnswer] = useState<TableAnswer[]>([emptyAnswer()])
  const [showUnfTable, setShowUnfTable] = useState(true)

  const { getCompletedSteps, getSavedAnswer } = useNormalizationStore()
  const completedSteps = getCompletedSteps(exercise.id)

  const currentStepDef = exercise.steps[STEP_INDEX[activeStep]]

  const handleTabClick = (step: NormFormStep) => {
    setActiveStep(step)
    if (step !== 'UNF') {
      const saved = getSavedAnswer(exercise.id, step)
      setCurrentAnswer(saved ?? [emptyAnswer()])
    }
  }

  const unfTableData = exercise.unfTable

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{exercise.title}</h1>
        <p className="text-sm text-[#71717a]">{exercise.description}</p>
      </div>

      <WizardTabs
        activeStep={activeStep}
        completedSteps={completedSteps}
        onStepClick={handleTabClick}
      />

      {/* UNF source table — shown on all steps with toggle */}
      {activeStep !== 'UNF' && (
        <div className="mb-6">
          <button
            onClick={() => setShowUnfTable((v) => !v)}
            className="text-xs text-[#71717a] hover:text-[#fafafa] underline underline-offset-2 mb-2 transition-colors"
          >
            {showUnfTable ? 'Hide' : 'Show'} source table (UNF)
          </button>
          {showUnfTable && (
            <div className="mb-4">
              {/* UnfTable goes here — Plan 03-02 */}
              <div className="overflow-x-auto rounded-xl border border-[#27272a]">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      {unfTableData.columns.map((col) => {
                        const isViolating = currentStepDef?.unfViolatingColumns
                          .map((v) => v.toLowerCase())
                          .includes(col.toLowerCase())
                        return (
                          <th
                            key={col}
                            className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide border-b border-[#27272a] ${
                              isViolating
                                ? 'bg-[#ef4444]/15 border-b-2 border-[#ef4444] text-[#ef4444]'
                                : 'bg-[#27272a] text-[#71717a]'
                            }`}
                          >
                            {col}
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {unfTableData.rows.map((row, ri) => (
                      <tr key={ri} className="border-b border-[#27272a] last:border-0">
                        {unfTableData.columns.map((col) => {
                          const isViolating = currentStepDef?.unfViolatingColumns
                            .map((v) => v.toLowerCase())
                            .includes(col.toLowerCase())
                          return (
                            <td
                              key={col}
                              className={`px-4 py-2 text-sm ${
                                isViolating ? 'bg-[#ef4444]/10 text-[#fca5a5]' : 'text-[#a1a1aa]'
                              }`}
                            >
                              {row[col] ?? ''}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeStep === 'UNF' ? (
        <div className="space-y-6">
          <RuleCard
            title={currentStepDef.ruleCardTitle}
            body={currentStepDef.ruleCardBody}
          />
          <div className="overflow-x-auto rounded-xl border border-[#27272a]">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {unfTableData.columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide bg-[#27272a] text-[#71717a] border-b border-[#27272a]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {unfTableData.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-[#27272a] last:border-0">
                    {unfTableData.columns.map((col) => (
                      <td key={col} className="px-4 py-2 text-sm text-[#a1a1aa]">
                        {row[col] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => setActiveStep('1NF')}
            className="h-11 px-6 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#4f46e5] transition-colors"
          >
            Begin 1NF →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <RuleCard
            title={currentStepDef.ruleCardTitle}
            body={currentStepDef.ruleCardBody}
          />

          {/* HintPanel goes here — Plan 03-02 */}

          {currentAnswer.map((tableAnswer, idx) => (
            <div key={idx} className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-5">
              {currentAnswer.length > 1 && (
                <h3 className="text-xs text-[#71717a] uppercase tracking-wide mb-4">
                  Table {idx + 1}
                </h3>
              )}
              <TableBuilder
                value={tableAnswer}
                onChange={(updated) => {
                  const next = [...currentAnswer]
                  next[idx] = updated
                  setCurrentAnswer(next)
                }}
              />
            </div>
          ))}

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentAnswer((prev) => [...prev, emptyAnswer()])}
              className="h-10 px-4 rounded-lg border border-[#27272a] text-sm text-[#71717a] hover:text-[#fafafa] hover:border-[#6366f1]/50 transition-colors"
            >
              + Add table
            </button>
            {currentAnswer.length > 1 && (
              <button
                onClick={() => setCurrentAnswer((prev) => prev.slice(0, -1))}
                className="h-10 px-4 rounded-lg border border-[#27272a] text-sm text-[#71717a] hover:text-[#ef4444] hover:border-[#ef4444]/50 transition-colors"
              >
                Remove last table
              </button>
            )}
          </div>

          <button
            onClick={() => console.log('Check answer:', currentAnswer)}
            className="h-11 px-6 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#4f46e5] transition-colors"
          >
            Check Answer
          </button>

          {/* FeedbackPanel goes here — Plan 03-02 */}
        </div>
      )}
    </div>
  )
}
