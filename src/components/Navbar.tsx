'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Table2, GitFork, FolderOpen, Sparkles } from 'lucide-react'

const navLinks = [
  { href: '/decks', label: 'Decks', icon: FolderOpen },
  { href: '/generate', label: 'Generate', icon: Sparkles },
  { href: '/normalization', label: 'Normalize', icon: Table2 },
  { href: '/erd', label: 'ERD', icon: GitFork },
]

export function Navbar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-center px-4 pt-4 pb-2">
      <div className="flex items-center gap-1 rounded-full border border-[#232326] bg-[#141414]/80 backdrop-blur-xl px-2 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1 mr-1 group"
        >
          <Image
            src="/logo.svg"
            alt="Meowmalize logo"
            width={40}
            height={40}
            className="w-10 h-10 group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] animate-[cat-idle_3s_ease-in-out_infinite]"
          />
          <span className="text-sm font-semibold tracking-tight text-[#f4f4f5]">
            Meowmalize
          </span>
        </Link>

        {/* Separator */}
        <div className="w-px h-4 bg-[#232326]" />

        {/* Links */}
        {navLinks.map((link) => {
          const Icon = link.icon
          const active = isActive(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                active
                  ? 'bg-[#6366f1]/15 text-[#a5b4fc]'
                  : 'text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#ffffff]/[0.04]'
              }`}
            >
              <Icon size={14} strokeWidth={active ? 2 : 1.5} />
              <span>{link.label}</span>
              {active && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#6366f1]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
