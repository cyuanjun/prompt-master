import Link from 'next/link'
import { SketchButton } from '@/components/primitives/SketchButton'
import { SketchCard } from '@/components/primitives/SketchCard'

export default function HomePage() {
  return (
    <main
      className="min-h-screen w-full flex items-center justify-center px-4 py-12"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-3xl w-full">
        <div className="flex flex-col items-center text-center gap-6">
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#7c3aed',
              fontWeight: 700,
            }}
          >
            an AI prompting game
          </span>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: '#1a1a1a',
              margin: 0,
            }}
          >
            <span>Prompt</span>
            <span style={{ color: '#7c3aed' }}>Master</span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#525252',
              maxWidth: '32rem',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Learn what&apos;s possible. Master how to achieve it.
            <br />
            Recreate a hidden image using only your prompt.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Link href="/play">
              <SketchButton variant="primary">Start practicing →</SketchButton>
            </Link>
            <SketchButton variant="secondary" disabled>
              Battle (soon)
            </SketchButton>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">
          <SketchCard color="#fef9c3" rotate={-1.5}>
            <Step n={1} title="See the target">
              You&apos;re shown an image. You can&apos;t see the prompt that
              made it.
            </Step>
          </SketchCard>
          <SketchCard color="#d1fae5" rotate={0.5} altRadius>
            <Step n={2} title="Write your prompt">
              You have 60 seconds to describe the image as precisely as you
              can.
            </Step>
          </SketchCard>
          <SketchCard color="#fecdd3" rotate={1.5}>
            <Step n={3} title="See how close">
              Compare side-by-side. Get a score and tips on how to do better.
            </Step>
          </SketchCard>
        </div>
      </div>
    </main>
  )
}

function Step({
  n,
  title,
  children,
}: {
  n: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '0.7rem',
          color: '#737373',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}
      >
        Step {n}
      </div>
      <h3
        style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: '#1a1a1a',
          margin: '0.25rem 0 0.5rem',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.92rem',
          color: '#1a1a1a',
          lineHeight: 1.45,
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  )
}
