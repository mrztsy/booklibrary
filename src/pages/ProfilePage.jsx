import { useState } from "react";
import Icon from "../components/Icon";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import UserAvatar from "../components/UserAvatar";
import {
  ROLE_OPTIONS,
  getRoleLabel,
  normalizeRole,
} from "../utils/accountRoles";
import { useLanguage } from "../utils/language";

export default function ProfilePage({
  currentUser,
  isDarkMode = false,
  onLogin,
  onLogout,
  onToast,
}) {
  const { t } = useLanguage();
  const [values, setValues] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatarUrl: currentUser?.avatarUrl || "",
    role: currentUser?.role || "user",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const role = normalizeRole(values.role);
  const roleOption = ROLE_OPTIONS.find((option) => option.value === role);
  const displayedName = values.name || currentUser?.name || "Pembaca";
  const displayedEmail = values.email || currentUser?.email || "-";
  const displayedLanguage = currentUser?.language || "Indonesia";
  const displayedGenres =
    currentUser?.preferredGenres?.length > 0
      ? currentUser.preferredGenres
      : [t("Belum dipilih")];
  const profileSummaryRows = [
    {
      label: t("Nama lengkap"),
      value: displayedName,
    },
    {
      label: "Email",
      value: displayedEmail,
    },
    {
      label: t("Peran Akun"),
      value: getRoleLabel(role),
      helper: t(roleOption?.helper),
    },
    {
      label: t("Bahasa"),
      value: displayedLanguage,
    },
    {
      label: t("Tema tampilan"),
      value: isDarkMode ? t("Dark") : t("Light"),
      helper: isDarkMode ? t("Mode gelap aktif") : t("Mode terang aktif"),
    },
  ];

  const handleChange = (key, value) => {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
    setMessage("");
  };

  const handleAvatarFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage(t("Pilih file gambar untuk foto profil, ya."));
      return;
    }

    if (file.size > 1024 * 1024) {
      setMessage(t("Ukuran foto maksimal 1 MB agar profil tetap ringan."));
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
      setMessage(t("Email profil perlu diisi dulu, ya."));
      return;
    }

    onLogin?.({
      ...currentUser,
      name,
      email,
      avatarUrl,
      role,
    });
    setIsEditing(false);
    onToast?.(
      t("Profil tersimpan"),
      t("Detail profilmu sudah diperbarui."),
      "success",
    );
  };

  const removeAvatar = () => {
    handleChange("avatarUrl", "");
    onToast?.(
      t("Foto profil dilepas"),
      t("Avatar inisial akan dipakai lagi."),
      "info",
    );
  };

  const handleConfirmLogout = () => {
    onLogout?.();
    onToast?.(t("Sudah keluar"), t("Sesi akunmu ditutup dengan aman."), "info");
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
            <p className="section-label mb-2">{t("Profil Akun")}</p>
            <h1 className="truncate font-playfair text-3xl font-bold text-textMain">
              {displayedName}
            </h1>
            <p className="mt-1 truncate text-sm text-textSecondary">
              {displayedEmail}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-borderSoft bg-cream px-4 py-4">
            <p className="section-label mb-2">{t("Foto Profil")}</p>
            <div className="flex items-center gap-4">
              <UserAvatar
                user={{ ...currentUser, ...values }}
                size="md"
                className="h-16 w-16 text-lg"
              />
              <div>
                <p className="font-semibold text-textMain">
                  {currentUser?.avatarUrl
                    ? t("Foto profil aktif")
                    : t("Menggunakan avatar inisial")}
                </p>
                <p className="mt-1 text-sm text-textSecondary">
                  {t("Foto profil dipakai untuk identitas akunmu.")}
                </p>
              </div>
            </div>
          </div>

          {profileSummaryRows.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-borderSoft bg-cream px-4 py-4"
            >
              <p className="section-label mb-1">{item.label}</p>
              <p className="font-semibold text-textMain">{item.value}</p>
              {item.helper && (
                <p className="mt-1.5 text-sm text-textSecondary">{item.helper}</p>
              )}
            </div>
          ))}

          <div className="rounded-lg border border-borderSoft bg-cream px-4 py-4 lg:col-span-2">
            <p className="section-label mb-2">{t("Genre Favorit")}</p>
            <div className="flex flex-wrap gap-2">
              {displayedGenres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex min-h-9 items-center rounded-lg border border-borderSoft bg-white px-3 py-1.5 text-sm font-semibold text-textSecondary"
                >
                  {t(genre)}
                </span>
              ))}
            </div>
          </div>

          <a
            href="#/settings"
            className="rounded-lg border border-borderSoft bg-white px-4 py-3 text-textMain transition-all hover:border-accent hover:bg-cream"
          >
            <span className="section-label mb-1 block">{t("Setting")}</span>
            <span className="inline-flex items-center gap-2 font-semibold">
              <Icon name="monitor" className="h-4 w-4 text-accentHover" />
              {t("Kelola bahasa, tema, dan katalog")}
            </span>
          </a>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsEditing((current) => !current)}
          >
            <Icon name="users" className="h-4 w-4" />
            {isEditing ? t("Tutup Edit Profil") : t("Edit Profil")}
          </button>
          <button
            type="button"
            className="btn-logout px-5 py-2.5"
            onClick={() => setLogoutModalOpen(true)}
          >
            {t("Keluar")}
          </button>
        </div>
      </div>

      {isEditing && (
        <form
          onSubmit={handleProfileSubmit}
          noValidate
          className="mt-6 rounded-lg border border-borderSoft bg-white p-6 shadow-book"
        >
          <p className="section-label mb-5">{t("Detail Profil")}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-name" className="section-label mb-1.5 block">
                {t("Nama Tampilan")}
              </label>
              <input
                id="profile-name"
                type="text"
                autoComplete="name"
                className="input-field"
                placeholder={t("Nama yang ingin ditampilkan")}
                value={values.name}
                onChange={(event) => handleChange("name", event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="profile-email" className="section-label mb-1.5 block">
                Email
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
                {t("Foto Profil")}
              </label>
              <input
                id="profile-avatar"
                type="url"
                inputMode="url"
                className="input-field"
                placeholder={t("Tempel URL foto profil")}
                value={values.avatarUrl}
                onChange={(event) => handleChange("avatarUrl", event.target.value)}
              />
              <p className="mt-1.5 text-xs text-textSecondary">
                {t("Kosongkan untuk memakai avatar inisial.")}
              </p>
              <input
                type="file"
                accept="image/*"
                className="mt-3 block w-full text-sm text-textSecondary file:mr-3 file:rounded-lg file:border-0 file:bg-cream file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-borderSoft/70"
                onChange={handleAvatarFileChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="profile-role" className="section-label mb-1.5 block">
                {t("Peran Akun")}
              </label>
              <select
                id="profile-role"
                className="select-field"
                value={values.role}
                onChange={(event) => handleChange("role", event.target.value)}
              >
                {ROLE_OPTIONS.map((roleOptionItem) => (
                  <option key={roleOptionItem.value} value={roleOptionItem.value}>
                    {roleOptionItem.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-textSecondary">
                {t(roleOption?.helper)}
              </p>
            </div>
          </div>

          {message && (
            <p className="mt-4 text-sm font-semibold text-accentHover">
              {message}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">
              {t("Simpan Profil")}
            </button>
            {values.avatarUrl && (
              <button
                type="button"
                className="btn-secondary"
                onClick={removeAvatar}
              >
                {t("Hapus Foto")}
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
