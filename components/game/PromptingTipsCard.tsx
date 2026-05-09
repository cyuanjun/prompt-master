import { SketchCard } from '@/components/primitives/SketchCard'

export function PromptingTipsCard({ tips }: { tips: string[] }) {
  if (tips.length === 0) return null

  return (
    <SketchCard color="#dbeafe" rotate={-0.5} className="p-4">
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
        🎓 Prompting techniques to practice
      </h3>
      <p
        style={{
          fontSize: '0.78rem',
          color: '#525252',
          fontStyle: 'italic',
          margin: 0,
          marginBottom: '0.75rem',
        }}
      >
        Generic lessons that apply to any prompt — not just this round.
      </p>
      <ul
        style={{
          margin: 0,
          paddingLeft: '1.1rem',
          listStyle: 'disc',
        }}
      >
        {tips.map((tip, i) => (
          <li
            key={i}
            style={{
              fontSize: '0.92rem',
              color: '#1a1a1a',
              marginBottom: '0.45rem',
              lineHeight: 1.45,
            }}
          >
            {tip}
          </li>
        ))}
      </ul>
    </SketchCard>
  )
}
