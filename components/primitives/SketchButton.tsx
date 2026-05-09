'use client'

import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'

type Variant = 'primary' | 'secondary' | 'amber'

type SketchButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

const VARIANT_STYLES: Record<Variant, { bg: string; color: string }> = {
  primary: { bg: '#7c3aed', color: '#ffffff' },
  secondary: { bg: '#ffffff', color: '#1a1a1a' },
  amber: { bg: '#f59e0b', color: '#1a1a1a' },
}

const PRESS_VISUAL_MS = 200
const CLICK_DELAY_MS = 140

export function SketchButton({
  variant = 'primary',
  children,
  disabled,
  className,
  style,
  onClick,
  ...rest
}: SketchButtonProps) {
  const v = VARIANT_STYLES[variant]
  const [pressed, setPressed] = useState(false)
  const timeoutsRef = useRef<number[]>([])

  // Clean up any pending timers on unmount.
  useEffect(() => {
    const timeouts = timeoutsRef.current
    return () => {
      for (const t of timeouts) window.clearTimeout(t)
    }
  }, [])

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    setPressed(true)

    // Release the press visual after a short window.
    const releaseT = window.setTimeout(
      () => setPressed(false),
      PRESS_VISUAL_MS,
    )
    timeoutsRef.current.push(releaseT)

    // Defer the actual click handler so the press is visible even when the
    // click triggers a state transition that unmounts the button.
    if (onClick) {
      const fireT = window.setTimeout(() => onClick(e), CLICK_DELAY_MS)
      timeoutsRef.current.push(fireT)
    }
  }

  return (
    <button
      {...rest}
      type={rest.type ?? 'button'}
      onClick={handleClick}
      disabled={disabled}
      className={className}
      style={{
        background: v.bg,
        color: v.color,
        border: '2px solid #1a1a1a',
        borderRadius: '2px 10px 4px 8px',
        boxShadow: pressed ? '1px 1px 0 #1a1a1a' : '3px 3px 0 #1a1a1a',
        padding: '0.625rem 1.25rem',
        fontWeight: 600,
        fontSize: '0.95rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transform: pressed ? 'translate(2px, 2px)' : undefined,
        transition: 'transform 80ms ease, box-shadow 80ms ease',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
