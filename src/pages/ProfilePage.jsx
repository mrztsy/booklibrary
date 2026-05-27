import { useState } from "react";
import Icon from "../components/Icon";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import UserAvatar from "../components/UserAvatar";
import {
  ROLE_OPTIONS,
  getRoleLabel,
  normalizeRole,
} from "../utils/accountRoles";

export default function ProfilePage({
  currentUser,
  onLogin,
  onLogout,
  onToast,
}) {
  const [values, setValues] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatarUrl: currentUser?.avatarUrl || "",
    role: currentUser?.role || "user",
  });
  const [message, setMessage] = useState("");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const role = normalizeRole(values.role);

  const handleChange = (key, value) => {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
    setMessage("");
  };

  const handleAvatarFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Pilih file gambar untuk foto profil, ya.");
      return;
    }

    if (file.size > 1024 * 1024) {
      setMessage("Ukuran foto maksimal 1 MB agar profil tetap ringan.");
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
      setMessage("Email profil perlu diisi dulu, ya.");
      return;
    }

    onLogin?.({ name, email, avatarUrl, role });
    onToast?.(
      "Profil tersimpan",
      `Profilmu sekarang memakai role ${getRoleLabel(role)}.`,
      "success",
    );
  };

  const removeAvatar = () => {
    handleChange("avatarUrl", "");
    onToast?.("Foto profil dilepas", "Avatar inisial akan dipakai lagi.", "info");
  };

  const handleConfirmLogout = () => {
    onLogout?.();
    onToast?.("Sudah keluar", "Sesi akunmu ditutup dengan aman.", "info");
    setLogoutModalOpen(false);
  };

  return (
    <section className="mx-auto min-h-[70vh] max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="section-label mb-3">Profil Akun</p>
        <h1 className="font-playfair text-3xl font-bold text-textMain sm:text-4xl">
          Rapikan identitas pembaca di AksaraHub.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-textSecondary sm:text-base">
          Nama, foto, dan role membantu pengalaman membaca terasa lebih personal
          saat menjelajahi katalog dan rak favorit.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(260px,0.72fr)_minmax(0,1fr)]">
        <aside className="rounded-lg border border-borderSoft bg-white p-6 shadow-book">
          <div className="flex flex-col items-center text-center">
            <UserAvatar
              user={{ ...currentUser, ...values }}
              size="lg"
              className="h-24 w-24 text-2xl"
            />
            <h2 className="mt-4 max-w-full truncate font-playfair text-2xl font-bold text-textMain">
              {values.name || currentUser?.name || "Pembaca"}
            </h2>
            <p className="mt-1 max-w-full truncate text-sm text-textSecondary">
              {values.email || currentUser?.email}
            </p>
            <span
              className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                role === "admin"
                  ? "bg-accent text-white"
                  : "bg-cream text-primary"
              }`}
            >
              {getRoleLabel(role)}
            </span>
          </div>

          <div className="mt-6 grid gap-3">
            <a href="#/" className="btn-primary">
              <Icon name="home" className="h-4 w-4" />
              Ke Beranda
            </a>
            <button
              type="button"
              className="btn-logout px-5 py-2.5"
              onClick={() => setLogoutModalOpen(true)}
            >
              Keluar
            </button>
          </div>
        </aside>

        <form
          onSubmit={handleProfileSubmit}
          noValidate
          className="rounded-lg border border-borderSoft bg-white p-6 shadow-book"
        >
          <p className="section-label mb-5">Detail Profil</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-name" className="section-label mb-1.5 block">
                Nama Tampilan
              </label>
              <input
                id="profile-name"
                type="text"
                autoComplete="name"
                className="input-field"
                placeholder="Nama yang ingin ditampilkan"
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
                Foto Profil
              </label>
              <input
                id="profile-avatar"
                type="url"
                inputMode="url"
                className="input-field"
                placeholder="Tempel URL foto profil"
                value={values.avatarUrl}
                onChange={(event) => handleChange("avatarUrl", event.target.value)}
              />
              <p className="mt-1.5 text-xs text-textSecondary">
                Kosongkan untuk memakai avatar inisial.
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
                Peran Akun
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
                {ROLE_OPTIONS.find((roleOption) => roleOption.value === role)?.helper}
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
              Simpan Profil
            </button>
            {values.avatarUrl && (
              <button
                type="button"
                className="btn-secondary"
                onClick={removeAvatar}
              >
                Hapus Foto
              </button>
            )}
          </div>
        </form>
      </div>

      <LogoutConfirmModal
        open={logoutModalOpen}
        userName={currentUser?.name}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </section>
  );
}
