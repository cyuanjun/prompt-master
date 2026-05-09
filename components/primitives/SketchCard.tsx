import * as React from "react";
import { cn } from "@/lib/cn";

export type SketchCardProps = {
  children: React.ReactNode;
  rotate?: number;
  color?: string;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "color">;

export function SketchCard({
  children,
  rotate = 0,
  color = "#ffffff",
  className,
  style,
  ...rest
}: SketchCardProps) {
  const paperStyle = {
    "--paper-card-color": color,
    "--paper-card-rotate": `${rotate}deg`,
    ...style,
  } as React.CSSProperties;

  return (
    <div
      {...rest}
      className={cn("paper-card-base relative", className)}
      style={paperStyle}
    >
      {children}
    </div>
  );
}
