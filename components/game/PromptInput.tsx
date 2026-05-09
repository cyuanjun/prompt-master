'use client'

import { type ChangeEvent, type FormEvent } from 'react'
import { SketchButton } from '@/components/primitives/SketchButton'

type PromptInputProps = {
  value: string
  onChange: (next: string) => void
  onSubmit: (value: string) => void
  disabled?: boolean
  maxLength?: number
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  maxLength = 150,
}: PromptInputProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value.slice(0, maxLength))
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleClick()
  }

  const handleClick = () => {
    if (disabled) return
    onSubmit(value)
  }

  const charCount = value.length
  const trimmedEmpty = value.trim().length === 0

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
      <label
        htmlFor="prompt"
        style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#1a1a1a',
        }}
      >
        Your prompt
      </label>
      <textarea
        id="prompt"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Describe the image as precisely as you can..."
        rows={5}
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          fontFamily: 'inherit',
          background: '#ffffff',
          color: '#1a1a1a',
          border: '2px solid #1a1a1a',
          borderRadius: '2px 10px 4px 8px',
          boxShadow: '3px 3px 0 #1a1a1a',
          resize: 'vertical',
          outline: 'none',
        }}
      />
      <div className="flex items-center justify-between">
        <span
          style={{
            fontSize: '0.75rem',
            color: charCount >= maxLength ? '#dc2626' : '#525252',
          }}
        >
          {charCount} / {maxLength}
        </span>
        <SketchButton
          type="button"
          onClick={handleClick}
          disabled={disabled || trimmedEmpty}
        >
          Lock in prompt →
        </SketchButton>
      </div>
      <p
        style={{
          fontSize: '0.75rem',
          color: '#737373',
          fontStyle: 'italic',
          marginTop: '0.25rem',
        }}
      >
        Tip: be specific about subject, style, lighting, and mood.
      </p>
    </form>
  )
}
