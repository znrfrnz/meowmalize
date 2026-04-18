import Link from 'next/link'
import { GeneratedDeckCard } from '@/components/GeneratedDeckCard'
import { BookOpen, Table2, GitFork } from 'lucide-react'

const modules = [
  {
    icon: BookOpen,
    title: 'Flashcard Deck',
    description: 'Study term-definition pairs with spaced repetition-style marking.',
    href: '/flashcards',
    enabled: true,
    supportsUpload: true,
  },
  {
    icon: Table2,
    title: 'Normalization Simulator',
    description: 'Practice UNF → 1NF → 2NF → 3NF step-by-step.',
    href: '/normalization',
    enabled: true,
    supportsUpload: false,
  },
  {
    icon: GitFork,
    title: 'ERD Simulator',
    description: "Draw Crow's Foot entity-relationship diagrams.",
    href: '/erd',
    enabled: true,
    supportsUpload: false,
  },
]

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Study Modules</h1>
      <p className="text-[#71717a] mb-12">Pick a module to start reviewing.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon
          return (
            <div
              key={mod.title}
              className={`border border-[#27272a] rounded-xl p-6 bg-[#1a1a1a] flex flex-col gap-4 transition-all ${
                mod.enabled
                  ? 'hover:-translate-y-0.5 hover:border-[#6366f1]/50'
                  : 'opacity-40'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-[#27272a] flex items-center justify-center">
                <Icon size={20} className="text-[#6366f1]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">{mod.title}</h2>
                <p className="text-sm text-[#71717a]">{mod.description}</p>
              </div>
              {mod.enabled ? (
                <div className="mt-auto flex flex-col gap-2">
                  <Link
                    href={mod.href}
                    className="inline-flex items-center justify-center h-11 px-4 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#4f46e5] transition-colors"
                  >
                    Start Studying
                  </Link>
                  {mod.supportsUpload && (
                    <Link
                      href="/generate"
                      className="inline-flex items-center justify-center h-10 px-4 rounded-lg border border-[#27272a] text-[#71717a] text-sm hover:text-[#fafafa] hover:border-[#6366f1]/50 transition-colors"
                    >
                      Upload Slides
                    </Link>
                  )}
                </div>
              ) : (
                <span className="mt-auto inline-flex items-center justify-center h-8 px-3 rounded-full bg-[#27272a] text-[#71717a] text-xs font-medium w-fit">
                  Coming Soon
                </span>
              )}
            </div>
          )
        })}
        <GeneratedDeckCard />
      </div>
    </div>
  )
}

