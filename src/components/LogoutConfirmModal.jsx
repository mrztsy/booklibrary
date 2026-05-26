import { useEffect } from "react";
import Icon from "./Icon";

export default function LogoutConfirmModal({
  open,
  userName = "akun ini",
  onClose,
  onConfirm,
}) {
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
        aria-labelledby="logout-modal-title"
        className="w-full max-w-sm rounded-lg border border-borderSoft bg-white p-5 text-textMain shadow-book"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-label mb-1">Konfirmasi</p>
            <h2
              id="logout-modal-title"
              className="font-playfair text-xl font-bold text-textMain"
            >
              Keluar dari akun?
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-borderSoft text-textSecondary transition-colors hover:border-accent hover:text-accentHover"
            aria-label="Tutup modal"
            onClick={onClose}
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-textSecondary">
          Sesi {userName} akan dihentikan. Kamu bisa masuk lagi kapan saja.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button type="button" className="btn-primary" onClick={onConfirm}>
            Keluar
          </button>
        </div>
      </section>
    </div>
  );
}
