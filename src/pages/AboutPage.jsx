import Icon from "../components/Icon";
import { GENRES } from "../data/books";
import { useLanguage } from "../utils/language";

export default function AboutPage() {
  const { t } = useLanguage();
  const visibleGenres = GENRES.filter((genre) => genre !== "Semua");

  const highlights = [
    {
      icon: "cloud",
      title: t("Terhubung ke Open Library"),
      desc: t("Data buku utama diambil dari Open Library Search API, lalu dirapikan agar cocok dengan tampilan katalog."),
    },
    {
      icon: "collection",
      title: t("Tetap Bisa Dipakai Offline"),
      desc: t("Jika API tidak bisa diakses, AksaraHub menampilkan koleksi contoh agar halaman tetap dapat dibuka dan diuji."),
    },
    {
      icon: "filter",
      title: t("Filter Koleksi"),
      desc: t("Pengguna dapat mencari berdasarkan judul, penulis, genre, tahun, rating, dan status ketersediaan."),
    },
    {
      icon: "eye",
      title: t("Detail Buku"),
      desc: t("Setiap buku bisa dibuka untuk melihat metadata penting seperti penulis, genre, tahun, halaman, dan rating."),
    },
  ];

  const workflow = [
    {
      icon: "home",
      title: t("Lihat rekomendasi"),
      text: t("Beranda menampilkan buku unggulan dan koleksi yang sedang tersedia."),
    },
    {
      icon: "filter",
      title: t("Saring koleksi"),
      text: t("Panel filter membantu mempersempit daftar buku sesuai kebutuhan pembaca."),
    },
    {
      icon: "cloud",
      title: t("Jelajahi katalog API"),
      text: t("Halaman katalog menampilkan daftar buku dari data Open Library yang sudah dimuat aplikasi."),
    },
    {
      icon: "bookmark",
      title: t("Pilih buku"),
      text: t("Kartu buku mengarah ke modal detail untuk melihat informasi sebelum meminjam."),
    },
  ];

  const dataSources = [
    { icon: "database", label: "Open Library Search API" },
    { icon: "collection", label: "Open Library Covers" },
    { icon: "bookOpen", label: t("Fallback books lokal") },
  ];

  return (
    <section
      id="tentang"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-14 scroll-mt-24"
    >
      <div className="mb-10 max-w-3xl">
        <p className="section-label mb-3">{t("Tentang AksaraHub")}</p>
        <h2 className="font-extrabold text-4xl lg:text-5xl text-textMain mb-5 leading-tight">
          {t("Perpustakaan digital untuk mencari, menyaring, dan mengenal koleksi buku dengan cepat.")}
        </h2>
        <p className="text-lg text-secondary leading-relaxed">
          {t("AksaraHub dibuat sebagai aplikasi katalog buku berbasis React yang memadukan data Open Library dengan koleksi cadangan lokal. Fokus utamanya adalah pengalaman mencari buku yang sederhana, responsif, dan tetap berjalan saat koneksi API bermasalah.")}
        </p>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { icon: "collection", value: "30", label: t("Buku per pencarian") },
          { icon: "tag", value: visibleGenres.length, label: t("Genre filter") },
          { icon: "cloud", value: "API", label: t("Sumber online") },
          { icon: "monitor", value: "Mobile", label: t("Responsif") },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white border border-borderSoft rounded-lg p-5 shadow-book"
          >
            <Icon name={item.icon} className="w-5 h-5 text-accentHover mb-3" />
            <p className="text-2xl font-extrabold text-textMain">
              {item.value}
            </p>
            <p className="text-sm text-textSecondary mt-1">{item.label}</p>
          </div>
        ))}
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

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-5">
        <div className="bg-white border border-borderSoft rounded-lg p-6 shadow-book">
          <p className="section-label mb-3">{t("Alur Penggunaan")}</p>
          <h2 className="font-semibold text-2xl text-textMain mb-5">
            {t("Cara memakai AksaraHub")}
          </h2>
          <div className="space-y-4">
            {workflow.map((step, index) => (
              <div key={step.title} className="flex gap-3">
                <span className="mt-0.5 w-9 h-9 rounded-lg bg-cream text-accentHover flex items-center justify-center flex-shrink-0">
                  <Icon name={step.icon} className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-semibold text-textMain">
                    {index + 1}. {step.title}
                  </p>
                  <p className="text-sm text-secondary leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-borderSoft rounded-lg p-6 shadow-book">
          <p className="section-label mb-3">{t("Genre & Data")}</p>
          <h2 className="font-semibold text-2xl text-textMain mb-4">
            {t("Kategori buku yang tersedia")}
          </h2>
          <p className="text-secondary leading-relaxed mb-5">
            {t("Genre disesuaikan dengan topik yang umum muncul di Open Library dan koleksi contoh aplikasi, sehingga filter lebih mudah dipahami.")}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {visibleGenres.map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-borderSoft bg-cream px-3 py-1.5 text-sm font-semibold text-accentHover"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {dataSources.map((source) => (
              <span
                key={source.label}
                className="inline-flex items-center gap-2 rounded-full border border-borderSoft bg-white px-3 py-1.5 text-sm font-semibold text-secondary"
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
