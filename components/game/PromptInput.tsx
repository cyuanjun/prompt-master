'use client'

import { type ChangeEvent } from 'react'
import { Lightbulb, Pencil, Sparkles } from 'lucide-react'
import { SketchButton } from '@/components/primitives/SketchButton'
import { SketchCard } from '@/components/primitives/SketchCard'

type PromptInputProps = {
  value: string
  onChange: (next: string) => void
  onSubmit: (value: string) => void
  disabled?: boolean
  isSubmitting?: boolean
  maxLength?: number
  tip?: string
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isSubmitting = false,
  maxLength = 150,
  tip = 'Tip: Think about lighting, atmosphere, composition, details!',
}: PromptInputProps) {
  const trimmedEmpty = value.trim().length === 0
  const isDisabled = disabled || isSubmitting

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value.slice(0, maxLength))
  }

  const handleSubmit = () => {
    if (trimmedEmpty || isDisabled) return
    onSubmit(value)
  }

  return (
    <div className="relative">
      <label
        htmlFor="challenge-prompt"
        className="font-label mb-1.5 flex items-center gap-2 text-[0.95rem] leading-tight text-ink sm:text-base"
      >
        <Pencil className="h-4 w-4" />
        Your Prompt
      </label>

      <SketchCard color="#ffffff" className="flex flex-col">
        <textarea
          id="challenge-prompt"
          value={value}
          onChange={handleChange}
          disabled={isDisabled}
          rows={3}
          maxLength={maxLength}
          placeholder="Describe the image as accurately as you can..."
          className="font-label block h-[108px] w-full resize-none bg-transparent px-3 pt-2 pb-1 text-ink outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60 sm:h-[118px] sm:px-4 sm:pt-2.5"
        />
        <div className="flex justify-end px-3 pb-2 sm:px-4">
          <span className="font-label text-xs leading-none text-muted">
            {value.length} / {maxLength}
          </span>
        </div>
      </SketchCard>

      <div className="mt-1.5 flex items-start gap-1.5 text-muted">
        <Lightbulb className="mt-[1px] h-3.5 w-3.5 shrink-0 text-[#f59e0b]" />
        <p className="font-label text-[0.72rem] leading-tight sm:text-xs">
          {tip}
        </p>
      </div>

      <div className="relative mt-2.5">
        <SketchButton
          type="button"
          variant="primary"
          disabled={trimmedEmpty || isDisabled}
          onClick={handleSubmit}
          className="generate-solid-button w-full py-1.5 text-[0.95rem] sm:py-2 sm:text-base"
          icon={<Sparkles className="h-4 w-4" />}
        >
          {isSubmitting ? 'Generating...' : 'Generate'}
        </SketchButton>

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="absolute -right-2 -top-3 h-4 w-4 text-[#7c3aed]"
          fill="currentColor"
        >
          <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="absolute -right-5 top-5 h-3 w-3 text-[#7c3aed]"
          fill="currentColor"
        >
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
        </svg>
      </div>
    </div>
  )
}
