<<<<<<< HEAD
import { useState } from "react";
import Icon from "./Icon";
import LogoutConfirmModal from "./LogoutConfirmModal";
import UserAvatar from "./UserAvatar";
import aksaraHubLogo from "../assets/AksaraHub Logo.png";

export default function Header({
  favoriteCount = 0,
  isDarkMode = false,
  onToggleTheme,
  activePage = "home",
  currentUser,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const navLinks = [
    { href: "#/", page: "home", label: "Beranda", icon: "home" },
    { href: "#/katalog", page: "katalog", label: "Katalog API", icon: "cloud" },
    { href: "#/favorit", page: "favorit", label: "Favorit", icon: "heart" },
    { href: "#/tentang", page: "tentang", label: "Tentang", icon: "info" },
  ];

  const handleNavClick = () => {
    setMenuOpen(false);
    setAccountMenuOpen(false);
  };
  const openLogoutModal = () => {
    setAccountMenuOpen(false);
    setLogoutModalOpen(true);
  };
  const closeLogoutModal = () => setLogoutModalOpen(false);
  const confirmLogout = () => {
    onLogout?.();
    closeLogoutModal();
    handleNavClick();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-accent/30 bg-primary/95 backdrop-blur-sm shadow-book">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <a href="#/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 overflow-hidden rounded-lg bg-white flex items-center justify-center shadow-book ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105">
              <img
                src={aksaraHubLogo}
                alt=""
                aria-hidden="true"
                className="h-full w-full scale-[1.55] object-cover"
              />
            </div>
            <div>
              <span className="font-playfair font-extrabold text-xl tracking-tight text-white">
                AksaraHub
              </span>
              <span className="hidden sm:block text-[10px] tracking-[0.16em] uppercase text-white/55 -mt-0.5">
                Digital Library
              </span>
            </div>
          </a>

          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-1 bg-white/10 rounded-lg p-1"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={activePage === link.page ? "page" : undefined}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold font-crimson rounded-md text-white/75 hover:bg-white hover:text-primary hover:shadow-sm transition-all duration-200 ${
                  activePage === link.page
                    ? "nav-link-active bg-white text-primary shadow-sm"
                    : ""
                }`}
              >
                <Icon name={link.icon} className="w-4 h-4" />
                {link.label}
                {link.page === "favorit" && (
                  <span
                    className="ml-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white"
                    aria-label={`${favoriteCount} buku favorit`}
                  >
                    {favoriteCount}
                  </span>
                )}
              </a>
=======
import { useState } from 'react'
import Icon from './Icon'

export default function Header({ activePage, setActivePage }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { id: 'home', label: 'Beranda', icon: 'home' },
    { id: 'library', label: 'Katalog API', icon: 'cloud' },
    { id: 'about', label: 'Tentang', icon: 'info' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <button
            onClick={() => { setActivePage('home'); setMenuOpen(false) }}
            className="flex items-center gap-3 rounded-lg text-left"
          >
            <div className="w-10 h-10 bg-ink-800 rounded-lg flex items-center justify-center text-white shadow-book">
              <Icon name="bookOpen" className="w-5 h-5" />
            </div>
            <div>
              <span className="font-playfair font-extrabold text-xl tracking-tight text-ink">Folio</span>
              <span className="hidden sm:block text-[10px] tracking-[0.16em] uppercase text-slate-400 -mt-0.5">
                Book Library
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200
                  ${activePage === link.id
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-slate-500 hover:text-ink'
                  }`}
              >
                <Icon name={link.icon} className="w-4 h-4" />
                {link.label}
              </button>
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
<<<<<<< HEAD
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white/80 shadow-sm transition-all duration-200 hover:border-accent hover:bg-white hover:text-primary"
              aria-label={
                isDarkMode ? "Aktifkan light mode" : "Aktifkan dark mode"
              }
              aria-pressed={isDarkMode}
              onClick={onToggleTheme}
            >
              <Icon
                name={isDarkMode ? "sun" : "moon"}
                className="h-4 w-4"
                strokeWidth={2}
              />
            </button>

            {currentUser ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/80 shadow-sm transition-all duration-200 hover:border-accent hover:bg-white hover:text-primary"
                  aria-expanded={accountMenuOpen}
                  aria-controls="account-menu"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                >
                  <UserAvatar user={currentUser} size="sm" />
                  <span className="max-w-24 truncate">{currentUser.name}</span>
                </button>

                {accountMenuOpen && (
                  <div
                    id="account-menu"
                    className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-borderSoft bg-white p-2 text-textMain shadow-book"
                  >
                    <div className="border-b border-borderSoft px-3 py-2">
                      <p className="truncate text-sm font-bold">
                        {currentUser.name}
                      </p>
                      <p className="truncate text-xs text-textSecondary">
                        {currentUser.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-logout mt-2 w-full px-3 py-2 text-sm"
                      onClick={openLogoutModal}
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="#/login"
                className="hidden sm:flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/80 shadow-sm transition-all duration-200 hover:border-accent hover:bg-white hover:text-primary"
              >
                <Icon name="users" className="h-3.5 w-3.5" />
                Masuk
              </a>
            )}

            <button
              type="button"
              aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 bg-white rounded transition-all duration-300 ${
                    menuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white rounded transition-all duration-300 ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white rounded transition-all duration-300 ${
                    menuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
=======
              onClick={() => setActivePage('library')}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-white
                         px-3 py-2 text-sm font-semibold text-slate-600
                         hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200"
            >
              <Icon name="search" className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Cari Buku</span>
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-ink hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span className={`block h-0.5 bg-ink transition-all duration-300
                  ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 bg-ink transition-all duration-300
                  ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-ink transition-all duration-300
                  ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
              </div>
            </button>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <nav
        id="mobile-nav"
        aria-label="Navigasi mobile"
        className={`md:hidden border-t border-white/10 bg-primary transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-5 gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              aria-current={activePage === link.page ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2 text-xs font-semibold font-crimson text-white/70 rounded-lg hover:bg-white/10 hover:text-accent transition-colors duration-200 ${
                activePage === link.page ? "bg-white/10 text-accent" : ""
              }`}
            >
              <Icon name={link.icon} className="w-4 h-4" />
              <span className="inline-flex items-center gap-1">
                {link.label}
                {link.page === "favorit" && (
                  <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                    {favoriteCount}
                  </span>
                )}
              </span>
            </a>
          ))}

          {currentUser ? (
            <button
              type="button"
              aria-expanded={accountMenuOpen}
              aria-controls="mobile-account-menu"
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              className="flex flex-col items-center gap-1 py-2 text-xs font-semibold font-crimson text-white/70 rounded-lg hover:bg-white/10 hover:text-accent transition-colors duration-200"
            >
              <UserAvatar user={currentUser} size="xs" />
              <span>Akun</span>
            </button>
          ) : (
            <a
              href="#/login"
              onClick={handleNavClick}
              aria-current={activePage === "login" ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2 text-xs font-semibold font-crimson text-white/70 rounded-lg hover:bg-white/10 hover:text-accent transition-colors duration-200 ${
                activePage === "login" ? "bg-white/10 text-accent" : ""
              }`}
            >
              <Icon name="users" className="w-4 h-4" />
              <span>Masuk</span>
            </a>
          )}
        </div>
        {currentUser && accountMenuOpen && (
          <div
            id="mobile-account-menu"
            className="mx-4 mb-3 rounded-lg border border-white/10 bg-white/10 p-2"
          >
            <div className="px-3 py-2 text-white/80">
              <p className="truncate text-sm font-bold">{currentUser.name}</p>
              <p className="truncate text-xs text-white/55">
                {currentUser.email}
              </p>
            </div>
            <button
              type="button"
              className="btn-logout mt-1 w-full px-3 py-2 text-sm"
              onClick={openLogoutModal}
            >
              Keluar
            </button>
          </div>
        )}
      </nav>
      <LogoutConfirmModal
        open={logoutModalOpen}
        userName={currentUser?.name}
        onClose={closeLogoutModal}
        onConfirm={confirmLogout}
      />
    </header>
  );
=======
      {menuOpen && (
        <nav className="md:hidden border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => { setActivePage(link.id); setMenuOpen(false) }}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-lg transition-colors flex items-center gap-3
                  ${activePage === link.id
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-slate-600 hover:text-ink hover:bg-slate-100'
                  }`}
              >
                <Icon name={link.icon} className="w-4 h-4" />
                {link.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
}
