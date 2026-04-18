import type { ErdAnswer, ErdValidationResult, ErdEntityResult, ErdRelationshipResult, ErdElementStatus } from '@/types'

export function compareErd(
  studentAnswer: ErdAnswer,
  referenceAnswer: ErdAnswer
): ErdValidationResult {
  const normalize = (s: string) => s.trim().toLowerCase()

  // --- Entity comparison ---
  const entityResults: ErdEntityResult[] = []

  const refEntityMap = new Map(
    referenceAnswer.entities.map(e => [normalize(e.tableName), e])
  )

  for (const se of studentAnswer.entities) {
    const re = refEntityMap.get(normalize(se.tableName))
    if (!re) {
      entityResults.push({
        entityId: se.id,
        tableName: se.tableName,
        status: 'extra',
        attributeResults: se.attributes.map(a => ({ attributeId: a.id, name: a.name, status: 'extra' as ErdElementStatus })),
      })
      continue
    }
    refEntityMap.delete(normalize(se.tableName))

    const refAttrMap = new Map(re.attributes.map(a => [normalize(a.name), a]))
    const attrResults = se.attributes.map(sa => {
      const ra = refAttrMap.get(normalize(sa.name))
      if (!ra) return { attributeId: sa.id, name: sa.name, status: 'extra' as ErdElementStatus }
      refAttrMap.delete(normalize(sa.name))
      const status: ErdElementStatus = ra.role === sa.role ? 'correct' : 'incorrect'
      return { attributeId: sa.id, name: sa.name, status }
    })
    for (const [, ra] of refAttrMap) {
      attrResults.push({ attributeId: ra.id, name: ra.name, status: 'incorrect' as ErdElementStatus })
    }

    const entityStatus: ErdElementStatus = attrResults.every(a => a.status === 'correct') ? 'correct' : 'incorrect'
    entityResults.push({ entityId: se.id, tableName: se.tableName, status: entityStatus, attributeResults: attrResults })
  }

  for (const [, re] of refEntityMap) {
    entityResults.push({
      entityId: re.id,
      tableName: re.tableName,
      status: 'incorrect',
      attributeResults: re.attributes.map(a => ({ attributeId: a.id, name: a.name, status: 'incorrect' as ErdElementStatus })),
    })
  }

  // --- Relationship comparison ---
  // Match by entity pair first, then check cardinality.
  // Same entities + wrong cardinality -> incorrect. No entity pair match -> extra.
  const relationshipResults: ErdRelationshipResult[] = []

  const makePairKey = (a: string, b: string) => [a, b].sort().join(':')
  const makeFullKey = (srcName: string, tgtName: string, srcCard: string, tgtCard: string) => {
    const isAFirst = srcName <= tgtName
    const [a, b] = isAFirst ? [srcName, tgtName] : [tgtName, srcName]
    const [ac, bc] = isAFirst ? [srcCard, tgtCard] : [tgtCard, srcCard]
    return `${a}:${b}:${ac}:${bc}`
  }

  const refRelByPair = new Map<string, (typeof referenceAnswer.relationships)[0]>()
  const refRelByFull = new Map<string, (typeof referenceAnswer.relationships)[0]>()

  for (const r of referenceAnswer.relationships) {
    const srcName = normalize(referenceAnswer.entities.find(e => e.id === r.sourceEntityId)?.tableName ?? r.sourceEntityId)
    const tgtName = normalize(referenceAnswer.entities.find(e => e.id === r.targetEntityId)?.tableName ?? r.targetEntityId)
    refRelByPair.set(makePairKey(srcName, tgtName), r)
    refRelByFull.set(makeFullKey(srcName, tgtName, r.sourceCardinality, r.targetCardinality), r)
  }

  const consumedRefRels = new Set<string>()

  for (const sr of studentAnswer.relationships) {
    const srcName = normalize(studentAnswer.entities.find(e => e.id === sr.sourceEntityId)?.tableName ?? sr.sourceEntityId)
    const tgtName = normalize(studentAnswer.entities.find(e => e.id === sr.targetEntityId)?.tableName ?? sr.targetEntityId)
    const pairKey = makePairKey(srcName, tgtName)
    const fullKey = makeFullKey(srcName, tgtName, sr.sourceCardinality, sr.targetCardinality)

    if (refRelByFull.has(fullKey) && !consumedRefRels.has(fullKey)) {
      consumedRefRels.add(fullKey)
      refRelByPair.delete(pairKey)
      relationshipResults.push({ relationshipId: sr.id, status: 'correct' })
    } else if (refRelByPair.has(pairKey)) {
      const refRel = refRelByPair.get(pairKey)!
      const refFullKey = makeFullKey(
        normalize(referenceAnswer.entities.find(e => e.id === refRel.sourceEntityId)?.tableName ?? refRel.sourceEntityId),
        normalize(referenceAnswer.entities.find(e => e.id === refRel.targetEntityId)?.tableName ?? refRel.targetEntityId),
        refRel.sourceCardinality,
        refRel.targetCardinality
      )
      consumedRefRels.add(refFullKey)
      refRelByPair.delete(pairKey)
      relationshipResults.push({ relationshipId: sr.id, status: 'incorrect' })
    } else {
      relationshipResults.push({ relationshipId: sr.id, status: 'extra' })
    }
  }

  for (const [fullKey, rr] of refRelByFull) {
    if (!consumedRefRels.has(fullKey)) {
      relationshipResults.push({ relationshipId: rr.id, status: 'incorrect' })
    }
  }

  const isFullyCorrect =
    entityResults.every(e => e.status === 'correct') &&
    relationshipResults.every(r => r.status === 'correct')

  return { entityResults, relationshipResults, isFullyCorrect }
}
