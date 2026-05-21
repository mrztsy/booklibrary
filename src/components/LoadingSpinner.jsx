export default function LoadingSpinner({ message = "Memuat data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      {/* Animated book pages */}
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <svg className="animate-spin w-16 h-16 text-amber-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        {/* Book icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-amber-600" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
      </div>

      <div className="text-center">
        <p className="font-semibold text-lg text-ink">{message}</p>
        <p className="text-sm text-slate-400 mt-1">Mohon tunggu sebentar</p>
      </div>

      {/* Skeleton cards preview */}
      <div className="hidden sm:grid grid-cols-3 gap-4 mt-4 max-w-lg w-full px-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-lg overflow-hidden">
            <div className="skeleton h-36 w-full rounded-lg mb-2" />
            <div className="skeleton h-3 w-4/5 rounded mb-1.5" />
            <div className="skeleton h-2.5 w-3/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
