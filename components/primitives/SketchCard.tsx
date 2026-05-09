import type { CSSProperties, ReactNode } from 'react'

type SketchCardProps = {
  children: ReactNode
  rotate?: number
  color?: string
  className?: string
  style?: CSSProperties
  altRadius?: boolean
  shadow?: 'sm' | 'md' | 'lg' | 'none'
}

const RADIUS = '2px 10px 4px 8px'
const RADIUS_ALT = '8px 2px 10px 4px'

const SHADOWS: Record<NonNullable<SketchCardProps['shadow']>, string> = {
  sm: '2px 2px 0 #1a1a1a',
  md: '3px 3px 0 #1a1a1a',
  lg: '5px 5px 0 #1a1a1a',
  none: 'none',
}

export function SketchCard({
  children,
  rotate = 0,
  color = '#ffffff',
  className,
  style,
  altRadius = false,
  shadow = 'md',
}: SketchCardProps) {
  return (
    <div
      className={className}
      style={{
        background: color,
        border: '2px solid #1a1a1a',
        borderRadius: altRadius ? RADIUS_ALT : RADIUS,
        boxShadow: SHADOWS[shadow],
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        padding: '1rem',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
