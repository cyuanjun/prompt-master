import { SketchCard } from '@/components/primitives/SketchCard'

type LockedPromptProps = {
  prompt: string
  label?: string
}

export function LockedPrompt({
  prompt,
  label = '🔒 Your locked prompt',
}: LockedPromptProps) {
  return (
    <SketchCard color="#fef9c3" rotate={-0.5} shadow="sm">
      <div
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#1a1a1a',
          marginBottom: '0.4rem',
        }}
      >
        {label}
      </div>
      <p
        style={{
          fontSize: '0.95rem',
          color: '#1a1a1a',
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {prompt}
      </p>
    </SketchCard>
  )
}
