export default function BookCardSkeleton({ variant = "grid" }) {
  if (variant === "list") {
    return (
      <article
        className="book-card grid animate-pulse grid-cols-[4rem_minmax(0,1fr)] gap-3 p-2.5 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:items-center"
        aria-hidden="true"
      >
        <div className="h-24 rounded-md bg-borderSoft/70 sm:h-28" />

        <div className="min-w-0 self-center space-y-2.5">
          <div className="h-3 w-28 rounded-full bg-borderSoft/70" />
          <div className="h-5 w-4/5 rounded-full bg-borderSoft/80" />
          <div className="h-3 w-2/3 rounded-full bg-borderSoft/70" />
          <div className="flex gap-1">
            <div className="h-5 w-16 rounded-full bg-cream" />
            <div className="h-5 w-20 rounded-full bg-cream" />
          </div>
        </div>

        <div className="col-span-2 flex justify-end gap-2 sm:col-span-1">
          <div className="h-9 w-20 rounded-lg bg-borderSoft/70" />
          <div className="h-9 w-24 rounded-lg bg-borderSoft/80" />
        </div>
      </article>
    );
  }

  return (
    <article className="book-card flex h-full animate-pulse flex-col" aria-hidden="true">
      <div className="relative aspect-[2/3] shrink-0 overflow-hidden border-b border-borderSoft bg-cream">
        <div className="absolute inset-0 bg-gradient-to-br from-borderSoft/80 via-cream to-borderSoft/60" />
        <div className="absolute left-2 top-2 h-9 w-9 rounded-full bg-white/50" />
        <div className="absolute right-2 top-2 h-6 w-20 rounded-full bg-white/60" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 h-3 w-24 rounded-full bg-borderSoft/70" />
        <div className="mb-2 h-5 w-full rounded-full bg-borderSoft/80" />
        <div className="mb-3 h-5 w-4/5 rounded-full bg-borderSoft/80" />
        <div className="mb-4 h-4 w-2/3 rounded-full bg-borderSoft/70" />

        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-3 w-3 rounded-full bg-borderSoft/70" />
            ))}
          </div>
          <div className="h-3 w-10 rounded-full bg-borderSoft/70" />
        </div>

        <div className="mt-3 h-9 rounded-lg bg-borderSoft/70" />

        <div className="mt-3 flex gap-1">
          <div className="h-5 w-16 rounded-full bg-cream" />
          <div className="h-5 w-20 rounded-full bg-cream" />
        </div>
      </div>
    </article>
  );
}
