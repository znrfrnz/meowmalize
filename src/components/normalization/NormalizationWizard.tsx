'use client'
import { useState } from 'react'
import { Exercise, NormFormStep, TableAnswer } from '@/types'
import { WizardTabs } from './WizardTabs'
import { RuleCard } from './RuleCard'
import { TableBuilder } from './TableBuilder'
import { UnfTable } from './UnfTable'
import { FeedbackPanel } from './FeedbackPanel'
import { HintPanel } from './HintPanel'
import { useNormalizationStore } from '@/stores/normalizationStore'
import { validateAnswer, ValidationResult } from '@/lib/normalizationValidator'
import { Trophy } from 'lucide-react'
import Link from 'next/link'
import { getErdExercise } from '@/data/erdExercises'

const STEP_ORDER: NormFormStep[] = ['UNF', '1NF', '2NF', '3NF']
const STEP_INDEX: Record<NormFormStep, number> = { UNF: 0, '1NF': 1, '2NF': 2, '3NF': 3 }
const NEXT_STEP: Partial<Record<NormFormStep, NormFormStep>> = {
  '1NF': '2NF',
  '2NF': '3NF',
}

const emptyAnswer = (): TableAnswer => ({ columns: [{ name: '', isPK: false }], fds: [] })

interface NormalizationWizardProps {
  exercise: Exercise
}

export function NormalizationWizard({ exercise }: NormalizationWizardProps) {
  const [activeStep, setActiveStep] = useState<NormFormStep>('UNF')
  const [currentAnswer, setCurrentAnswer] = useState<TableAnswer[]>([emptyAnswer()])
  const [showUnfTable, setShowUnfTable] = useState(true)
  const [feedbackResult, setFeedbackResult] = useState<ValidationResult | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const { getCompletedSteps, getSavedAnswer, markStepComplete } = useNormalizationStore()
  const completedSteps = getCompletedSteps(exercise.id)

  const currentStepDef = exercise.steps[STEP_INDEX[activeStep]]
  const allStepsComplete = ['1NF', '2NF', '3NF'].every((s) => completedSteps.includes(s as NormFormStep))
  const matchingErdExercise = getErdExercise(exercise.id)

  const handleTabClick = (step: NormFormStep) => {
    setActiveStep(step)
    setShowFeedback(false)
    setFeedbackResult(null)
    if (step !== 'UNF') {
      const saved = getSavedAnswer(exercise.id, step)
      setCurrentAnswer(saved ?? [emptyAnswer()])
    }
  }

  const handleSubmit = () => {
    const result = validateAnswer(currentAnswer, currentStepDef.correctAnswer)
    setFeedbackResult(result)
    setShowFeedback(true)
    if (result.pass) {
      markStepComplete(exercise.id, activeStep, currentAnswer)
    }
  }

  const handleContinue = () => {
    const nextStep = NEXT_STEP[activeStep]
    if (!nextStep) {
      // 3NF passed  completion handled by allStepsComplete check
      setShowFeedback(false)
      setFeedbackResult(null)
      return
    }
    setActiveStep(nextStep)
    const saved = getSavedAnswer(exercise.id, nextStep)
    setCurrentAnswer(saved ?? [emptyAnswer()])
    setShowFeedback(false)
    setFeedbackResult(null)
  }

  const unfTableData = exercise.unfTable

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1 tracking-tight">{exercise.title}</h1>
        <p className="text-sm text-[#71717a]">{exercise.description}</p>
      </div>

      {allStepsComplete && (
        <div className="mb-6 bg-[#34d399]/10 border border-[#34d399]/30 rounded-2xl p-4 flex items-center gap-3">
          <Trophy size={20} className="text-[#34d399]" />
          <div>
            <p className="font-semibold text-[#34d399]">All steps complete</p>
            <p className="text-sm text-[#a1a1aa]">You have successfully normalized this table through 3NF.</p>
            {matchingErdExercise && (
              <Link
                href={`/erd/${exercise.id}`}
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-[#6366f1] hover:text-[#818cf8] transition-colors duration-300 font-medium"
              >
                Now draw the ERD
              </Link>
            )}
          </div>
        </div>
      )}

      <WizardTabs
        activeStep={activeStep}
        completedSteps={completedSteps}
        onStepClick={handleTabClick}
      />

      {activeStep !== 'UNF' && (
        <div className="mb-6">
          <button
            onClick={() => setShowUnfTable((v) => !v)}
            className="text-xs text-[#71717a] hover:text-[#f4f4f5] underline underline-offset-2 mb-2 transition-colors duration-300"
          >
            {showUnfTable ? 'Hide' : 'Show'} source table (UNF)
          </button>
          {showUnfTable && (
            <UnfTable
              columns={unfTableData.columns}
              rows={unfTableData.rows}
              violatingColumns={currentStepDef?.unfViolatingColumns ?? []}
            />
          )}
        </div>
      )}

      {activeStep === 'UNF' ? (
        <div className="space-y-6">
          <RuleCard
            title={currentStepDef.ruleCardTitle}
            body={currentStepDef.ruleCardBody}
          />
          <UnfTable
            columns={unfTableData.columns}
            rows={unfTableData.rows}
          />
          <button
            onClick={() => setActiveStep('1NF')}
            className="h-11 px-6 rounded-xl bg-[#6366f1] text-white text-sm font-medium hover:bg-[#818cf8] active:scale-[0.97] transition-all duration-300"
          >
            Begin 1NF 
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <RuleCard
            title={currentStepDef.ruleCardTitle}
            body={currentStepDef.ruleCardBody}
          />

          {currentStepDef.hints.length > 0 && (
            <HintPanel
              hints={currentStepDef.hints}
              exerciseId={exercise.id}
              step={activeStep}
            />
          )}

          {currentAnswer.map((tableAnswer, idx) => (
            <div key={idx} className="bg-[#141414] border border-[#232326] rounded-2xl p-5">
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

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setCurrentAnswer((prev) => [...prev, emptyAnswer()])}
              className="h-10 px-4 rounded-xl border border-[#232326] text-sm text-[#71717a] hover:text-[#f4f4f5] hover:border-[#3f3f46] active:scale-[0.97] transition-all duration-300"
            >
              + Add table
            </button>
            {currentAnswer.length > 1 && (
              <button
                onClick={() => setCurrentAnswer((prev) => prev.slice(0, -1))}
                className="h-10 px-4 rounded-xl border border-[#232326] text-sm text-[#71717a] hover:text-[#f87171] hover:border-[#f87171]/40 active:scale-[0.97] transition-all duration-300"
              >
                Remove last table
              </button>
            )}
          </div>

          {!(showFeedback && feedbackResult?.pass) && (
            <button
              onClick={handleSubmit}
              className="h-11 px-6 rounded-xl bg-[#6366f1] text-white text-sm font-medium hover:bg-[#818cf8] active:scale-[0.97] transition-all duration-300"
            >
              Check answer
            </button>
          )}

          {showFeedback && feedbackResult && (
            <FeedbackPanel
              result={feedbackResult}
              correctAnswer={currentStepDef.correctAnswer}
              onContinue={feedbackResult.pass ? handleContinue : undefined}
            />
          )}
        </div>
      )}
    </div>
  )
}
