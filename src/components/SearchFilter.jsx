<<<<<<< HEAD
import { useEffect, useState } from "react";
import { GENRES, SORT_OPTIONS } from "../data/books";

export default function SearchFilter({
  onFilter,
  onChange,
  onToast,
  resetSignal = 0,
  externalValues,
}) {
  const defaults = {
    q: "",
    author: "",
    genre: "Semua",
    yearMin: 1800,
    minRating: 0,
    available: false,
    featured: false,
    sort: "default",
  };

  const isDefaultValues = (candidate) =>
    Object.entries(defaults).every(([key, value]) => candidate[key] === value);

  const [values, setValues] = useState(defaults);
  const [filterMessage, setFilterMessage] = useState("");
  const set = (key, val) => {
    const nextValues = { ...values, [key]: val };
    setValues(nextValues);
    setFilterMessage("");
    onChange?.(isDefaultValues(nextValues) ? null : nextValues);
  };

  useEffect(() => {
    if (resetSignal > 0) {
      setValues(defaults);
      setFilterMessage("");
      onChange?.(null);
    }
  }, [resetSignal]);

  useEffect(() => {
    if (externalValues) {
      const nextValues = { ...defaults, ...externalValues };
      setValues(nextValues);
      setFilterMessage("");
      onChange?.(isDefaultValues(nextValues) ? null : nextValues);
    }
  }, [externalValues]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const isDefaultFilter = isDefaultValues(values);

    if (isDefaultFilter) {
      setFilterMessage("");
      onChange?.(null);
      onFilter(null);
      onToast?.(
        "Menampilkan buku default",
        "Koleksi kembali ke daftar awal.",
        "info",
      );
      return;
    }

    setFilterMessage("");
    onFilter(values);
  };

  const handleReset = () => {
    setValues(defaults);
    setFilterMessage("");
    onChange?.(null);
    onFilter(null);
    onToast?.(
      "Filter direset",
      "Koleksi buku kembali ke tampilan awal.",
      "info",
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Form pencarian dan filter buku"
      noValidate
      className="bg-white border border-borderSoft rounded-lg shadow-book p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-playfair font-semibold text-textMain">
            Cari Filter
          </h2>
          <p className="text-xs text-textSecondary mt-0.5 font-crimson">
            Gunakan filter di bawah untuk menemukan buku
=======
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
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
          </p>
        </div>
        <button
          type="button"
<<<<<<< HEAD
          onClick={handleReset}
          className="text-xs font-semibold font-crimson text-textSecondary hover:text-accentHover transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="search-query" className="section-label block mb-1.5">
            Judul Buku
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
=======
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
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
            </svg>
            <input
              id="search-query"
              type="search"
<<<<<<< HEAD
              name="q"
              placeholder="Cari judul buku..."
              autoComplete="off"
              aria-invalid={filterMessage ? "true" : undefined}
              aria-describedby={
                filterMessage ? "collection-filter-message" : undefined
              }
              className="input-field pl-9"
              value={values.q}
              onChange={(event) => set("q", event.target.value)}
            />
          </div>
          {filterMessage && (
            <p
              id="collection-filter-message"
              className="mt-2 text-sm font-semibold text-accentHover"
            >
              {filterMessage}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="search-author" className="section-label block mb-1.5">
            Nama Penulis
          </label>
          <input
            id="search-author"
            type="text"
            name="author"
            placeholder="Cari nama penulis..."
            autoComplete="off"
            className="input-field"
            value={values.author}
            onChange={(event) => set("author", event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="genre-select" className="section-label block mb-1.5">
=======
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
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
            Genre
          </label>
          <div className="relative">
            <select
              id="genre-select"
<<<<<<< HEAD
              name="genre"
              className="select-field"
              value={values.genre}
              onChange={(event) => set("genre", event.target.value)}
            >
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
=======
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
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
            </svg>
          </div>
        </div>

<<<<<<< HEAD
        <div>
          <label htmlFor="year-range" className="section-label block mb-1.5">
            Tahun Terbit Minimum:{" "}
            <span className="text-accentHover normal-case">
              {values.yearMin}
            </span>
=======
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
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
          </label>
          <input
            id="year-range"
            type="range"
            min="1800"
            max="2024"
            step="10"
<<<<<<< HEAD
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-borderSoft accent-accent"
            value={values.yearMin}
            onChange={(event) => set("yearMin", Number(event.target.value))}
          />
          <div className="flex justify-between text-xs text-textSecondary font-crimson mt-1">
            <span>1800</span>
            <span>2024</span>
          </div>
        </div>

        <div>
          <label htmlFor="min-rating" className="section-label block mb-1.5">
=======
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
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
            Rating Minimum
          </label>
          <input
            id="min-rating"
            type="number"
            min="0"
            max="5"
            step="0.5"
<<<<<<< HEAD
            className="input-field"
            value={values.minRating}
            onChange={(event) => set("minRating", Number(event.target.value))}
          />
        </div>

        <fieldset>
          <legend className="section-label mb-2">Filter Tambahan</legend>
          <div className="space-y-2">
            {[
              { key: "available", label: "Hanya yang tersedia" },
              { key: "featured", label: "Unggulan saja" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-accent cursor-pointer"
                  checked={values[key]}
                  onChange={(event) => set(key, event.target.checked)}
                />
                <span className="text-sm font-crimson text-secondary group-hover:text-textMain transition-colors">
=======
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
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
                  {label}
                </span>
              </label>
            ))}
          </div>
<<<<<<< HEAD
        </fieldset>

        <fieldset>
          <legend className="section-label mb-2">Urutkan</legend>
          <div className="space-y-1.5">
            {SORT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="sort"
                  className="w-4 h-4 accent-accent cursor-pointer"
                  checked={values.sort === option.value}
                  onChange={() => set("sort", option.value)}
                />
                <span className="text-sm font-crimson text-secondary group-hover:text-textMain transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <button type="submit" className="btn-primary w-full mt-5">
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        Terapkan Filter
      </button>

    </form>
  );
=======
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
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
}
