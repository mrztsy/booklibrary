import { useState } from "react";
import Icon from "../components/Icon";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import UserAvatar from "../components/UserAvatar";
import aksaraHubLogo from "../assets/AksaraHub Logo.png";
import {
  ROLE_OPTIONS,
  getRoleLabel,
  normalizeRole,
} from "../utils/accountRoles";
import { useLanguage } from "../utils/language";

export default function LoginPage({
  currentUser,
  onLogin,
  onLogout,
  onToast,
  redirectTo = "home",
}) {
  const { t } = useLanguage();
  const [values, setValues] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatarUrl: currentUser?.avatarUrl || "",
    role: currentUser?.role || "user",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = values.email.trim();
    const password = values.password.trim();
    const name = values.name.trim() || email.split("@")[0] || "Pembaca";
    const avatarUrl = values.avatarUrl.trim();
    const role = normalizeRole(values.role);

    if (!email || !password) {
      setMessage(t("Email dan password perlu diisi dulu, ya."));
      return;
    }

    const result = onLogin?.({ name, email, avatarUrl, role, password });
    if (!result?.ok) {
      setMessage(result?.message || t("Password yang kamu masukkan belum cocok."));
      return;
    }

    const authenticatedUser = result.user || {
      name,
      email,
      role,
    };
    onToast?.(
      t("Selamat datang"),
      `${authenticatedUser.name}, kamu masuk sebagai ${getRoleLabel(authenticatedUser.role)}.`,
      "success",
    );
    window.location.hash =
      redirectTo === "favorit"
        ? "#/favorit"
        : redirectTo === "profile"
          ? "#/profile"
          : redirectTo === "settings"
            ? "#/settings"
          : "#/";
  };

  const handleConfirmLogout = () => {
    onLogout?.();
    onToast?.(t("Sudah keluar"), t("Sesi akunmu ditutup dengan aman."), "info");
    setLogoutModalOpen(false);
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-6xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.75fr)]">
        <div className="max-w-2xl">
          <div className="mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-white shadow-book">
            <img
              src={aksaraHubLogo}
              alt=""
              aria-hidden="true"
              className="h-full w-full scale-[1.55] object-cover"
            />
          </div>
          <p className="section-label mb-3">{t("Akun AksaraHub")}</p>
          <h1 className="font-playfair text-4xl font-extrabold leading-tight text-textMain lg:text-5xl">
            {t("Masuk untuk melanjutkan perjalanan membaca.")}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-textSecondary">
            {t("Simpan buku favorit, kelola profil pembaca, dan jelajahi katalog dengan pengalaman yang lebih personal.")}
          </p>
        </div>

        <div className="rounded-lg border border-borderSoft bg-white p-6 shadow-book">
          {currentUser ? (
            <div>
              <p className="section-label mb-2">{t("Akun Aktif")}</p>
              <div className="flex items-center gap-3">
                <UserAvatar user={currentUser} size="lg" />
                <div className="min-w-0">
                  <h2 className="font-playfair text-2xl font-bold text-textMain">
                    {currentUser.name}
                  </h2>
                  <p className="mt-1 truncate text-sm text-textSecondary">
                    {currentUser.email}
                  </p>
                  <span className="mt-2 inline-flex rounded-full bg-cream px-2.5 py-1 text-xs font-bold text-accentHover">
                    {getRoleLabel(currentUser.role)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#/profile" className="btn-primary">
                  <Icon name="users" className="h-4 w-4" />
                  {t("Edit Profil")}
                </a>
                <button
                  type="button"
                  className="btn-logout px-5 py-2.5"
                  onClick={() => setLogoutModalOpen(true)}
                >
                  {t("Keluar")}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-5">
                <p className="section-label mb-1">{t("Masuk")}</p>
                <h2 className="font-playfair text-2xl font-bold text-textMain">
                  {t("Masuk ke AksaraHub")}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="login-name" className="section-label mb-1.5 block">
                    {t("Nama")}
                  </label>
                  <input
                    id="login-name"
                    type="text"
                    autoComplete="name"
                    className="input-field"
                    placeholder={t("Nama kamu")}
                    value={values.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="login-email" className="section-label mb-1.5 block">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    className="input-field"
                    placeholder="nama@email.com"
                    value={values.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="login-avatar" className="section-label mb-1.5 block">
                    {t("Foto Profil")}
                  </label>
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      user={{
                        name: values.name || "Pembaca",
                        email: values.email,
                        avatarUrl: values.avatarUrl,
                      }}
                      size="md"
                    />
                    <input
                      id="login-avatar"
                      type="url"
                      inputMode="url"
                      className="input-field"
                      placeholder={t("URL foto, opsional")}
                      value={values.avatarUrl}
                      onChange={(event) =>
                        handleChange("avatarUrl", event.target.value)
                      }
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-3 block w-full text-sm text-textSecondary file:mr-3 file:rounded-lg file:border-0 file:bg-cream file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-borderSoft/70"
                    onChange={handleAvatarFileChange}
                  />
                </div>

                <div>
                  <label htmlFor="login-role" className="section-label mb-1.5 block">
                    {t("Peran Akun")}
                  </label>
                  <select
                    id="login-role"
                    className="select-field"
                    value={values.role}
                    onChange={(event) => handleChange("role", event.target.value)}
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-xs text-textSecondary">
                    {t(ROLE_OPTIONS.find((role) => role.value === values.role)?.helper)}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="section-label mb-1.5 block"
                  >
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    className="input-field"
                    placeholder={t("Masukkan password")}
                    value={values.password}
                    onChange={(event) =>
                      handleChange("password", event.target.value)
                    }
                  />
                </div>
              </div>

              {message && (
                <p className="mt-3 text-sm font-semibold text-accentHover">
                  {message}
                </p>
              )}

              <button type="submit" className="btn-primary mt-6 w-full">
                <Icon name="users" className="h-4 w-4" />
                {t("Masuk")}
              </button>
            </form>
          )}
        </div>
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
