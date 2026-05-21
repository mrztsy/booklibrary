export default function SearchFilter({ filters, setFilters, genres, sortOptions, onReset, totalResults }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <form
      onSubmit={e => e.preventDefault()}
      className="bg-white border border-slate-200 rounded-lg shadow-book p-5"
      aria-label="Form pencarian dan filter buku"
      noValidate
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-ink">Cari & Filter</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Menampilkan <span className="font-semibold text-amber-600">{totalResults}</span> buku
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-slate-400 hover:text-amber-600 transition-colors"
        >
          Reset Filter
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">

        {/* 1. Text Search */}
        <div>
          <label htmlFor="search-query" className="section-label block mb-1.5 text-[10px]">
            Judul / Penulis
          </label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              id="search-query"
              type="search"
              value={filters.query}
              onChange={e => handleChange('query', e.target.value)}
              placeholder="Cari buku..."
              className="input-field pl-9"
              autoComplete="off"
            />
          </div>
        </div>

        {/* 2. Genre Select */}
        <div>
          <label htmlFor="genre-select" className="section-label block mb-1.5 text-[10px]">
            Genre
          </label>
          <div className="relative">
            <select
              id="genre-select"
              value={filters.genre}
              onChange={e => handleChange('genre', e.target.value)}
              className="select-field"
            >
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 3. Sort Order */}
        <div>
          <label htmlFor="sort-select" className="section-label block mb-1.5 text-[10px]">
            Urutkan
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={filters.sort}
              onChange={e => handleChange('sort', e.target.value)}
              className="select-field"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 4. Year Range */}
        <div>
          <label htmlFor="year-range" className="section-label block mb-1.5 text-[10px]">
            Tahun Terbit Minimum:{' '}
            <span className="text-amber-600 font-semibold">{filters.yearMin}</span>
          </label>
          <input
            id="year-range"
            type="range"
            min="1800"
            max="2024"
            step="10"
            value={filters.yearMin}
            onChange={e => handleChange('yearMin', Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                       bg-slate-200 accent-amber-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1800</span><span>2024</span>
          </div>
        </div>

        {/* 5. Min Rating (number input) */}
        <div>
          <label htmlFor="min-rating" className="section-label block mb-1.5 text-[10px]">
            Rating Minimum
          </label>
          <input
            id="min-rating"
            type="number"
            min="0"
            max="5"
            step="0.5"
            value={filters.minRating}
            onChange={e => handleChange('minRating', Number(e.target.value))}
            className="input-field"
          />
        </div>

        {/* 6. Checkboxes */}
        <div>
          <p className="section-label mb-2 text-[10px]">Filter Tambahan</p>
          <div className="space-y-2">
            {[
              { key: 'onlyAvailable', label: 'Hanya yang tersedia' },
              { key: 'onlyFeatured',  label: 'Unggulan saja' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters[key]}
                  onChange={e => handleChange(key, e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
                <span className="text-sm text-slate-600 group-hover:text-ink transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

      </div>

      {/* Submit (for HTML form semantics) */}
      <button type="submit" className="btn-primary w-full mt-5 justify-center">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        Terapkan Filter
      </button>
    </form>
  )
}
