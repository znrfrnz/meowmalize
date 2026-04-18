import { describe, it, expect } from 'vitest'
import { compareErd } from './erdValidator'
import type { ErdAnswer } from '@/types'

const ref: ErdAnswer = {
  entities: [
    { id: 'e1', tableName: 'Employee', attributes: [
      { id: 'a1', name: 'EmpID', role: 'PK' },
      { id: 'a2', name: 'EmpName', role: 'Attribute' },
    ]},
    { id: 'e2', tableName: 'Project', attributes: [
      { id: 'a3', name: 'ProjID', role: 'PK' },
    ]},
  ],
  relationships: [
    { id: 'r1', sourceEntityId: 'e1', targetEntityId: 'e2',
      sourceCardinality: 'mandatory-one', targetCardinality: 'mandatory-many' },
  ],
}

describe('compareErd', () => {
  it('marks all elements correct when student answer matches reference', () => {
    const result = compareErd(ref, ref)
    expect(result.isFullyCorrect).toBe(true)
    expect(result.entityResults.every(e => e.status === 'correct')).toBe(true)
  })

  it('marks missing entity as incorrect', () => {
    const student: ErdAnswer = { entities: [ref.entities[0]], relationships: [] }
    const result = compareErd(student, ref)
    const projectResult = result.entityResults.find(e => e.tableName === 'Project')
    expect(projectResult?.status).toBe('incorrect')
  })

  it('marks wrong cardinality relationship as incorrect', () => {
    const student: ErdAnswer = {
      entities: ref.entities,
      relationships: [{ ...ref.relationships[0], id: 's-r1', targetCardinality: 'optional-many' }],
    }
    const result = compareErd(student, ref)
    expect(result.relationshipResults[0].status).toBe('incorrect')
  })

  it('marks extra entity as extra', () => {
    const student: ErdAnswer = {
      entities: [...ref.entities, { id: 'e99', tableName: 'Department', attributes: [] }],
      relationships: ref.relationships,
    }
    const result = compareErd(student, ref)
    const deptResult = result.entityResults.find(e => e.tableName === 'Department')
    expect(deptResult?.status).toBe('extra')
  })

  it('marks wrong attribute role as incorrect', () => {
    const student: ErdAnswer = {
      entities: [{
        ...ref.entities[0],
        attributes: [{ ...ref.entities[0].attributes[0], role: 'Attribute' }, ref.entities[0].attributes[1]],
      }, ref.entities[1]],
      relationships: ref.relationships,
    }
    const result = compareErd(student, ref)
    const empResult = result.entityResults.find(e => e.tableName === 'Employee')
    const empIdAttr = empResult?.attributeResults.find(a => a.name === 'EmpID')
    expect(empIdAttr?.status).toBe('incorrect')
  })

  it('matches entities case-insensitively', () => {
    const student: ErdAnswer = {
      entities: [
        { ...ref.entities[0], tableName: 'employee' },
        { ...ref.entities[1], tableName: 'project' },
      ],
      relationships: ref.relationships,
    }
    const result = compareErd(student, ref)
    expect(result.isFullyCorrect).toBe(true)
  })
})
