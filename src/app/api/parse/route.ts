import { NextRequest, NextResponse } from 'next/server'
import { parseOffice } from 'officeparser'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_BYTES = 50 * 1024 * 1024 // 50 MB

async function extractText(buffer: Buffer, fileName: string): Promise<string> {
  if (fileName.match(/\.pdf$/i)) {
    // Lazy-load to avoid test-file crash at module init
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse')
    const { text } = await pdfParse(buffer)
    return text
  }
  // PPTX/DOCX — use officeparser
  const result = await parseOffice(buffer, { outputErrorToConsole: false })
  return typeof result === 'string' ? result : result.toText()
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') ?? ''

  try {
    // Text-paste path
    if (contentType.includes('application/json')) {
      const body = (await req.json()) as { text?: string }
      if (!body.text || typeof body.text !== 'string') {
        return NextResponse.json({ error: 'text field required' }, { status: 400 })
      }
      return NextResponse.json({ text: body.text.trim() })
    }

    // File upload path
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file')
      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: 'File too large — max 50 MB' }, { status: 413 })
      }

      const allowed = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ]
      if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|pptx|ppt|docx|doc)$/i)) {
        return NextResponse.json({ error: 'Only PDF and PPTX files are supported' }, { status: 415 })
      }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const text = await extractText(buffer, file.name)

      if (!text || text.trim().length < 10) {
        return NextResponse.json(
          { error: 'Could not extract text from file — try pasting the text instead' },
          { status: 422 }
        )
      }

      return NextResponse.json({ text: text.trim() })
    }

    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 })
  } catch (err) {
    console.error('[/api/parse] error:', err)
    return NextResponse.json({ error: 'Failed to parse file' }, { status: 500 })
  }
}
