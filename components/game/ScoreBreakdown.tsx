import type { Feedback } from '@/lib/types'

const LABELS: Array<{ key: keyof Feedback['breakdown']; label: string }> = [
  { key: 'style', label: 'Style' },
  { key: 'composition', label: 'Composition' },
  { key: 'lighting', label: 'Lighting' },
  { key: 'details', label: 'Details' },
  { key: 'atmosphere', label: 'Atmosphere' },
]

export function ScoreBreakdown({
  breakdown,
}: {
  breakdown: Feedback['breakdown']
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {LABELS.map(({ key, label }) => {
        const value = breakdown[key]
        const pct = (value / 20) * 100
        return (
          <div key={key} className="flex items-center gap-3">
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#1a1a1a',
                width: '6.5rem',
              }}
            >
              {label}
            </span>
            <div
              style={{
                flex: 1,
                height: '14px',
                background: '#ffffff',
                border: '2px solid #1a1a1a',
                borderRadius: '4px 8px 2px 6px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: '#7c3aed',
                  transition: 'width 600ms ease-out',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#1a1a1a',
                minWidth: '2.5rem',
                textAlign: 'right',
              }}
            >
              {value}/20
            </span>
          </div>
        )
      })}
    </div>
  )
}
