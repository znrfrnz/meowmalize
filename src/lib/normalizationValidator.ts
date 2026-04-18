import { TableAnswer } from '@/types'

export interface ValidationResult {
  pass: boolean
  explanation: string
  columnDiff?: { missing: string[]; extra: string[] }
}

function normalize(s: string): string {
  return s.trim().toLowerCase()
}

function setEqual(a: string[], b: string[]): boolean {
  const normA = a.map(normalize).sort()
  const normB = b.map(normalize).sort()
  if (normA.length !== normB.length) return false
  return normA.every((v, i) => v === normB[i])
}

function setDiff(a: string[], b: string[]): { missing: string[]; extra: string[] } {
  const normA = new Set(a.map(normalize))
  const normB = new Set(b.map(normalize))
  const missing = b.filter((x) => !normA.has(normalize(x)))
  const extra = a.filter((x) => !normB.has(normalize(x)))
  return { missing, extra }
}

/**
 * Find the best matching correct table for a given user table based on column name overlap.
 */
function bestMatch(
  userTable: TableAnswer,
  correctTables: TableAnswer[],
  used: Set<number>
): number {
  let bestIdx = -1
  let bestScore = -1
  const userCols = new Set(userTable.columns.map((c) => normalize(c.name)))

  for (let i = 0; i < correctTables.length; i++) {
    if (used.has(i)) continue
    const correctCols = correctTables[i].columns.map((c) => normalize(c.name))
    const overlap = correctCols.filter((c) => userCols.has(c)).length
    if (overlap > bestScore) {
      bestScore = overlap
      bestIdx = i
    }
  }
  return bestIdx
}

export function validateAnswer(
  userAnswer: TableAnswer[],
  correctAnswer: TableAnswer[]
): ValidationResult {
  // Step 1: table count
  if (userAnswer.length !== correctAnswer.length) {
    return {
      pass: false,
      explanation: `Expected ${correctAnswer.length} table${correctAnswer.length !== 1 ? 's' : ''}, but got ${userAnswer.length}. Adjust your decomposition.`,
    }
  }

  const used = new Set<number>()
  const errors: string[] = []

  for (let ui = 0; ui < userAnswer.length; ui++) {
    const userTable = userAnswer[ui]
    const matchIdx = bestMatch(userTable, correctAnswer, used)

    if (matchIdx === -1) {
      errors.push(`Table ${ui + 1}: no matching correct table found.`)
      continue
    }
    used.add(matchIdx)
    const correctTable = correctAnswer[matchIdx]

    // Step 3: column names
    const userColNames = userTable.columns.map((c) => c.name)
    const correctColNames = correctTable.columns.map((c) => c.name)
    const diff = setDiff(userColNames, correctColNames)

    if (diff.missing.length > 0 || diff.extra.length > 0) {
      const parts: string[] = []
      if (diff.missing.length > 0) parts.push(`missing columns: ${diff.missing.join(', ')}`)
      if (diff.extra.length > 0) parts.push(`extra columns: ${diff.extra.join(', ')}`)
      errors.push(`Table ${ui + 1} has ${parts.join('; ')}.`)
      continue
    }

    // Step 4: PK assignment
    const userPKs = userTable.columns.filter((c) => c.isPK).map((c) => c.name)
    const correctPKs = correctTable.columns.filter((c) => c.isPK).map((c) => c.name)
    if (!setEqual(userPKs, correctPKs)) {
      errors.push(
        `Table ${ui + 1}: primary key is incorrect. Expected PK: (${correctPKs.join(', ')}).`
      )
      continue
    }

    // Step 5: FD check
    for (const correctFD of correctTable.fds) {
      const found = userTable.fds.some(
        (userFD) =>
          setEqual(userFD.lhs, correctFD.lhs) && setEqual(userFD.rhs, correctFD.rhs)
      )
      if (!found) {
        errors.push(
          `Table ${ui + 1}: missing functional dependency ${correctFD.lhs.join(', ')} → ${correctFD.rhs.join(', ')}.`
        )
        break
      }
    }
  }

  if (errors.length > 0) {
    return {
      pass: false,
      explanation: errors[0],
    }
  }

  return {
    pass: true,
    explanation: 'Correct! Your table satisfies this normal form.',
  }
}
