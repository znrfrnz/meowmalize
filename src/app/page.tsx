import Link from 'next/link'
import Image from 'next/image'
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
    accent: '#6366f1',
  },
  {
    icon: Table2,
    title: 'Normalization Simulator',
    description: 'Practice UNF → 1NF → 2NF → 3NF step-by-step.',
    href: '/normalization',
    enabled: true,
    supportsUpload: false,
    accent: '#34d399',
  },
  {
    icon: GitFork,
    title: 'ERD Simulator',
    description: "Draw Crow's Foot entity-relationship diagrams.",
    href: '/erd',
    enabled: true,
    supportsUpload: false,
    accent: '#fbbf24',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      {/* Hero */}
      <div className="animate-fade-up mb-16 flex items-center gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-3">
            Study smarter,<br />
            <span className="text-[#71717a]">not harder.</span>
          </h1>
          <p className="text-[#a1a1aa] text-base max-w-md leading-relaxed">
            Interactive modules to help you master database concepts, normalization, and ERD diagrams.
          </p>
        </div>
        <Image
          src="/logo.svg"
          alt="Meowmalize cat"
          width={160}
          height={160}
          priority
          className="hidden md:block w-40 h-40 flex-shrink-0 drop-shadow-[0_0_24px_rgba(99,102,241,0.15)]"
        />
      </div>

      {/* Module grid — asymmetric 2+1 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((mod, i) => {
          const Icon = mod.icon
          return (
            <div
              key={mod.title}
              className={`animate-fade-up stagger-${i + 1} group relative rounded-2xl p-[1px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mod.enabled ? 'hover:scale-[1.02] active:scale-[0.98]' : 'opacity-40'
              }`}
              style={{
                background: mod.enabled
                  ? `linear-gradient(145deg, ${mod.accent}20, transparent 50%)`
                  : undefined,
              }}
            >
              {/* Inner card */}
              <div className="relative rounded-2xl bg-[#141414] border border-[#232326] p-6 flex flex-col gap-4 h-full overflow-hidden group-hover:border-[#3f3f46] transition-colors duration-300">
                {/* Subtle glow */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                  style={{ background: mod.accent }}
                />

                <div
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${mod.accent}15` }}
                >
                  <Icon size={20} style={{ color: mod.accent }} strokeWidth={1.5} />
                </div>
                <div className="relative">
                  <h2 className="text-lg font-semibold mb-1.5 tracking-tight">{mod.title}</h2>
                  <p className="text-sm text-[#71717a] leading-relaxed">{mod.description}</p>
                </div>
                {mod.enabled ? (
                  <div className="relative mt-auto flex flex-col gap-2 pt-2">
                    <Link
                      href={mod.href}
                      className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97]"
                      style={{
                        background: mod.accent,
                        color: '#fff',
                      }}
                    >
                      Start studying
                    </Link>
                    {mod.supportsUpload && (
                      <Link
                        href="/generate"
                        className="inline-flex items-center justify-center h-9 px-4 rounded-xl border border-[#232326] text-[#71717a] text-sm hover:text-[#f4f4f5] hover:border-[#3f3f46] transition-all duration-300"
                      >
                        Upload slides
                      </Link>
                    )}
                  </div>
                ) : (
                  <span className="relative mt-auto inline-flex items-center justify-center h-7 px-3 rounded-full bg-[#232326] text-[#71717a] text-xs font-medium w-fit">
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          )
        })}
        <div className="animate-fade-up stagger-4">
          <GeneratedDeckCard />
        </div>
      </div>

      {/* Keyboard legend */}
      <div className="animate-fade-up stagger-5 mt-16 flex justify-center">
        <p className="text-s text-[#3f3f46] font-mono tracking-wide">
          Built with Next.js, React, and Tailwind CSS by <a href="https://www.instagram.com/franzmatigasulo" className="text-[#b50b0b] hover:underline">Franz</a>
        </p>
      </div>
    </div>
  )
}

