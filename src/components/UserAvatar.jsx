import { useEffect, useState } from "react";

const avatarPalettes = [
  ["#18332F", "#B8892D"],
  ["#7A2E2E", "#B8892D"],
  ["#274A43", "#E7C06B"],
  ["#5F6F64", "#18332F"],
];

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
};

const getInitials = (user) => {
  const source = user?.name || user?.email || "Pembaca";
  const words = source
    .replace(/@.*/, "")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "P";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const getPalette = (user) => {
  const source = user?.email || user?.name || "Pembaca";
  const index =
    [...source].reduce((total, char) => total + char.charCodeAt(0), 0) %
    avatarPalettes.length;

  return avatarPalettes[index];
};

export default function UserAvatar({ user, size = "sm", className = "" }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = getInitials(user);
  const [from, to] = getPalette(user);
  const avatarUrl = user?.avatarUrl?.trim();

  useEffect(() => {
    setImageFailed(false);
  }, [avatarUrl]);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/30 font-bold text-white shadow-sm ${sizeClasses[size] || sizeClasses.sm} ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-label={`Foto profil ${user?.name || "pengguna"}`}
      title={user?.name || "Pengguna"}
    >
      {avatarUrl && !imageFailed ? (
        <img
          src={avatarUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            setImageFailed(true);
          }}
        />
      ) : (
        initials
      )}
    </span>
  );
}
