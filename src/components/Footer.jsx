<<<<<<< HEAD
import Icon from "./Icon";
import { GENRES } from "../data/books";
import aksaraHubLogo from "../assets/AksaraHub Logo.png";

export default function Footer({ onToast, activePage = "home" }) {
  const navItems = [
    { label: "Beranda", href: "#/", page: "home", icon: "home" },
    { label: "Koleksi Buku", href: "#/koleksi", page: "home", icon: "collection" },
    { label: "Katalog API", href: "#/katalog", page: "katalog", icon: "cloud" },
    { label: "Favorit", href: "#/favorit", page: "favorit", icon: "heart" },
    { label: "Tentang", href: "#/tentang", page: "tentang", icon: "info" },
  ];

  const genreIcons = {
    Fiction: "bookOpen",
    Fantasy: "star",
    Adventure: "compass",
    Mystery: "eye",
    Romance: "heart",
    Science: "flask",
    Chemistry: "flask",
    Physics: "flask",
    Mathematics: "info",
    "Science Fiction": "flask",
    History: "globe",
    Biography: "users",
    Religion: "scroll",
    Art: "pen",
    Business: "collection",
    Philosophy: "scroll",
    Poetry: "pen",
  };

  const genres = GENRES.filter((item) => item !== "Semua").slice(0, 6);

  return (
    <footer className="border-t border-borderSoft bg-primary text-white/70 font-crimson">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 overflow-hidden rounded-lg bg-white flex items-center justify-center">
                <img
                  src={aksaraHubLogo}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full scale-[1.55] object-cover"
                />
              </div>
              <span className="font-playfair font-bold text-lg text-white">
                AksaraHub
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Platform perpustakaan digital untuk menemukan buku lokal dan
              katalog klasik dari API.
            </p>
          </div>

          <nav aria-label="Navigasi footer">
            <h4 className="font-playfair font-semibold text-white mb-4 text-sm">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={activePage === item.page ? "page" : undefined}
                    className={`inline-flex items-center gap-2 transition-colors duration-200 hover:text-accent ${
                      activePage === item.page ? "text-accent" : ""
                    }`}
                  >
=======
import Icon from './Icon'

export default function Footer() {
  const navItems = [
    { label: 'Beranda', icon: 'home' },
    { label: 'Koleksi Buku', icon: 'collection' },
    { label: 'Katalog API', icon: 'cloud' },
    { label: 'Tentang', icon: 'info' },
  ]

  const genres = [
    { label: 'Fiction', icon: 'bookOpen' },
    { label: 'Fantasy', icon: 'star' },
    { label: 'Sci-Fi', icon: 'flask' },
    { label: 'Distopia', icon: 'globe' },
    { label: 'Romance', icon: 'heart' },
    { label: 'Filsafat', icon: 'info' },
  ]

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-ink-800 rounded-lg flex items-center justify-center">
                <Icon name="bookOpen" className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <span className="font-bold text-lg text-ink">Folio</span>
            </div>
            <p className="text-sm leading-relaxed">
              Platform perpustakaan digital untuk menemukan buku lokal dan katalog klasik dari API.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-4 text-sm">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              {navItems.map(item => (
                <li key={item.label}>
                  <a href="#" className="inline-flex items-center gap-2 hover:text-amber-600 transition-colors duration-200">
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
                    <Icon name={item.icon} className="w-3.5 h-3.5" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
<<<<<<< HEAD
          </nav>

          <div>
            <h4 className="font-playfair font-semibold text-white mb-4 text-sm">
              Genre Populer
            </h4>
            <ul className="space-y-2 text-sm">
              {genres.map((item) => (
                <li key={item}>
                  <a
                    href="#/koleksi"
                    className="inline-flex items-center gap-2
                               hover:text-accent transition-colors duration-200"
                  >
                    <Icon
                      name={genreIcons[item] || "tag"}
                      className="w-3.5 h-3.5"
                    />
                    {item}
=======
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-4 text-sm">Genre Populer</h4>
            <ul className="space-y-2 text-sm">
              {genres.map(item => (
                <li key={item.label}>
                  <a href="#" className="inline-flex items-center gap-2 hover:text-amber-600 transition-colors duration-200">
                    <Icon name={item.icon} className="w-3.5 h-3.5" />
                    {item.label}
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
<<<<<<< HEAD
            <h4 className="font-playfair font-semibold text-white mb-4 text-sm">
              Newsletter
            </h4>
            <p className="text-sm mb-4 leading-relaxed">
              Dapatkan rekomendasi buku terbaru langsung di email kamu.
            </p>

            <form
              action="#"
              method="post"
              aria-label="Form berlangganan newsletter"
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                event.currentTarget.reset();
                onToast?.(
                  "Newsletter tersimpan",
                  "Rekomendasi buku akan dikirim ke email kamu.",
                  "success",
                );
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Alamat email
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                placeholder="Email kamu..."
                autoComplete="email"
                required
                className="flex-1 bg-secondary border border-borderSoft/30 text-white text-sm
                           px-3 py-2 rounded-lg outline-none
                           focus:border-accent focus:ring-2 focus:ring-accent/30
                           placeholder:text-white/40 transition-colors duration-200"
              />
              <button
                type="submit"
                aria-label="Daftar newsletter"
                className="bg-accent hover:bg-accentHover text-white
                           px-3 py-2 rounded-lg transition-colors duration-200"
              >
                <Icon name="pen" className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div
          className="border-t border-white/10 pt-6
                     flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="text-xs text-white/40">
            &copy; 2026 AksaraHub. Dibuat untuk para pembaca.
          </p>
          <div className="flex gap-6 text-xs">
            {["Privasi", "Syarat", "Kontak"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/40 hover:text-accent transition-colors duration-200"
              >
=======
            <h4 className="font-semibold text-ink mb-4 text-sm">Newsletter</h4>
            <p className="text-sm mb-4 leading-relaxed">
              Dapatkan rekomendasi buku terbaru langsung di email kamu.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email kamu..."
                className="flex-1 bg-white border border-slate-200 text-ink text-sm px-3 py-2 rounded-lg outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 placeholder:text-slate-400 transition-colors duration-200"
              />
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm">
                <Icon name="pen" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            Copyright 2024 Folio Book Library. Dibuat untuk para pembaca.
          </p>
          <div className="flex gap-6 text-xs">
            {['Privasi', 'Syarat', 'Kontak'].map(item => (
              <a key={item} href="#" className="text-slate-400 hover:text-amber-600 transition-colors duration-200">
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
}
