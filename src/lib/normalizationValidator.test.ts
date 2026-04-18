import { describe, it, expect } from 'vitest'
import { validateAnswer } from './normalizationValidator'
import { TableAnswer } from '@/types'

const correctSingle: TableAnswer[] = [
  {
    columns: [
      { name: 'EmpID', isPK: true },
      { name: 'EmpName', isPK: false },
    ],
    fds: [{ lhs: ['EmpID'], rhs: ['EmpName'] }],
  },
]

describe('validateAnswer', () => {
  it('returns pass: true when columns, PKs, and FDs all match exactly', () => {
    const result = validateAnswer(correctSingle, correctSingle)
    expect(result.pass).toBe(true)
    expect(result.explanation).toContain('Correct')
  })

  it('returns pass: true with case-insensitive column names', () => {
    const user: TableAnswer[] = [
      {
        columns: [
          { name: 'empid', isPK: true },
          { name: 'EMPNAME', isPK: false },
        ],
        fds: [{ lhs: ['empid'], rhs: ['empname'] }],
      },
    ]
    const result = validateAnswer(user, correctSingle)
    expect(result.pass).toBe(true)
  })

  it('returns pass: false when columns are wrong', () => {
    const user: TableAnswer[] = [
      {
        columns: [
          { name: 'EmpID', isPK: true },
          { name: 'WrongColumn', isPK: false },
        ],
        fds: [{ lhs: ['EmpID'], rhs: ['WrongColumn'] }],
      },
    ]
    const result = validateAnswer(user, correctSingle)
    expect(result.pass).toBe(false)
    expect(result.explanation.toLowerCase()).toMatch(/column|missing|extra/)
  })

  it('returns pass: false when PK assignment is wrong', () => {
    const user: TableAnswer[] = [
      {
        columns: [
          { name: 'EmpID', isPK: false }, // should be PK
          { name: 'EmpName', isPK: false },
        ],
        fds: [{ lhs: ['EmpID'], rhs: ['EmpName'] }],
      },
    ]
    const result = validateAnswer(user, correctSingle)
    expect(result.pass).toBe(false)
    expect(result.explanation.toLowerCase()).toMatch(/primary key|pk/)
  })

  it('returns pass: false when extra/missing table in multi-table step', () => {
    const correctMulti: TableAnswer[] = [
      {
        columns: [{ name: 'EmpID', isPK: true }, { name: 'EmpName', isPK: false }],
        fds: [{ lhs: ['EmpID'], rhs: ['EmpName'] }],
      },
      {
        columns: [{ name: 'ProjID', isPK: true }, { name: 'ProjName', isPK: false }],
        fds: [{ lhs: ['ProjID'], rhs: ['ProjName'] }],
      },
    ]
    // user only provides one table
    const result = validateAnswer(correctSingle, correctMulti)
    expect(result.pass).toBe(false)
    expect(result.explanation.toLowerCase()).toMatch(/table/)
  })

  it('returns pass: true with FDs in different order (set-equal)', () => {
    const user: TableAnswer[] = [
      {
        columns: [
          { name: 'EmpID', isPK: true },
          { name: 'EmpName', isPK: false },
          { name: 'Dept', isPK: false },
        ],
        fds: [{ lhs: ['EmpID'], rhs: ['Dept', 'EmpName'] }], // RHS order reversed
      },
    ]
    const correct: TableAnswer[] = [
      {
        columns: [
          { name: 'EmpID', isPK: true },
          { name: 'EmpName', isPK: false },
          { name: 'Dept', isPK: false },
        ],
        fds: [{ lhs: ['EmpID'], rhs: ['EmpName', 'Dept'] }],
      },
    ]
    const result = validateAnswer(user, correct)
    expect(result.pass).toBe(true)
  })
})
