import { SketchCard } from '@/components/primitives/SketchCard'

type FeedbackCardProps = {
  whatWorked: string[]
  whatToImprove: string[]
}

export function FeedbackCard({ whatWorked, whatToImprove }: FeedbackCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SketchCard color="#d1fae5" rotate={-1} className="p-4">
        <Heading>✓ What worked</Heading>
        <ul style={listStyle}>
          {whatWorked.map((item, i) => (
            <li key={i} style={liStyle}>
              {item}
            </li>
          ))}
        </ul>
      </SketchCard>

      <SketchCard color="#fecdd3" rotate={1} className="p-4">
        <Heading>↑ What to improve</Heading>
        <ul style={listStyle}>
          {whatToImprove.map((item, i) => (
            <li key={i} style={liStyle}>
              {item}
            </li>
          ))}
        </ul>
      </SketchCard>
    </div>
  )
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: '0.85rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: '#1a1a1a',
        marginBottom: '0.5rem',
      }}
    >
      {children}
    </h3>
  )
}

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: '1.1rem',
  listStyle: 'disc',
}

const liStyle: React.CSSProperties = {
  fontSize: '0.92rem',
  color: '#1a1a1a',
  marginBottom: '0.4rem',
  lineHeight: 1.45,
}
