import { SketchCard } from '@/components/primitives/SketchCard'

type TargetImageCardProps = {
  imageUrl: string
  theme: string
  rotate?: number
  label?: string
}

export function TargetImageCard({
  imageUrl,
  theme,
  rotate = -1,
  label = 'Target',
}: TargetImageCardProps) {
  return (
    <SketchCard rotate={rotate} style={{ padding: '0.75rem' }}>
      <div className="flex items-center justify-between mb-2">
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: '#1a1a1a',
            color: '#ffffff',
            padding: '0.2rem 0.5rem',
            borderRadius: '2px 6px 3px 5px',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            color: '#525252',
            fontStyle: 'italic',
            maxWidth: '60%',
            textAlign: 'right',
          }}
        >
          {theme}
        </span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={`Target image: ${theme}`}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          border: '2px solid #1a1a1a',
          borderRadius: '4px 8px 2px 10px',
        }}
      />
    </SketchCard>
  )
}
