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

function bestMatch(userTable: TableAnswer, correctTables: TableAnswer[], used: Set<number>): number {
  let bestIdx = -1
  let bestScore = -1
  const userCols = new Set(userTable.columns.map((c) => normalize(c.name)))
  for (let i = 0; i < correctTables.length; i++) {
    if (used.has(i)) continue
    const correctCols = correctTables[i].columns.map((c) => normalize(c.name))
    const overlap = correctCols.filter((c) => userCols.has(c)).length
    if (overlap > bestScore) { bestScore = overlap; bestIdx = i }
  }
  return bestIdx
}

export function validateAnswer(userAnswer: TableAnswer[], correctAnswer: TableAnswer[]): ValidationResult {
  if (userAnswer.length !== correctAnswer.length) {
    const need = correctAnswer.length
    const got = userAnswer.length
    const hint = got < need ? 'Try decomposing further.' : 'You may have split too many times.'
    return { pass: false, explanation: `This step expects ${need} table${need !== 1 ? 's' : ''} \u2014 you have ${got}. ${hint}` }
  }

  const used = new Set<number>()
  const errors: string[] = []

  for (let ui = 0; ui < userAnswer.length; ui++) {
    const userTable = userAnswer[ui]
    const matchIdx = bestMatch(userTable, correctAnswer, used)
    if (matchIdx === -1) {
      errors.push('One of your tables does not match any expected table. Check the columns you included.')
      continue
    }
    used.add(matchIdx)
    const correctTable = correctAnswer[matchIdx]

    const userColNames = userTable.columns.map((c) => c.name)
    const correctColNames = correctTable.columns.map((c) => c.name)
    const diff = setDiff(userColNames, correctColNames)

    if (diff.missing.length > 0 && diff.extra.length > 0) {
      errors.push(`Table ${ui + 1} has the wrong set of columns \u2014 some columns belong elsewhere and some are missing.`)
      continue
    } else if (diff.missing.length > 0) {
      errors.push(`Table ${ui + 1} is missing ${diff.missing.length} column${diff.missing.length !== 1 ? 's' : ''}. Think about which attributes belong here.`)
      continue
    } else if (diff.extra.length > 0) {
      errors.push(`Table ${ui + 1} has ${diff.extra.length} column${diff.extra.length !== 1 ? 's' : ''} that should not be here. Consider moving ${diff.extra.length !== 1 ? 'them' : 'it'} to another table.`)
      continue
    }

    const userPKs = userTable.columns.filter((c) => c.isPK).map((c) => c.name)
    const correctPKs = correctTable.columns.filter((c) => c.isPK).map((c) => c.name)
    if (!setEqual(userPKs, correctPKs)) {
      if (userPKs.length === 0) errors.push(`Table ${ui + 1} has no primary key. Which column(s) uniquely identify each row?`)
      else if (userPKs.length < correctPKs.length) errors.push(`Table ${ui + 1} primary key is incomplete \u2014 you may need a composite key.`)
      else if (userPKs.length > correctPKs.length) errors.push(`Table ${ui + 1} primary key includes too many columns.`)
      else errors.push(`Table ${ui + 1} has the wrong primary key.`)
      continue
    }

    const missingFDs = correctTable.fds.filter(
      (fd) => !userTable.fds.some((u) => setEqual(u.lhs, fd.lhs) && setEqual(u.rhs, fd.rhs))
    )
    if (missingFDs.length > 0) {
      errors.push(`Table ${ui + 1} is missing ${missingFDs.length} functional dependenc${missingFDs.length !== 1 ? 'ies' : 'y'}. Review which columns determine others.`)
    }
  }

  if (errors.length > 0) return { pass: false, explanation: errors[0] }
  return { pass: true, explanation: 'Correct! Your table satisfies this normal form.' }
}