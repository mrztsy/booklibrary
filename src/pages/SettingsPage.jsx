import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import UserAvatar from "../components/UserAvatar";
import { GENRES, SORT_OPTIONS } from "../data/books";
import { getRoleLabel } from "../utils/accountRoles";
import { useLanguage } from "../utils/language";
import {
  DEFAULT_CATALOG_PREFERENCES,
  normalizeCatalogPreferences,
} from "../utils/preferences";

const LANGUAGE_OPTIONS = ["Indonesia", "English"];
const FAVORITE_GENRE_OPTIONS = GENRES.filter((genre) => genre !== "Semua").slice(0, 12);
const CATALOG_PAGE_SIZE_OPTIONS = [8, 10, 12, 16];
const MAX_FAVORITE_GENRES = 4;

function SettingsConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
}) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/70 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-confirm-modal-title"
        className="w-full max-w-md rounded-lg border border-borderSoft bg-white p-6 text-textMain shadow-book"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-label mb-1">{t("Konfirmasi")}</p>
            <h2
              id="settings-confirm-modal-title"
              className="font-playfair text-xl font-bold text-textMain"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-borderSoft text-textSecondary transition-colors hover:border-accent hover:text-accentHover"
            aria-label={t("Tutup modal")}
            onClick={onClose}
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-textSecondary">
          {description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" className="btn-secondary" onClick={onClose}>
            {t("Batal")}
          </button>
          <button
            type="button"
            className="btn-logout-solid px-5 py-2.5"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function SettingsPage({
  currentUser,
  isDarkMode = false,
  catalogPreferences = DEFAULT_CATALOG_PREFERENCES,
  favoriteCount = 0,
  onLogin,
  onSetTheme,
  onSaveCatalogPreferences,
  onClearFavorites,
  onResetSettings,
  onChangePassword,
  onToast,
}) {
  const { t } = useLanguage();
  const [preferredGenres, setPreferredGenres] = useState(
    currentUser?.preferredGenres?.length > 0
      ? currentUser.preferredGenres
      : ["Fiction", "Science"],
  );
  const [catalogDraft, setCatalogDraft] = useState(
    normalizeCatalogPreferences(catalogPreferences),
  );
  const [confirmAction, setConfirmAction] = useState(null);
  const [passwordDraft, setPasswordDraft] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setPreferredGenres(
      currentUser?.preferredGenres?.length > 0
        ? currentUser.preferredGenres
        : ["Fiction", "Science"],
    );
  }, [currentUser?.preferredGenres]);

  useEffect(() => {
    setCatalogDraft(normalizeCatalogPreferences(catalogPreferences));
  }, [catalogPreferences]);

  useEffect(() => {
    setPasswordDraft({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [currentUser?.password]);

  const updateUserPreferences = (patch) => {
    onLogin?.({
      ...currentUser,
      ...patch,
    });
  };

  const handleLanguageChange = (event) => {
    updateUserPreferences({ language: event.target.value });
    onToast?.(
      t("Bahasa diperbarui"),
      t("Pilihan bahasa sudah disimpan."),
      "success",
    );
  };

  const handleToastPreferenceChange = (enabled) => {
    updateUserPreferences({ toastNotifications: enabled });
    onToast?.(
      t("Notifikasi toast diperbarui"),
      enabled
        ? t("Notifikasi singkat akan tetap ditampilkan.")
        : t("Notifikasi singkat disembunyikan dari aplikasi."),
      "info",
      { force: true },
    );
  };

  const toggleGenre = (genre) => {
    setPreferredGenres((currentGenres) => {
      if (currentGenres.includes(genre)) {
        return currentGenres.filter((item) => item !== genre);
      }

      if (currentGenres.length >= MAX_FAVORITE_GENRES) {
        onToast?.(
          t("Batas genre tercapai"),
          t("Pilih maksimal 4 genre favorit."),
          "info",
        );
        return currentGenres;
      }

      return [...currentGenres, genre];
    });
  };

  const saveGenres = () => {
    updateUserPreferences({ preferredGenres });
    onToast?.(
      t("Genre favorit tersimpan"),
      t("Rekomendasi dapat memakai pilihan genre ini."),
      "success",
    );
  };

  const updateCatalogDraft = (key, value) => {
    setCatalogDraft((currentDraft) =>
      normalizeCatalogPreferences({ ...currentDraft, [key]: value }),
    );
  };

  const saveCatalogPreferences = () => {
    onSaveCatalogPreferences?.(catalogDraft);
  };

  const handlePasswordDraftChange = (key, value) => {
    setPasswordDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  };

  const savePassword = (event) => {
    event.preventDefault();
    const currentPassword = passwordDraft.currentPassword.trim();
    const newPassword = passwordDraft.newPassword.trim();
    const confirmPassword = passwordDraft.confirmPassword.trim();

    if (!newPassword) {
      onToast?.(
        t("Password belum diubah"),
        t("Isi password baru dulu, ya."),
        "error",
        { force: true },
      );
      return;
    }

    if (newPassword.length < 6) {
      onToast?.(
        t("Password belum diubah"),
        t("Password baru minimal 6 karakter."),
        "error",
        { force: true },
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      onToast?.(
        t("Password belum diubah"),
        t("Password baru dan konfirmasi password harus sama."),
        "error",
        { force: true },
      );
      return;
    }

    const result = onChangePassword?.({
      currentPassword,
      newPassword,
    });

    if (!result?.ok) {
      onToast?.(
        t("Password belum diubah"),
        result?.message || t("Password saat ini belum cocok."),
        "error",
        { force: true },
      );
      return;
    }

    setPasswordDraft({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    onToast?.(
      t("Password berhasil diperbarui"),
      t("Password akun lokal kamu sudah diganti."),
      "success",
      { force: true },
    );
  };

  const openConfirmAction = (type) => {
    setConfirmAction(type);
  };

  const closeConfirmAction = () => {
    setConfirmAction(null);
  };

  const confirmDangerAction = () => {
    if (confirmAction === "favorites") {
      onClearFavorites?.();
    }

    if (confirmAction === "settings") {
      onResetSettings?.();
      setPreferredGenres(["Fiction", "Science"]);
      setCatalogDraft(normalizeCatalogPreferences(DEFAULT_CATALOG_PREFERENCES));
    }

    setConfirmAction(null);
  };

  const profileRows = [
    { label: t("Nama Tampilan"), value: currentUser?.name || "-" },
    { label: "Email", value: currentUser?.email || "-" },
    {
      label: t("Peran Akun"),
      value: getRoleLabel(currentUser?.role),
    },
  ];

  return (
    <section className="mx-auto min-h-[70vh] max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="section-label mb-2">{t("Setting")}</p>
          <h1 className="font-playfair text-3xl font-bold text-textMain sm:text-4xl">
            {t("Pengaturan Akun")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-textSecondary sm:text-base">
            {t("Kelola preferensi akun dan katalog")}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="flex flex-col gap-6">
          <section className="rounded-lg border border-borderSoft bg-white p-6 shadow-book sm:p-7">
            <div className="mb-6 flex items-center gap-4">
              <UserAvatar user={currentUser} size="lg" className="h-20 w-20 text-xl" />
              <div className="min-w-0">
                <p className="section-label mb-1">{t("Profil Akun")}</p>
                <h2 className="truncate font-playfair text-2xl font-bold text-textMain">
                  {currentUser?.name}
                </h2>
                <p className="mt-1 truncate text-sm text-textSecondary">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {profileRows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-lg border border-borderSoft bg-cream px-4 py-4"
                >
                  <p className="section-label mb-1.5">{row.label}</p>
                  <p className="break-words font-semibold text-textMain">{row.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap">
              <a href="#/profile" className="btn-secondary">
                <Icon name="users" className="h-4 w-4" />
                {t("Buka halaman profil")}
              </a>
            </div>
          </section>

          <section className="rounded-lg border border-borderSoft bg-white p-6 shadow-book sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="section-label mb-1">{t("Keamanan Akun")}</p>
                <h2 className="font-playfair text-2xl font-bold text-textMain">
                  {t("Ganti password")}
                </h2>
              </div>
              <Icon name="monitor" className="h-5 w-5 text-accentHover" />
            </div>

            <form onSubmit={savePassword} noValidate className="space-y-5">
              {currentUser?.password ? (
                <div>
                  <label
                    htmlFor="settings-current-password"
                    className="section-label mb-1.5 block"
                  >
                    {t("Password saat ini")}
                  </label>
                  <input
                    id="settings-current-password"
                    type="password"
                    autoComplete="current-password"
                    className="input-field"
                    placeholder={t("Masukkan password saat ini")}
                    value={passwordDraft.currentPassword}
                    onChange={(event) =>
                      handlePasswordDraftChange("currentPassword", event.target.value)
                    }
                  />
                </div>
              ) : (
                <div className="rounded-lg border border-borderSoft bg-cream px-4 py-4 text-sm leading-relaxed text-textSecondary">
                  {t("Password belum diatur. Buat password baru untuk akun ini.")}
                </div>
              )}

              <div>
                <label
                  htmlFor="settings-new-password"
                  className="section-label mb-1.5 block"
                >
                  {t("Password baru")}
                </label>
                <input
                  id="settings-new-password"
                  type="password"
                  autoComplete="new-password"
                  className="input-field"
                  placeholder={t("Masukkan password baru")}
                  value={passwordDraft.newPassword}
                  onChange={(event) =>
                    handlePasswordDraftChange("newPassword", event.target.value)
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="settings-confirm-password"
                  className="section-label mb-1.5 block"
                >
                  {t("Konfirmasi password baru")}
                </label>
                <input
                  id="settings-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  className="input-field"
                  placeholder={t("Ulangi password baru")}
                  value={passwordDraft.confirmPassword}
                  onChange={(event) =>
                    handlePasswordDraftChange("confirmPassword", event.target.value)
                  }
                />
              </div>

              <button type="submit" className="btn-primary">
                <Icon name="check" className="h-4 w-4" />
                {t("Simpan password")}
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-borderSoft bg-white p-6 shadow-book sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="section-label mb-1">{t("Preferensi Bacaan")}</p>
              <h2 className="font-playfair text-2xl font-bold text-textMain">
                {preferredGenres.length} / {MAX_FAVORITE_GENRES} {t("Genre")}
              </h2>
            </div>
            <Icon name="tag" className="h-5 w-5 text-accentHover" />
          </div>

          <p className="mb-4 text-sm leading-relaxed text-textSecondary">
            {t("Pilih maksimal 4 genre favorit.")}
          </p>

          <fieldset>
            <legend className="sr-only">{t("Genre Favorit")}</legend>
            <div className="flex flex-wrap gap-2.5">
              {FAVORITE_GENRE_OPTIONS.map((genre) => {
                const isSelected = preferredGenres.includes(genre);
                const limitReached = preferredGenres.length >= MAX_FAVORITE_GENRES;
                const isDisabled = !isSelected && limitReached;

                return (
                  <label
                    key={genre}
                    className={isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
                  >
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => toggleGenre(genre)}
                    />
                    <span
                      className={`inline-flex min-h-10 items-center rounded-lg border px-3 py-2 text-sm font-semibold transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : isDisabled
                            ? "border-borderSoft bg-cream text-textSecondary/60"
                            : "border-borderSoft bg-white text-textSecondary"
                      }`}
                    >
                      {t(genre)}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

            <button type="button" className="btn-primary mt-6" onClick={saveGenres}>
              <Icon name="check" className="h-4 w-4" />
              {t("Simpan Genre")}
            </button>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-lg border border-borderSoft bg-white p-6 shadow-book sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="section-label mb-1">{t("Preferensi Aplikasi")}</p>
                <h2 className="font-playfair text-2xl font-bold text-textMain">
                  {t("Bahasa")} / {t("Tema")}
                </h2>
              </div>
              <Icon name="monitor" className="h-5 w-5 text-accentHover" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="settings-language" className="section-label mb-1.5 block">
                  {t("Bahasa")}
                </label>
                <select
                  id="settings-language"
                  className="select-field"
                  value={currentUser?.language || "Indonesia"}
                  onChange={handleLanguageChange}
                >
                  {LANGUAGE_OPTIONS.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="section-label mb-1.5">{t("Tema")}</p>
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-borderSoft bg-cream p-1">
                  {[
                    { value: false, label: t("Light"), icon: "sun" },
                    { value: true, label: t("Dark"), icon: "moon" },
                  ].map((theme) => (
                    <button
                      key={theme.label}
                      type="button"
                      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition-all ${
                        isDarkMode === theme.value
                          ? "bg-primary text-white"
                          : "text-textSecondary hover:bg-white hover:text-accentHover"
                      }`}
                      aria-pressed={isDarkMode === theme.value}
                      onClick={() => {
                        if (isDarkMode !== theme.value) onSetTheme?.(theme.value);
                      }}
                    >
                      <Icon name={theme.icon} className="h-4 w-4" />
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-borderSoft bg-cream px-4 py-4">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-accent"
                checked={currentUser?.toastNotifications !== false}
                onChange={(event) =>
                  handleToastPreferenceChange(event.target.checked)
                }
              />
              <span className="min-w-0">
                <span className="section-label block">{t("Notifikasi toast")}</span>
                <span className="mt-1 block text-sm font-semibold text-textMain">
                  {currentUser?.toastNotifications !== false ? t("Aktif") : t("Nonaktif")}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-textSecondary">
                  {t("Tampilkan notifikasi singkat saat ada perubahan.")}
                </span>
              </span>
            </label>
          </section>

          <section className="rounded-lg border border-borderSoft bg-white p-6 shadow-book sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="section-label mb-1">{t("Preferensi Katalog")}</p>
                <h2 className="font-playfair text-2xl font-bold text-textMain">
                  {t("Tampilan Katalog")}
                </h2>
              </div>
              <Icon name="filter" className="h-5 w-5 text-accentHover" />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-lg border border-borderSoft bg-cream px-4 py-4">
                <p className="section-label mb-2">{t("Mode Tampilan")}</p>
                <p className="mb-4 text-sm leading-relaxed text-textSecondary">
                  {t("Atur tampilan katalog yang paling nyaman untuk membaca.")}
                </p>
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-borderSoft bg-white p-1.5">
                  {[
                    { value: "grid", label: "Grid", icon: "collection" },
                    { value: "list", label: "List", icon: "bookOpen" },
                  ].map((view) => (
                    <button
                      key={view.value}
                      type="button"
                      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition-all ${
                        catalogDraft.viewMode === view.value
                          ? "bg-primary text-white"
                          : "text-textSecondary hover:bg-cream hover:text-accentHover"
                      }`}
                      aria-pressed={catalogDraft.viewMode === view.value}
                      onClick={() => updateCatalogDraft("viewMode", view.value)}
                    >
                      <Icon name={view.icon} className="h-4 w-4" />
                      {view.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-lg border border-borderSoft bg-cream px-4 py-4">
                  <label htmlFor="catalog-page-size" className="section-label mb-2 block">
                    {t("Jumlah buku per halaman")}
                  </label>
                  <p className="mb-4 text-sm leading-relaxed text-textSecondary">
                    {t("Tentukan berapa banyak buku yang tampil di setiap halaman katalog.")}
                  </p>
                  <select
                    id="catalog-page-size"
                    className="select-field bg-white"
                    value={catalogDraft.itemsPerPage}
                    onChange={(event) =>
                      updateCatalogDraft("itemsPerPage", Number(event.target.value))
                    }
                  >
                    {CATALOG_PAGE_SIZE_OPTIONS.map((count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-lg border border-borderSoft bg-cream px-4 py-4">
                  <label htmlFor="catalog-sort" className="section-label mb-2 block">
                    {t("Urutan Default")}
                  </label>
                  <p className="mb-4 text-sm leading-relaxed text-textSecondary">
                    {t("Pilih urutan bawaan saat katalog pertama kali dibuka.")}
                  </p>
                  <select
                    id="catalog-sort"
                    className="select-field bg-white"
                    value={catalogDraft.sort}
                    onChange={(event) => updateCatalogDraft("sort", event.target.value)}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.label)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-start">
              <button type="button" className="btn-primary px-6 py-3" onClick={saveCatalogPreferences}>
                <Icon name="check" className="h-4 w-4" />
                {t("Simpan Preferensi")}
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-borderSoft bg-white p-6 shadow-book sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="section-label mb-1">{t("Data Lokal")}</p>
                <h2 className="font-playfair text-2xl font-bold text-textMain">
                  {favoriteCount} {t("buku favorit")}
                </h2>
              </div>
              <Icon name="database" className="h-5 w-5 text-accentHover" />
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-borderSoft bg-cream px-4 py-4">
                <p className="section-label mb-1.5">{t("Hapus favorit")}</p>
                <p className="text-sm leading-relaxed text-textSecondary">
                  {t("Rak favorit akan dikosongkan dari perangkat ini.")}
                </p>
              </div>
              <div className="rounded-lg border border-borderSoft bg-cream px-4 py-4">
                <p className="section-label mb-1.5">{t("Reset pengaturan")}</p>
                <p className="text-sm leading-relaxed text-textSecondary">
                  {t("Bahasa, tema, preferensi katalog, dan genre favorit akan kembali ke bawaan.")}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-logout px-5 py-2.5"
                onClick={() => openConfirmAction("favorites")}
              >
                {t("Hapus favorit")}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => openConfirmAction("settings")}
              >
                {t("Reset pengaturan")}
              </button>
            </div>
          </section>
        </div>
      </div>

      <SettingsConfirmModal
        open={Boolean(confirmAction)}
        title={
          confirmAction === "favorites"
            ? t("Konfirmasi hapus favorit")
            : t("Konfirmasi reset pengaturan")
        }
        description={
          confirmAction === "favorites"
            ? t("Semua buku favorit lokal akan dihapus dari perangkat ini.")
            : t("Semua preferensi aplikasi dan katalog akan kembali ke pengaturan awal.")
        }
        confirmLabel={
          confirmAction === "favorites"
            ? t("Hapus favorit")
            : t("Reset pengaturan")
        }
        onClose={closeConfirmAction}
        onConfirm={confirmDangerAction}
      />
    </section>
  );
}
