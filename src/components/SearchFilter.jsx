import { useState } from "react";
import { GENRES, SORT_OPTIONS } from "../data/books";

export default function SearchFilter({ onFilter }) {
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

  const [values, setValues] = useState(defaults);
  const set = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(values);
  };

  const handleReset = () => {
    setValues(defaults);
    onFilter(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Form pencarian dan filter buku"
      className="bg-white border border-slate-200 rounded-lg shadow-book p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-playfair font-semibold text-ink">
            Cari &amp; Filter
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-crimson">
            Gunakan filter di bawah untuk menemukan buku
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold font-crimson text-slate-400 hover:text-amber-600 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Judul */}
        <div>
          <label htmlFor="search-query" className="section-label block mb-1.5">
            Judul Buku
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              id="search-query"
              type="search"
              placeholder="Cari judul buku..."
              autoComplete="off"
              className="input-field pl-9"
              value={values.q}
              onChange={(e) => set("q", e.target.value)}
            />
          </div>
        </div>

        {/* Year range */}
        <div>
          <label htmlFor="year-range" className="section-label block mb-1.5">
            Tahun Terbit Minimum:{" "}
            <span className="text-amber-600 normal-case">{values.yearMin}</span>{" "}
            {/* ← dinamis */}
          </label>
          <input
            id="year-range"
            type="range"
            min="1800"
            max="2024"
            step="10"
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 accent-amber-500"
            value={values.yearMin}
            onChange={(e) => set("yearMin", +e.target.value)}
          />
          <div className="flex justify-between text-xs text-slate-400 font-crimson mt-1">
            <span>1800</span>
            <span>2024</span>
          </div>
        </div>

        {/* Rating */}
        <div>
          <label htmlFor="min-rating" className="section-label block mb-1.5">
            Rating Minimum
          </label>
          <input
            id="min-rating"
            type="number"
            min="0"
            max="5"
            step="0.5"
            className="input-field"
            value={values.minRating}
            onChange={(e) => set("minRating", +e.target.value)}
          />
        </div>

        {/* Checkboxes */}
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
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                  checked={values[key]}
                  onChange={(e) => set(key, e.target.checked)}
                />
                <span className="text-sm font-crimson text-slate-600 group-hover:text-ink transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Sort */}
        <fieldset>
          <legend className="section-label mb-2">Urutkan</legend>
          <div className="space-y-1.5">
            {SORT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="sort"
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                  checked={values.sort === opt.value}
                  onChange={() => set("sort", opt.value)}
                />
                <span className="text-sm font-crimson text-slate-600 group-hover:text-ink transition-colors">
                  {opt.label}
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
}
