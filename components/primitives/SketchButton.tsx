'use client'

import * as React from 'react'
import { cn } from '@/lib/cn'

export type SketchButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'accent' | 'amber'
  icon?: React.ReactNode
}

const PRESS_VISUAL_MS = 200
const CLICK_DELAY_MS = 140

export const SketchButton = React.forwardRef<
  HTMLButtonElement,
  SketchButtonProps
>(function SketchButton(
  {
    variant = 'primary',
    icon,
    className,
    children,
    type = 'button',
    disabled,
    onClick,
    ...rest
  },
  ref,
) {
  const [pressed, setPressed] = React.useState(false)
  const timeoutsRef = React.useRef<number[]>([])

  React.useEffect(() => {
    const timeouts = timeoutsRef.current
    return () => {
      for (const t of timeouts) window.clearTimeout(t)
    }
  }, [])

  // Map variants to palettes. 'amber' is treated as 'accent' for paper-button styling.
  const resolvedVariant = variant === 'amber' ? 'accent' : variant
  const palette =
    resolvedVariant === 'primary'
      ? { background: 'var(--purple)', color: '#fffaf4' }
      : resolvedVariant === 'accent'
        ? { background: 'var(--amber)', color: '#2b251b' }
        : { background: '#fffdf7', color: '#2b251b' }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    setPressed(true)

    const releaseT = window.setTimeout(
      () => setPressed(false),
      PRESS_VISUAL_MS,
    )
    timeoutsRef.current.push(releaseT)

    if (onClick) {
      const fireT = window.setTimeout(() => onClick(e), CLICK_DELAY_MS)
      timeoutsRef.current.push(fireT)
    }
  }

  const paperStyle = {
    '--button-bg': palette.background,
    '--button-color': palette.color,
    transform: pressed ? 'translate(1px, 1px)' : undefined,
  } as React.CSSProperties

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'paper-sticker-button font-label inline-flex items-center justify-center gap-2 px-4 py-2 text-base sm:px-5 sm:py-2.5 sm:text-lg',
        'transition-transform duration-150 ease-out',
        'hover:-rotate-1',
        'disabled:cursor-not-allowed disabled:opacity-85 disabled:hover:rotate-0',
        className,
      )}
      data-variant={resolvedVariant}
      style={paperStyle}
      {...rest}
    >
      <span>{children}</span>
      {icon ? <span className="inline-flex items-center">{icon}</span> : null}
    </button>
  )
})
