type LogoSize = 'sm' | 'md'

interface LogoProps {
  size?: LogoSize
}

export function Logo({ size = 'md' }: LogoProps) {
  const isSm = size === 'sm'
  const fontSize = isSm ? '1.6rem' : 'clamp(2rem, 9vw, 4.25rem)'
  const sparkleClass = isSm
    ? 'absolute -top-1 -right-2 h-4 w-5'
    : 'absolute -top-2 -right-3 h-6 w-8 sm:-top-3 sm:-right-4 sm:h-8 sm:w-10'

  return (
    <div className="relative inline-block text-center leading-[0.95]">
      <span
        className="font-logo logo-text block whitespace-nowrap"
        style={{ fontSize }}
      >
        <span className="text-ink">Prompt</span>
        <span style={{ color: 'var(--purple-dark)' }}>Master</span>
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 64 48"
        className={`${sparkleClass} doodle-icon`}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 38 L12 14 L24 28 L32 8 L40 28 L52 14 L58 38 Z" fill="var(--amber)" />
        <path d="M8 42 L56 42" />
        <circle cx="12" cy="14" r="2" fill="var(--ink)" />
        <circle cx="32" cy="8" r="2" fill="var(--ink)" />
        <circle cx="52" cy="14" r="2" fill="var(--ink)" />
      </svg>
    </div>
  )
}
