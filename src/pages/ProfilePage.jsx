import { useState } from "react";
import Icon from "../components/Icon";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import UserAvatar from "../components/UserAvatar";
import {
  ROLE_OPTIONS,
  getRoleLabel,
  normalizeRole,
} from "../utils/accountRoles";

const LANGUAGE_OPTIONS = ["Indonesia", "English"];
const FAVORITE_GENRE_OPTIONS = [
  "Fiction",
  "Science",
  "Fantasy",
  "Mystery",
  "Romance",
  "History",
];

const defaultGenres = ["Fiction", "Science"];

const PROFILE_COPY = {
  Indonesia: {
    account: "Profil Akun",
    preferences: "Preferensi",
    language: "Bahasa",
    theme: "Tema",
    favoriteGenres: "Genre Favorit",
    setting: "Setting",
    closeSetting: "Tutup Setting",
    logout: "Keluar",
    details: "Detail Profil",
    displayName: "Nama Tampilan",
    displayNamePlaceholder: "Nama yang ingin ditampilkan",
    email: "Email",
    photo: "Foto Profil",
    photoPlaceholder: "Tempel URL foto profil",
    photoHint: "Kosongkan untuk memakai avatar inisial.",
    role: "Peran Akun",
    save: "Simpan Profil",
    removePhoto: "Hapus Foto",
    noGenres: "Belum dipilih",
    invalidImage: "Pilih file gambar untuk foto profil, ya.",
    imageTooLarge: "Ukuran foto maksimal 1 MB agar profil tetap ringan.",
    emailRequired: "Email profil perlu diisi dulu, ya.",
    savedTitle: "Profil tersimpan",
    savedMessage: "Preferensi bacamu sudah diperbarui.",
    avatarRemovedTitle: "Foto profil dilepas",
    avatarRemovedMessage: "Avatar inisial akan dipakai lagi.",
    signedOutTitle: "Sudah keluar",
    signedOutMessage: "Sesi akunmu ditutup dengan aman.",
    userHelper: "Menjelajahi katalog dan menyimpan buku favorit.",
    adminHelper: "Mengatur identitas akun dan kebutuhan pengelolaan koleksi.",
  },
  English: {
    account: "Account Profile",
    preferences: "Preferences",
    language: "Language",
    theme: "Theme",
    favoriteGenres: "Favorite Genres",
    setting: "Setting",
    closeSetting: "Close Setting",
    logout: "Sign Out",
    details: "Profile Details",
    displayName: "Display Name",
    displayNamePlaceholder: "Name shown in your profile",
    email: "Email",
    photo: "Profile Photo",
    photoPlaceholder: "Paste profile photo URL",
    photoHint: "Leave it empty to use your initials.",
    role: "Account Role",
    save: "Save Profile",
    removePhoto: "Remove Photo",
    noGenres: "Not selected yet",
    invalidImage: "Please choose an image file for your profile photo.",
    imageTooLarge: "Keep the photo under 1 MB so your profile stays light.",
    emailRequired: "Please fill in your profile email first.",
    savedTitle: "Profile saved",
    savedMessage: "Your reading preferences have been updated.",
    avatarRemovedTitle: "Profile photo removed",
    avatarRemovedMessage: "Your initials avatar will be used again.",
    signedOutTitle: "Signed out",
    signedOutMessage: "Your account session has been closed safely.",
    userHelper: "Browse the catalog and save favorite books.",
    adminHelper: "Manage account identity and collection needs.",
  },
};

export default function ProfilePage({
  currentUser,
  isDarkMode = false,
  onLogin,
  onLogout,
  onToast,
}) {
  const [values, setValues] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatarUrl: currentUser?.avatarUrl || "",
    role: currentUser?.role || "user",
    language: currentUser?.language || "Indonesia",
    preferredGenres:
      currentUser?.preferredGenres?.length > 0
        ? currentUser.preferredGenres
        : defaultGenres,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const activeLanguage = values.language === "English" ? "English" : "Indonesia";
  const copy = PROFILE_COPY[activeLanguage];
  const role = normalizeRole(values.role);
  const roleHelper = role === "admin" ? copy.adminHelper : copy.userHelper;
  const displayedName = values.name || currentUser?.name || "Pembaca";
  const displayedEmail = values.email || currentUser?.email || "-";
  const displayedGenres =
    values.preferredGenres.length > 0
      ? values.preferredGenres.join(", ")
      : copy.noGenres;

  const handleChange = (key, value) => {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
    setMessage("");
  };

  const toggleGenre = (genre) => {
    setValues((currentValues) => {
      const genres = currentValues.preferredGenres.includes(genre)
        ? currentValues.preferredGenres.filter((item) => item !== genre)
        : [...currentValues.preferredGenres, genre];

      return { ...currentValues, preferredGenres: genres };
    });
    setMessage("");
  };

  const handleAvatarFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage(copy.invalidImage);
      return;
    }

    if (file.size > 1024 * 1024) {
      setMessage(copy.imageTooLarge);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      handleChange("avatarUrl", String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    const name = values.name.trim() || currentUser?.name || "Pembaca";
    const email = values.email.trim() || currentUser?.email || "";
    const avatarUrl = values.avatarUrl.trim();

    if (!email) {
      setMessage(copy.emailRequired);
      return;
    }

    onLogin?.({
      name,
      email,
      avatarUrl,
      role,
      language: values.language,
      preferredGenres: values.preferredGenres,
    });
    setIsEditing(false);
    onToast?.(
      copy.savedTitle,
      copy.savedMessage,
      "success",
    );
  };

  const removeAvatar = () => {
    handleChange("avatarUrl", "");
    onToast?.(copy.avatarRemovedTitle, copy.avatarRemovedMessage, "info");
  };

  const handleConfirmLogout = () => {
    onLogout?.();
    onToast?.(copy.signedOutTitle, copy.signedOutMessage, "info");
    setLogoutModalOpen(false);
  };

  return (
    <section className="mx-auto min-h-[70vh] max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-borderSoft bg-white p-6 shadow-book sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <UserAvatar
            user={{ ...currentUser, ...values }}
            size="lg"
            className="h-24 w-24 text-2xl"
          />

          <div className="min-w-0 flex-1">
            <p className="section-label mb-2">{copy.account}</p>
            <h1 className="truncate font-playfair text-3xl font-bold text-textMain">
              {displayedName}
            </h1>
            <p className="mt-1 truncate text-sm text-textSecondary">
              {displayedEmail}
            </p>
            <p className="mt-3 text-sm font-semibold text-textMain">
              Role:{" "}
              <span className="text-accentHover">{getRoleLabel(role)}</span>
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-borderSoft pt-6">
          <p className="section-label mb-4">{copy.preferences}</p>
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg bg-cream px-4 py-3">
              <dt className="font-semibold text-textSecondary">{copy.language}</dt>
              <dd className="mt-1 font-bold text-textMain">{values.language}</dd>
            </div>
            <div className="rounded-lg bg-cream px-4 py-3">
              <dt className="font-semibold text-textSecondary">{copy.theme}</dt>
              <dd className="mt-1 font-bold text-textMain">
                {isDarkMode ? "Dark" : "Light"}
              </dd>
            </div>
            <div className="rounded-lg bg-cream px-4 py-3 sm:col-span-1">
              <dt className="font-semibold text-textSecondary">
                {copy.favoriteGenres}
              </dt>
              <dd className="mt-1 font-bold text-textMain">{displayedGenres}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsEditing((current) => !current)}
          >
            <Icon name="users" className="h-4 w-4" />
            {isEditing ? copy.closeSetting : copy.setting}
          </button>
          <button
            type="button"
            className="btn-logout px-5 py-2.5"
            onClick={() => setLogoutModalOpen(true)}
          >
            {copy.logout}
          </button>
        </div>
      </div>

      {isEditing && (
        <form
          onSubmit={handleProfileSubmit}
          noValidate
          className="mt-6 rounded-lg border border-borderSoft bg-white p-6 shadow-book"
        >
          <p className="section-label mb-5">{copy.details}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-name" className="section-label mb-1.5 block">
                {copy.displayName}
              </label>
              <input
                id="profile-name"
                type="text"
                autoComplete="name"
                className="input-field"
                placeholder={copy.displayNamePlaceholder}
                value={values.name}
                onChange={(event) => handleChange("name", event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="profile-email" className="section-label mb-1.5 block">
                {copy.email}
              </label>
              <input
                id="profile-email"
                type="email"
                autoComplete="email"
                className="input-field"
                placeholder="nama@email.com"
                value={values.email}
                onChange={(event) => handleChange("email", event.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="profile-avatar" className="section-label mb-1.5 block">
                {copy.photo}
              </label>
              <input
                id="profile-avatar"
                type="url"
                inputMode="url"
                className="input-field"
                placeholder={copy.photoPlaceholder}
                value={values.avatarUrl}
                onChange={(event) => handleChange("avatarUrl", event.target.value)}
              />
              <p className="mt-1.5 text-xs text-textSecondary">
                {copy.photoHint}
              </p>
              <input
                type="file"
                accept="image/*"
                className="mt-3 block w-full text-sm text-textSecondary file:mr-3 file:rounded-lg file:border-0 file:bg-cream file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-borderSoft/70"
                onChange={handleAvatarFileChange}
              />
            </div>

            <div>
              <label htmlFor="profile-role" className="section-label mb-1.5 block">
                {copy.role}
              </label>
              <select
                id="profile-role"
                className="select-field"
                value={values.role}
                onChange={(event) => handleChange("role", event.target.value)}
              >
                {ROLE_OPTIONS.map((roleOption) => (
                  <option key={roleOption.value} value={roleOption.value}>
                    {roleOption.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-textSecondary">
                {roleHelper}
              </p>
            </div>

            <div>
              <label htmlFor="profile-language" className="section-label mb-1.5 block">
                {copy.language}
              </label>
              <select
                id="profile-language"
                className="select-field"
                value={values.language}
                onChange={(event) => handleChange("language", event.target.value)}
              >
                {LANGUAGE_OPTIONS.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className="sm:col-span-2">
              <legend className="section-label mb-2">
                {copy.favoriteGenres}
              </legend>
              <div className="flex flex-wrap gap-2">
                {FAVORITE_GENRE_OPTIONS.map((genre) => (
                  <label key={genre} className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={values.preferredGenres.includes(genre)}
                      onChange={() => toggleGenre(genre)}
                    />
                    <span className="inline-flex min-h-9 items-center rounded-lg border border-borderSoft bg-white px-3 py-1.5 text-sm font-semibold text-textSecondary transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white">
                      {genre}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {message && (
            <p className="mt-4 text-sm font-semibold text-accentHover">
              {message}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">
              {copy.save}
            </button>
            {values.avatarUrl && (
              <button
                type="button"
                className="btn-secondary"
                onClick={removeAvatar}
              >
                {copy.removePhoto}
              </button>
            )}
          </div>
        </form>
      )}

      <LogoutConfirmModal
        open={logoutModalOpen}
        userName={currentUser?.name}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </section>
  );
}
