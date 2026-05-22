import Icon from "../components/Icon";

export default function AboutPage() {
  const features = [
    {
      icon: "search",
      title: "Pencarian Canggih",
      desc: "Filter buku berdasarkan judul, penulis, genre, rating, dan tahun terbit menggunakan berbagai input type.",
    },
    {
      icon: "cloud",
      title: "Integrasi API",
      desc: "Data real-time dari Gutendex API (Project Gutenberg) dengan ribuan judul buku klasik.",
    },
    {
      icon: "monitor",
      title: "React Hooks",
      desc: "Akan diimplementasikan: useState, useEffect, dan Conditional Rendering di fase berikutnya.",
    },
    {
      icon: "globe",
      title: "Responsif",
      desc: "Tampilan optimal di semua perangkat — dari mobile hingga desktop menggunakan Tailwind CSS.",
    },
  ];

  const phases = [
    {
      no: "01",
      label: "Selesai",
      title: "Semantic HTML",
      desc: "header, main, footer, nav, section, article, aside, figure, form + input types",
      done: true,
    },
    {
      no: "02",
      label: "Selesai",
      title: "Tailwind CSS",
      desc: "Grid, Flexbox, hover, transition, shadow, responsive breakpoints",
      done: true,
    },
    {
      no: "03",
      label: "Selanjutnya",
      title: "React Hooks",
      desc: "useState, useEffect, Conditional Rendering",
      done: false,
    },
    {
      no: "04",
      label: "Selanjutnya",
      title: "Data & Axios",
      desc: "Fetch dari Gutendex API, loading indicator, error handling",
      done: false,
    },
  ];

  const techStack = [
    { name: "React 18", color: "bg-blue-100 text-blue-800" },
    { name: "Vite", color: "bg-violet-100 text-violet-800" },
    { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-800" },
    { name: "Semantic HTML5", color: "bg-orange-100 text-orange-800" },
    { name: "Google Fonts", color: "bg-rose-100 text-rose-800" },
  ];

  return (
    <section
      id="tentang"
      aria-labelledby="about-heading"
      className="max-w-4xl mx-auto px-4 sm:px-6 py-16"
    >
      <header className="text-center mb-14">
        <p className="section-label mb-3">Tentang Aplikasi</p>
        <h1
          id="about-heading"
          className="font-playfair font-extrabold text-4xl text-ink mb-4"
        >
          Folio Book Library
        </h1>
        <div
          className="w-12 h-0.5 bg-amber-500 mx-auto my-4"
          aria-hidden="true"
        />
        <p className="font-crimson text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          Aplikasi perpustakaan digital yang dibangun bertahap sesuai komponen
          penilaian — dimulai dari Semantic HTML dan Tailwind CSS.
        </p>
      </header>

      <section aria-labelledby="phase-heading" className="mb-14">
        <p className="section-label mb-1">Roadmap</p>
        <h2
          id="phase-heading"
          className="font-playfair font-bold text-2xl text-ink mb-6"
        >
          Fase Pembangunan
        </h2>

        <ol className="relative border-l-2 border-parchment-200 ml-4 space-y-6">
          {phases.map((phase) => (
            <li key={phase.no} className="ml-8">
              <span
                className={`absolute -left-4 w-8 h-8 rounded-full flex items-center
                             justify-center text-xs font-bold font-playfair
                             ring-4 ring-parchment-50
                  ${
                    phase.done
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                aria-hidden="true"
              >
                {phase.no}
              </span>

              <article
                className={`p-4 rounded-lg border
                ${
                  phase.done
                    ? "bg-white border-amber-200 shadow-book"
                    : "bg-parchment-50 border-dashed border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-semibold font-crimson tracking-wide
                                px-2 py-0.5 rounded-full
                      ${
                        phase.done
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    {phase.label}
                  </span>
                  <h3 className="font-playfair font-semibold text-base text-ink">
                    {phase.title}
                  </h3>
                </div>
                <p className="font-crimson text-sm text-slate-500 leading-relaxed">
                  {phase.desc}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="features-heading" className="mb-14">
        <p className="section-label mb-1">Fitur</p>
        <h2
          id="features-heading"
          className="font-playfair font-bold text-2xl text-ink mb-6"
        >
          Apa yang Ada di Aplikasi Ini
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f) => (
            <article
              key={f.title}
              className="bg-white border border-slate-200 rounded-lg p-6 shadow-book
                         hover:shadow-book-hover hover:-translate-y-1
                         transition-all duration-300"
            >
              <span
                className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600
                               flex items-center justify-center mb-4"
              >
                <Icon name={f.icon} className="w-5 h-5" />
              </span>
              <h3 className="font-playfair font-semibold text-lg text-ink mb-2">
                {f.title}
              </h3>
              <p className="font-crimson text-slate-500 leading-relaxed text-sm">
                {f.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="tech-heading"
        className="bg-parchment-100 border border-parchment-200 rounded-lg p-8 mb-10"
      >
        <p className="section-label mb-1">Teknologi</p>
        <h2
          id="tech-heading"
          className="font-playfair font-bold text-xl text-ink mb-5"
        >
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech.name}
              className={`font-crimson font-semibold text-sm
                          px-3 py-1.5 rounded-full ${tech.color}`}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </section>
    </section>
  );
}
