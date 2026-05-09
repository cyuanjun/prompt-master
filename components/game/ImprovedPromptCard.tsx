'use client'

import { useState } from 'react'
import { SketchCard } from '@/components/primitives/SketchCard'

export function ImprovedPromptCard({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard can fail in non-secure contexts; ignore silently.
    }
  }

  return (
    <SketchCard color="#fef9c3" rotate={-1.5} className="p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#1a1a1a',
            margin: 0,
          }}
        >
          ✎ The actual prompt
        </h3>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            background: copied ? '#10b981' : '#1a1a1a',
            color: '#ffffff',
            border: 'none',
            padding: '0.3rem 0.7rem',
            borderRadius: '2px 6px 3px 5px',
            cursor: 'pointer',
            transition: 'background 200ms',
            flexShrink: 0,
          }}
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <p
        style={{
          fontSize: '1rem',
          color: '#1a1a1a',
          lineHeight: 1.55,
          margin: 0,
          fontStyle: 'italic',
        }}
      >
        “{prompt}”
      </p>
    </SketchCard>
  )
}
