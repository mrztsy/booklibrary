import { useState } from "react";
import Icon from "../components/Icon";
import UserAvatar from "../components/UserAvatar";
import { GENRES, SORT_OPTIONS } from "../data/books";
import { useLanguage } from "../utils/language";
import {
  DEFAULT_CATALOG_PREFERENCES,
  normalizeCatalogPreferences,
} from "../utils/preferences";

const LANGUAGE_OPTIONS = ["Indonesia", "English"];
const FAVORITE_GENRE_OPTIONS = GENRES.filter((genre) => genre !== "Semua").slice(0, 12);
const CATALOG_TOPIC_OPTIONS = ["Semua", ...FAVORITE_GENRE_OPTIONS];

export default function SettingsPage({
  currentUser,
  isDarkMode = false,
  catalogPreferences = DEFAULT_CATALOG_PREFERENCES,
  favoriteCount = 0,
  onLogin,
  onSetTheme,
  onSaveCatalogPreferences,
  onResetLocalData,
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
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

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

  const toggleGenre = (genre) => {
    setPreferredGenres((currentGenres) =>
      currentGenres.includes(genre)
        ? currentGenres.filter((item) => item !== genre)
        : [...currentGenres, genre],
    );
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

  const confirmResetLocalData = () => {
    onResetLocalData?.();
    setResetConfirmOpen(false);
    setCatalogDraft(DEFAULT_CATALOG_PREFERENCES);
  };

  return (
    <section className="mx-auto min-h-[70vh] max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-label mb-2">{t("Setting")}</p>
          <h1 className="font-playfair text-3xl font-bold text-textMain">
            {t("Pengaturan Akun")}
          </h1>
        </div>
        <a href="#/profile" className="btn-secondary">
          <Icon name="users" className="h-4 w-4" />
          {t("Edit Profil")}
        </a>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-lg border border-borderSoft bg-white p-5 shadow-book">
          <div className="flex items-center gap-3">
            <UserAvatar user={currentUser} size="lg" />
            <div className="min-w-0">
              <p className="section-label mb-1">{t("Edit Profil")}</p>
              <h2 className="truncate font-playfair text-2xl font-bold text-textMain">
                {currentUser?.name}
              </h2>
              <p className="truncate text-sm text-textSecondary">
                {currentUser?.email}
              </p>
            </div>
          </div>
          <a href="#/profile" className="btn-primary mt-5 w-full">
            <Icon name="users" className="h-4 w-4" />
            {t("Buka Edit Profil")}
          </a>
        </section>

        <section className="rounded-lg border border-borderSoft bg-white p-5 shadow-book">
          <div className="grid gap-4 sm:grid-cols-2">
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
                    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition-all ${
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
        </section>

        <section className="rounded-lg border border-borderSoft bg-white p-5 shadow-book lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="section-label mb-1">{t("Preferensi Katalog")}</p>
              <h2 className="font-playfair text-xl font-bold text-textMain">
                {t("Tampilan Katalog")}
              </h2>
            </div>
            <Icon name="filter" className="h-5 w-5 text-accentHover" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="catalog-topic" className="section-label mb-1.5 block">
                {t("Topik Bawaan")}
              </label>
              <select
                id="catalog-topic"
                className="select-field"
                value={catalogDraft.defaultTopic}
                onChange={(event) =>
                  updateCatalogDraft("defaultTopic", event.target.value)
                }
              >
                {CATALOG_TOPIC_OPTIONS.map((topic) => (
                  <option key={topic} value={topic}>
                    {t(topic)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="catalog-sort" className="section-label mb-1.5 block">
                {t("Urutkan")}
              </label>
              <select
                id="catalog-sort"
                className="select-field"
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

            <div>
              <p className="section-label mb-1.5">{t("Mode Tampilan")}</p>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-borderSoft bg-cream p-1">
                {[
                  { value: "grid", label: "Grid", icon: "collection" },
                  { value: "list", label: "List", icon: "bookOpen" },
                ].map((view) => (
                  <button
                    key={view.value}
                    type="button"
                    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition-all ${
                      catalogDraft.viewMode === view.value
                        ? "bg-primary text-white"
                        : "text-textSecondary hover:bg-white hover:text-accentHover"
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

            <label className="flex min-h-[4.25rem] cursor-pointer items-center gap-3 rounded-lg border border-borderSoft bg-cream px-4 py-3">
              <input
                type="checkbox"
                className="h-4 w-4 accent-accent"
                checked={catalogDraft.availableOnly}
                onChange={(event) =>
                  updateCatalogDraft("availableOnly", event.target.checked)
                }
              />
              <span>
                <span className="section-label block">{t("Ketersediaan")}</span>
                <span className="text-sm font-semibold text-textMain">
                  {t("Hanya yang tersedia")}
                </span>
              </span>
            </label>
          </div>

          <button type="button" className="btn-primary mt-5" onClick={saveCatalogPreferences}>
            <Icon name="check" className="h-4 w-4" />
            {t("Simpan Preferensi")}
          </button>
        </section>

        <section className="rounded-lg border border-borderSoft bg-white p-5 shadow-book">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="section-label mb-1">{t("Genre Favorit")}</p>
              <h2 className="font-playfair text-xl font-bold text-textMain">
                {preferredGenres.length} {t("Genre")}
              </h2>
            </div>
            <Icon name="tag" className="h-5 w-5 text-accentHover" />
          </div>

          <fieldset>
            <legend className="sr-only">{t("Genre Favorit")}</legend>
            <div className="flex flex-wrap gap-2">
              {FAVORITE_GENRE_OPTIONS.map((genre) => (
                <label key={genre} className="cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={preferredGenres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                  />
                  <span className="inline-flex min-h-9 items-center rounded-lg border border-borderSoft bg-white px-3 py-1.5 text-sm font-semibold text-textSecondary transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white">
                    {t(genre)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <button type="button" className="btn-primary mt-5" onClick={saveGenres}>
            <Icon name="check" className="h-4 w-4" />
            {t("Simpan Genre")}
          </button>
        </section>

        <section className="rounded-lg border border-borderSoft bg-white p-5 shadow-book">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="section-label mb-1">{t("Reset Data Lokal")}</p>
              <h2 className="font-playfair text-xl font-bold text-textMain">
                {favoriteCount} {t("buku favorit")}
              </h2>
            </div>
            <Icon name="database" className="h-5 w-5 text-accentHover" />
          </div>

          <div className="rounded-lg bg-cream px-4 py-3 text-sm font-semibold text-textSecondary">
            {t("Favorit dan preferensi katalog tersimpan di perangkat ini.")}
          </div>

          {resetConfirmOpen ? (
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-logout-solid px-5 py-2.5"
                onClick={confirmResetLocalData}
              >
                {t("Reset Data Lokal")}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setResetConfirmOpen(false)}
              >
                {t("Batal")}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-logout mt-5 px-5 py-2.5"
              onClick={() => setResetConfirmOpen(true)}
            >
              {t("Reset Data Lokal")}
            </button>
          )}
        </section>
      </div>
    </section>
  );
}
