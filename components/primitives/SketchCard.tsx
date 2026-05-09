import * as React from 'react'
import { cn } from '@/lib/cn'

export type SketchCardProps = {
  children: React.ReactNode
  rotate?: number
  color?: string
  className?: string
  altRadius?: boolean
  shadow?: 'sm' | 'md' | 'lg' | 'none'
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>

export function SketchCard({
  children,
  rotate = 0,
  color = '#ffffff',
  className,
  style,
  // Accepted for backward-compat with older call sites; the new paper-card-base
  // styling doesn't use them. Strip out so they don't leak onto the DOM.
  altRadius: _altRadius,
  shadow: _shadow,
  ...rest
}: SketchCardProps) {
  void _altRadius
  void _shadow
  const paperStyle = {
    '--paper-card-color': color,
    '--paper-card-rotate': `${rotate}deg`,
    ...style,
  } as React.CSSProperties

  return (
    <div
      {...rest}
      className={cn('paper-card-base relative', className)}
      style={paperStyle}
    >
      {children}
    </div>
  )
}
