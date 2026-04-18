export type CardType = 'definition' | 'enumeration'
export type ProgressStatus = 'known' | 'learning' | null

export interface Flashcard {
  id: string
  type: CardType
  term: string
  definition: string       // for definition type
  items?: string[]         // for enumeration type (the list items)
  itemCount?: number       // derived: items.length, used for hint display
}

export interface GeneratedCard {
  type: CardType
  term: string
  definition: string
  items?: string[]
  itemCount?: number
}

export type GenerationStatus = 'idle' | 'parsing' | 'generating' | 'done' | 'error'

export interface Folder {
  id: string
  name: string
  createdAt: string  // ISO string
}

export interface Deck {
  id: string
  name: string
  folderId: string | null  // null = ungrouped
  cards: Flashcard[]
  createdAt: string        // ISO string
  locked?: boolean         // true = built-in deck, cannot be deleted
}

//  Normalization Simulator Types 

export interface FDPair {
  lhs: string[]
  rhs: string[]
}

export interface TableAnswer {
  columns: Array<{ name: string; isPK: boolean }>
  fds: FDPair[]
}

export type NormFormStep = 'UNF' | '1NF' | '2NF' | '3NF'

export interface NormStepDef {
  step: NormFormStep
  ruleCardTitle: string
  ruleCardBody: string
  hints: string[]
  correctAnswer: TableAnswer[]
  unfViolatingColumns: string[]
}

export interface Exercise {
  id: string
  title: string
  description: string
  unfTable: {
    columns: string[]
    rows: Record<string, string>[]
  }
  steps: NormStepDef[]
}

export interface NormalizationProgress {
  [exerciseId: string]: {
    completedSteps: NormFormStep[]
    stepAnswers: Partial<Record<NormFormStep, TableAnswer[]>>
    hintIndexes: Partial<Record<NormFormStep, number>>
  }
}

//  ERD Simulator Types 

export type ErdAttributeRole = 'PK' | 'FK' | 'Attribute'

export type ErdCardinality =
  | 'mandatory-one'
  | 'mandatory-many'
  | 'optional-one'
  | 'optional-many'

export interface ErdAttribute {
  id: string
  name: string
  role: ErdAttributeRole
}

export interface ErdEntity {
  id: string
  tableName: string
  attributes: ErdAttribute[]
}

export interface ErdRelationship {
  id: string
  sourceEntityId: string
  targetEntityId: string
  sourceCardinality: ErdCardinality
  targetCardinality: ErdCardinality
  sourceLabel?: string
  targetLabel?: string
}

export interface ErdAnswer {
  entities: ErdEntity[]
  relationships: ErdRelationship[]
}

export interface ErdExercise {
  id: string
  title: string
  description: string
  referenceAnswer: ErdAnswer
}

export type ErdElementStatus = 'correct' | 'incorrect' | 'extra'

export interface ErdAttributeResult {
  attributeId: string
  name: string
  status: ErdElementStatus
}

export interface ErdEntityResult {
  entityId: string
  tableName: string
  status: ErdElementStatus
  attributeResults: ErdAttributeResult[]
}

export interface ErdRelationshipResult {
  relationshipId: string
  status: ErdElementStatus
}

export interface ErdValidationResult {
  entityResults: ErdEntityResult[]
  relationshipResults: ErdRelationshipResult[]
  isFullyCorrect: boolean
}
