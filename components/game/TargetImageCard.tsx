type TargetImageCardProps = {
  imageSrc: string;
  imageAlt?: string;
};

export function TargetImageCard({
  imageSrc,
  imageAlt = "Target image to recreate",
}: TargetImageCardProps) {
  return (
    <div
      className="relative mx-auto w-full max-w-[420px] rotate-[0.35deg]"
      aria-label={imageAlt}
    >
      <div className="relative aspect-[1480/1064] w-full">
        <div className="absolute bottom-[17.1%] left-[9.7%] right-[11.8%] top-[11.2%] overflow-hidden bg-white">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
        <img
          src="/textures/challenge-photo-frame.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
