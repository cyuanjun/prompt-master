import * as React from "react";
import { cn } from "@/lib/cn";

export type SketchButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "accent";
  icon?: React.ReactNode;
};

export const SketchButton = React.forwardRef<HTMLButtonElement, SketchButtonProps>(
  function SketchButton(
    { variant = "primary", icon, className, children, type = "button", disabled, ...rest },
    ref,
  ) {
    const palette =
      variant === "primary"
        ? { background: "var(--purple)", color: "#fffaf4" }
        : variant === "accent"
        ? { background: "var(--amber)", color: "#2b251b" }
        : { background: "#fffdf7", color: "#2b251b" };

    const paperStyle = {
      "--button-bg": palette.background,
      "--button-color": palette.color,
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "paper-sticker-button font-label inline-flex items-center justify-center gap-2 px-4 py-2 text-base sm:px-5 sm:py-2.5 sm:text-lg",
          "transition-transform duration-150 ease-out",
          "hover:-rotate-1 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
          "disabled:cursor-not-allowed disabled:opacity-85 disabled:hover:rotate-0",
          className,
        )}
        data-variant={variant}
        style={paperStyle}
        {...rest}
      >
        <span>{children}</span>
        {icon ? <span className="inline-flex items-center">{icon}</span> : null}
      </button>
    );
  },
);
