import { SketchCard } from '@/components/primitives/SketchCard'

type RecreateNoteProps = {
  text?: string
}

export function RecreateNote({
  text = 'Recreate this image as closely as possible!',
}: RecreateNoteProps) {
  return (
    <div className="relative -mt-0.5">
      <SketchCard
        color="#fef9c3"
        rotate={-1}
        className="mx-auto max-w-[280px] px-4 py-2 text-center sm:max-w-[300px] sm:px-5 sm:py-2.5"
      >
        <p
          className="font-label text-ink"
          style={{ fontSize: 'clamp(0.9rem, 3.7vw, 1.02rem)' }}
        >
          {text}
        </p>
      </SketchCard>
    </div>
  )
}
