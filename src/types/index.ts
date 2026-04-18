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
