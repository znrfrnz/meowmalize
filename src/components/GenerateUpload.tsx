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
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-[#f4f4f5] mb-1 tracking-tight">Generate flashcards</h1>
        <p className="text-sm text-[#71717a]">
          Upload your lecture slides or paste text to generate AI flashcards.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1.5 p-1 bg-[#141414] border border-[#232326] rounded-xl w-fit">
        {(['file', 'text'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              mode === m
                ? 'bg-[#6366f1]/15 text-[#a5b4fc]'
                : 'text-[#71717a] hover:text-[#f4f4f5]'
            }`}
          >
            {m === 'file' ? 'Upload file' : 'Paste text'}
          </button>
        ))}
      </div>

      {/* Input area */}
      {mode === 'file' ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="group border border-dashed border-[#232326] rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-[#6366f1]/40 transition-all duration-300 bg-[#141414]/50"
        >
          <div className="w-12 h-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center group-hover:bg-[#6366f1]/20 transition-colors duration-300">
            <Upload size={24} className="text-[#6366f1]" />
          </div>
          <p className="text-sm text-[#71717a]">
            {fileName ? (
              <span className="text-[#f4f4f5] font-medium">{fileName}</span>
            ) : (
              <>
                Click to upload{' '}
                <span className="text-[#a5b4fc]">PDF, DOCX or PPTX</span> — max 4.5 MB
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
          className="w-full bg-[#141414] border border-[#232326] rounded-2xl p-4 text-sm text-[#f4f4f5] placeholder-[#3f3f46] resize-none focus:outline-none focus:border-[#6366f1]/40 transition-all duration-300"
        />
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-[#f87171]/5 border border-[#f87171]/20 rounded-xl p-3">
          <AlertCircle size={16} className="text-[#f87171] mt-0.5 flex-shrink-0" />
          <p className="text-sm text-[#f87171]">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-3 bg-[#141414] border border-[#232326] rounded-xl p-4">
          <Loader2 size={20} className="text-[#6366f1] animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-[#f4f4f5]">
              {status === 'parsing'
                ? 'Extracting text from file...'
                : 'Generating flashcards with AI...'}
            </p>
            <p className="text-xs text-[#3f3f46]">This may take 5–20 seconds</p>
          </div>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="h-11 rounded-xl bg-[#6366f1] text-white text-sm font-medium hover:bg-[#818cf8] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
        {isLoading ? 'Generating...' : 'Generate flashcards'}
      </button>
    </div>
  )
}
