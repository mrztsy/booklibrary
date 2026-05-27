export const ROLE_OPTIONS = [
  {
    value: "user",
    label: "User",
    helper: "Menjelajahi katalog dan menyimpan buku favorit.",
  },
  {
    value: "admin",
    label: "Admin",
    helper: "Mengatur identitas akun dan kebutuhan pengelolaan koleksi.",
  },
];

export const getRoleLabel = (role) =>
  ROLE_OPTIONS.find((option) => option.value === role)?.label || "User";

export const normalizeRole = (role) => (role === "admin" ? "admin" : "user");
