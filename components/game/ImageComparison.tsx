import { SketchCard } from '@/components/primitives/SketchCard'

type ImageComparisonProps = {
  targetUrl: string
  generatedUrl: string | null
  forfeit: boolean
}

export function ImageComparison({
  targetUrl,
  generatedUrl,
  forfeit,
}: ImageComparisonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SketchCard rotate={-1} style={{ padding: '0.75rem' }}>
        <Label>Target</Label>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={targetUrl}
          alt="Target image"
          style={imageStyle}
        />
      </SketchCard>

      <SketchCard rotate={1} altRadius style={{ padding: '0.75rem' }}>
        <Label>Your image</Label>
        {generatedUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={generatedUrl}
            alt="Your generated image"
            style={imageStyle}
          />
        ) : (
          <div
            style={{
              ...imageStyle,
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f5f5f4',
              color: '#737373',
              fontStyle: 'italic',
              fontSize: '0.95rem',
              textAlign: 'center',
              padding: '2rem',
            }}
          >
            {forfeit
              ? 'No prompt submitted — round forfeited'
              : 'No image'}
          </div>
        )}
      </SketchCard>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        background: '#1a1a1a',
        color: '#ffffff',
        padding: '0.2rem 0.5rem',
        borderRadius: '2px 6px 3px 5px',
        marginBottom: '0.5rem',
      }}
    >
      {children}
    </span>
  )
}

const imageStyle: React.CSSProperties = {
  width: '100%',
  height: 'auto',
  display: 'block',
  border: '2px solid #1a1a1a',
  borderRadius: '4px 8px 2px 10px',
}
