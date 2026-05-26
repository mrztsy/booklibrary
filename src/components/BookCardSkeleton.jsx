export default function BookCardSkeleton({ variant = "grid" }) {
  if (variant === "list") {
    return (
      <article
        className="book-card grid w-full grid-cols-[5rem_minmax(0,1fr)] gap-3 p-3 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center"
        aria-hidden="true"
      >
        <div className="skeleton-surface h-28 rounded-md sm:h-36 sm:w-24" />

        <div className="min-w-0 self-center">
          <div className="skeleton-line mb-2 h-3 w-24" />
          <div className="skeleton-line mb-2 h-6 w-11/12 max-w-[26rem]" />
          <div className="flex flex-wrap items-center gap-2">
            <div className="skeleton-line h-3 w-36" />
            <div className="skeleton-line h-3 w-12" />
            <div className="skeleton-line h-3 w-12" />
          </div>
          <div className="mt-3 hidden space-y-1.5 md:block">
            <div className="skeleton-line h-4 w-full max-w-[42rem]" />
            <div className="skeleton-line h-4 w-3/5 max-w-md" />
          </div>
          <div className="mt-3 flex gap-1.5">
            <div className="skeleton-chip w-16" />
            <div className="skeleton-chip w-20" />
            <div className="skeleton-chip w-16" />
          </div>
        </div>

        <div className="col-span-2 flex justify-end sm:col-span-1 sm:self-center">
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
            <div className="skeleton-button h-11 w-full sm:h-9 sm:w-24" />
            <div className="skeleton-button h-11 w-full sm:h-9 sm:w-28" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="book-card mx-auto flex h-full w-full max-w-sm flex-col sm:max-w-none"
      aria-hidden="true"
    >
      <div className="relative aspect-[2/3] shrink-0 overflow-hidden border-b border-borderSoft bg-cream">
        <div className="skeleton-surface absolute inset-0" />
        <div className="skeleton-surface absolute left-2 top-2 h-9 w-9 rounded-full" />
        <div className="skeleton-chip absolute right-2 top-2 w-20 bg-white/60" />
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="skeleton-line mb-2 h-3 w-24" />
        <div className="skeleton-line mb-2 h-5 w-full" />
        <div className="skeleton-line mb-3 h-5 w-4/5" />
        <div className="skeleton-line mb-4 h-4 w-2/3" />

        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="skeleton-surface h-3 w-3 rounded-full" />
            ))}
          </div>
          <div className="skeleton-line h-3 w-10" />
        </div>

        <div className="skeleton-button mt-3 h-9" />

        <div className="mt-3 flex gap-1.5">
          <div className="skeleton-chip w-16" />
          <div className="skeleton-chip w-20" />
        </div>
      </div>
    </article>
  );
}

export function ResultsToolbarSkeleton({ viewMode = "grid" }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3" aria-hidden="true">
      <div className="min-w-0 space-y-2">
        <div className="skeleton-line h-3 w-24" />
        <div className="flex flex-wrap items-center gap-2">
          <div className="skeleton-line h-7 w-40" />
          <div className="skeleton-line h-4 w-24" />
        </div>
      </div>
      <div className="skeleton-button h-9 w-44" />
      <div className="flex rounded-lg border border-borderSoft bg-white p-1 shadow-book">
        <div
          className={`h-9 w-24 rounded-md ${
            viewMode === "grid" ? "bg-primary" : "skeleton-button"
          }`}
        />
        <div
          className={`ml-1 h-9 w-24 rounded-md ${
            viewMode === "list" ? "bg-primary" : "skeleton-button"
          }`}
        />
      </div>
    </div>
  );
}

export function StatsPanelSkeleton() {
  return (
    <section
      className="mb-8 overflow-hidden rounded-lg border border-borderSoft bg-white shadow-book"
      aria-hidden="true"
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <div className="border-b border-borderSoft p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="skeleton-line mb-2 h-3 w-24" />
          <div className="skeleton-line h-7 w-52" />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="min-h-[8.5rem] rounded-lg border border-borderSoft bg-cream p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="skeleton-line h-3 w-28" />
                    <div className="skeleton-line mt-3 h-9 w-20" />
                    {item === 4 && <div className="skeleton-line mt-2 h-3 w-16" />}
                  </div>
                  <div className="skeleton-button h-10 w-10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div className="space-y-2">
              <div className="skeleton-line h-3 w-24" />
              <div className="skeleton-line h-6 w-40" />
            </div>
            <div className="skeleton-chip w-16" />
          </div>

          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-borderSoft bg-cream/70 px-3 py-2.5"
              >
                <div className="skeleton-surface h-7 w-7 rounded-full" />
                <div className="skeleton-line h-4 w-full" />
                <div className="skeleton-line h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3" aria-hidden="true">
      <div className="skeleton-button h-10 w-32" />
      <div className="skeleton-button h-10 w-10" />
      <div className="skeleton-button h-10 w-10" />
      <div className="skeleton-button h-10 w-10" />
      <div className="skeleton-button h-10 w-32" />
    </div>
  );
}

export function FeaturedBooksSkeleton() {
  return (
    <section
      aria-label="Memuat buku unggulan"
      className="border-b border-borderSoft bg-white py-12"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 space-y-2">
          <div className="skeleton-line h-3 w-28" />
          <div className="skeleton-line h-7 w-44" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.85fr)]">
          <article className="book-card grid gap-5 p-4 sm:grid-cols-[12rem_minmax(0,1fr)] lg:p-5">
            <div className="skeleton-surface aspect-[2/3] h-full w-full rounded-lg" />

            <div className="flex min-w-0 flex-col">
              <div className="mb-3 flex flex-wrap gap-2">
                <div className="skeleton-chip w-20" />
                <div className="skeleton-chip w-24" />
                <div className="skeleton-chip w-16" />
              </div>
              <div className="skeleton-line h-8 w-4/5" />
              <div className="skeleton-line mt-2 h-4 w-56" />
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="skeleton-line h-4 w-16" />
                <div className="skeleton-line h-4 w-20" />
                <div className="skeleton-line h-4 w-24" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="skeleton-line h-4 w-full" />
                <div className="skeleton-line h-4 w-11/12" />
                <div className="skeleton-line h-4 w-2/3" />
              </div>
              <div className="mt-auto pt-5">
                <div className="skeleton-button h-11 w-32" />
              </div>
            </div>
          </article>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <article
                key={item}
                className="book-card grid w-full grid-cols-[4.5rem_minmax(0,1fr)] gap-3 p-2.5"
              >
                <div className="skeleton-surface h-24 rounded-md" />
                <div className="min-w-0 self-center">
                  <div className="skeleton-line h-4 w-full" />
                  <div className="skeleton-line mt-2 h-3 w-2/3" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="skeleton-line h-3 w-12" />
                    <div className="skeleton-chip w-16" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ModalSynopsisSkeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      <div className="skeleton-line h-4 w-full" />
      <div className="skeleton-line h-4 w-11/12" />
      <div className="skeleton-line h-4 w-3/4" />
    </div>
  );
}

export function BookModalSkeleton({ onClose = () => {} }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(24, 51, 47, 0.76)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Memuat detail buku"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-cream text-textMain shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex max-h-[90vh] flex-col overflow-y-auto sm:flex-row">
          <div className="skeleton-surface min-h-56 flex-shrink-0 sm:w-52" />

          <div className="flex-1 bg-cream p-6">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="skeleton-line h-3 w-28" />
                <div className="skeleton-chip w-20" />
              </div>
              <div className="skeleton-button h-9 w-20" />
            </div>

            <div className="skeleton-line h-8 w-4/5" />
            <div className="mb-5 mt-4">
              <div className="skeleton-line mb-2 h-3 w-32" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-borderSoft bg-white px-3 py-2"
                  >
                    <div className="skeleton-line h-3 w-20" />
                    <div className="skeleton-line mt-2 h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5 rounded-lg border border-borderSoft bg-white px-4 py-3">
              <div className="skeleton-line mb-3 h-3 w-20" />
              <ModalSynopsisSkeleton />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="skeleton-button h-11 w-32" />
              <div className="skeleton-button h-11 w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
