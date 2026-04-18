'use client'
import { useState, useRef } from 'react'
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react'
import { GenerationStatus } from '@/types'
import type { Flashcard } from '@/types'

interface GenerateUploadProps {
  onComplete: (cards: Flashcard[]) => void
}

export function GenerateUpload({ onComplete }: GenerateUploadProps) {
  const [mode, setMode] = useState<'file' | 'text'>('file')
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [pastedText, setPastedText] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const selectedFileRef = useRef<File | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const MAX = 4.5 * 1024 * 1024
    if (file.size > MAX) {
      setError('File too large \u2014 max 4.5 MB. Try a smaller file or paste the text instead.')
      return
    }
    setError(null)
    setFileName(file.name)
    selectedFileRef.current = file
  }

  async function handleSubmit() {
    setError(null)

    try {
      // Step 1: parse
      setStatus('parsing')
      let text: string

      if (mode === 'file') {
        const file = selectedFileRef.current
        if (!file) {
          setError('Please select a file first.')
          setStatus('idle')
          return
        }
        const fd = new FormData()
        fd.append('file', file)
        const parseRes = await fetch('/api/parse', { method: 'POST', body: fd })
        if (!parseRes.ok) {
          const err = (await parseRes.json()) as { error?: string }
          throw new Error(err.error ?? 'Failed to parse file')
        }
        const { text: parsed } = (await parseRes.json()) as { text: string }
        text = parsed
      } else {
        if (pastedText.trim().length < 10) {
          setError('Please paste some text first.')
          setStatus('idle')
          return
        }
        const parseRes = await fetch('/api/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: pastedText }),
        })
        const { text: parsed } = (await parseRes.json()) as { text: string }
        text = parsed
      }

      // Step 2: generate
      setStatus('generating')
      const genRes = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = (await genRes.json()) as { cards?: Flashcard[]; error?: string }

      if (!genRes.ok || data.error) {
        throw new Error(data.error ?? 'Generation failed')
      }

      setStatus('done')
      onComplete(data.cards ?? [])
    } catch (err) {
      console.error('[GenerateUpload]', err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  const isLoading = status === 'parsing' || status === 'generating'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#fafafa] mb-1">Generate Flashcards</h1>
        <p className="text-sm text-[#71717a]">
          Upload your lecture slides or paste text to generate AI flashcards.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        {(['file', 'text'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-[#6366f1] text-white'
                : 'bg-[#27272a] text-[#71717a] hover:text-[#fafafa]'
            }`}
          >
            {m === 'file' ? 'Upload File' : 'Paste Text'}
          </button>
        ))}
      </div>

      {/* Input area */}
      {mode === 'file' ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[#27272a] rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-[#6366f1]/50 transition-colors"
        >
          <Upload size={32} className="text-[#71717a]" />
          <p className="text-sm text-[#71717a]">
            {fileName ? (
              <span className="text-[#fafafa] font-medium">{fileName}</span>
            ) : (
              <>
                Click to upload{' '}
                <span className="text-[#6366f1]">PDF or PPTX</span> \u2014 max 4.5 MB
              </>
            )}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.pptx,.ppt"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Paste your lecture notes or slide text here..."
          rows={10}
          className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl p-4 text-sm text-[#fafafa] placeholder-[#71717a] resize-none focus:outline-none focus:border-[#6366f1] transition-colors"
        />
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg p-3">
          <AlertCircle size={16} className="text-[#ef4444] mt-0.5 flex-shrink-0" />
          <p className="text-sm text-[#ef4444]">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[#27272a] rounded-lg p-4">
          <Loader2 size={20} className="text-[#6366f1] animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-[#fafafa]">
              {status === 'parsing'
                ? 'Extracting text from file...'
                : 'Generating flashcards with AI...'}
            </p>
            <p className="text-xs text-[#71717a]">This may take 5\u201320 seconds</p>
          </div>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="h-11 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#4f46e5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
        {isLoading ? 'Generating...' : 'Generate Flashcards'}
      </button>
    </div>
  )
}
