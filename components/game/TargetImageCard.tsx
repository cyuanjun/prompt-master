type TargetImageCardProps = {
  imageUrl: string
  theme?: string
  imageAlt?: string
}

export function TargetImageCard({
  imageUrl,
  theme,
  imageAlt,
}: TargetImageCardProps) {
  const alt = imageAlt ?? `Target image${theme ? `: ${theme}` : ''}`

  return (
    <div
      className="challenge-frame relative mx-auto w-full max-w-[315px] rotate-[-1.4deg] sm:max-w-[340px]"
      aria-label={alt}
    >
      <div className="relative aspect-[1480/1064] w-full">
        <div className="absolute bottom-[17.1%] left-[9.7%] right-[11.8%] top-[11.2%] overflow-hidden bg-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(135deg,#fff7df,#e9ddff_48%,#bfe7f2)]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={alt}
            className="relative z-10 h-full w-full object-cover"
            draggable={false}
          />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/textures/challenge-photo-frame.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full select-none"
          draggable={false}
        />
      </div>
    </div>
  )
}
