import Icon from "../components/Icon";

export default function AboutPage() {
  const highlights = [
    {
      icon: "bookmark",
      title: "Koleksi Terpilih",
      desc: "Daftar buku lokal berisi judul populer, rating, status ketersediaan, genre, dan ringkasan singkat.",
    },
    {
      icon: "cloud",
      title: "Katalog Online",
      desc: "Halaman Katalog API mengambil data buku klasik dari Gutendex dan Project Gutenberg secara langsung.",
    },
    {
      icon: "filter",
      title: "Pencarian Cepat",
      desc: "Cari buku berdasarkan judul atau penulis, lalu persempit hasil dengan genre, rating, tahun, dan status.",
    },
    {
      icon: "info",
      title: "Detail Buku",
      desc: "Setiap kartu buku dapat dibuka untuk melihat informasi lengkap, sinopsis, metadata, dan aksi peminjaman.",
    },
  ];

  const steps = [
    {
      icon: "home",
      text: "Mulai dari Beranda untuk melihat rekomendasi dan koleksi utama.",
    },
    {
      icon: "filter",
      text: "Gunakan filter untuk menemukan buku berdasarkan kebutuhan bacaan.",
    },
    {
      icon: "cloud",
      text: "Buka Katalog API untuk menjelajahi koleksi klasik dari sumber online.",
    },
    {
      icon: "eye",
      text: "Klik kartu buku untuk membaca detail sebelum menyimpan atau meminjam.",
    },
  ];

  const dataSources = [
    { icon: "database", label: "Koleksi lokal dari data aplikasi" },
    { icon: "cloud", label: "Gutendex API" },
    { icon: "bookOpen", label: "Project Gutenberg" },
    { icon: "collection", label: "Open Library Covers" },
  ];

  return (
    <section
      id="tentang"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-14 scroll-mt-24"
    >
      <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center mb-12">
        <div>
          <p className="section-label mb-3">Tentang Folio</p>
          <h1 className="font-extrabold text-4xl lg:text-5xl text-textMain mb-5 leading-tight">
            Perpustakaan digital yang sederhana untuk menemukan bacaan
            berikutnya.
          </h1>
          <p className="text-lg text-secondary leading-relaxed max-w-2xl">
            Folio Book Library membantu pengguna menelusuri koleksi buku dengan
            tampilan bersih, filter yang mudah dipakai, dan akses ke katalog
            klasik online. Aplikasi ini dirancang agar proses mencari, membaca
            ringkasan, dan memilih buku terasa cepat tanpa banyak gangguan.
          </p>
        </div>

        <div className="bg-white border border-borderSoft rounded-lg shadow-book p-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "collection", value: "12+", label: "Buku lokal" },
              { icon: "tag", value: "8", label: "Genre" },
              { icon: "cloud", value: "API", label: "Katalog online" },
              { icon: "monitor", value: "Mobile", label: "Responsif" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg bg-cream border border-borderSoft p-4"
              >
                <Icon
                  name={item.icon}
                  className="w-5 h-5 text-accentHover mb-3"
                />
                <p className="text-2xl font-extrabold text-textMain">{item.value}</p>
                <p className="text-sm text-textSecondary mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="bg-white border border-borderSoft rounded-lg p-5 shadow-book hover:border-accent transition-colors duration-200"
          >
            <span className="w-9 h-9 rounded-lg bg-cream text-accentHover flex items-center justify-center mb-4">
              <Icon name={item.icon} className="w-4 h-4" />
            </span>
            <h2 className="font-semibold text-lg text-textMain mb-2">
              {item.title}
            </h2>
            <p className="text-sm text-textSecondary leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-borderSoft rounded-lg p-6 shadow-book">
          <p className="section-label mb-3">Alur Penggunaan</p>
          <h2 className="font-semibold text-2xl text-textMain mb-5">
            Cara memakai Folio
          </h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.text} className="flex gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-full bg-cream text-accentHover flex items-center justify-center flex-shrink-0">
                  <Icon name={step.icon} className="w-4 h-4" />
                </span>
                <p className="text-secondary leading-relaxed">
                  <span className="font-semibold text-textMain mr-1">
                    {index + 1}.
                  </span>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-borderSoft rounded-lg p-6 shadow-book">
          <p className="section-label mb-3">Sumber Data</p>
          <h2 className="font-semibold text-2xl text-textMain mb-5">
            Dari koleksi lokal dan katalog terbuka
          </h2>
          <p className="text-secondary leading-relaxed mb-5">
            Folio menggabungkan data buku yang disiapkan di dalam aplikasi
            dengan katalog publik agar pengguna bisa melihat contoh koleksi
            terkurasi sekaligus menjelajahi buku klasik.
          </p>
          <div className="flex flex-wrap gap-2">
            {dataSources.map((source) => (
              <span
                key={source.label}
                className="inline-flex items-center gap-2 rounded-full border border-borderSoft bg-cream px-3 py-1.5 text-sm font-semibold text-accentHover"
              >
                <Icon name={source.icon} className="w-3.5 h-3.5" />
                {source.label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
