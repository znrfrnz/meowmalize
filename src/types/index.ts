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
