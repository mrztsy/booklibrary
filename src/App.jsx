import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import FavoritesPage from "./pages/FavoritesPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ToastContainer from "./components/ToastContainer";
import { FALLBACK_BOOKS } from "./data/books";
import { fetchOpenLibraryBooks } from "./services/bookApi";
import { normalizeRole } from "./utils/accountRoles";
import { LanguageProvider, translateText } from "./utils/language";
import {
  CATALOG_PREFERENCES_STORAGE_KEY,
  DEFAULT_CATALOG_PREFERENCES,
  normalizeCatalogPreferences,
} from "./utils/preferences";

const FAVORITES_STORAGE_KEY = "aksarahub-favorite-books";
const THEME_STORAGE_KEY = "aksarahub-theme";
const AUTH_STORAGE_KEY = "aksarahub-user";
const ACCOUNT_STORAGE_KEY = "aksarahub-account";

const ROUTES = new Set([
  "home",
  "katalog",
  "favorit",
  "tentang",
  "koleksi",
  "login",
  "profile",
  "settings",
]);

const getBookId = (book) => book?.key || book?.id || book?.workKey || book?.title;

const normalizeStoredUser = (candidate = {}) => ({
  role: "user",
  language: "Indonesia",
  preferredGenres: ["Fiction", "Science"],
  toastNotifications: true,
  password: "",
  ...candidate,
});

const stripSessionFields = (user) => {
  if (!user) return null;

  const { loggedInAt, ...account } = user;
  return account;
};

const getRouteFromHash = () => {
  const rawHash = window.location.hash.replace(/^#\/?/, "");
  const route = rawHash.split("/")[0] || "home";
  return ROUTES.has(route) ? route : "home";
};

export default function App() {
  const [activeRoute, setActiveRoute] = useState(() => getRouteFromHash());
  const [isLoading, setIsLoading] = useState(true);
  const [dataStore, setDataStore] = useState([]);
  const [recommendationStore, setRecommendationStore] = useState([]);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      return parsedUser ? normalizeStoredUser(parsedUser) : null;
    } catch {
      return null;
    }
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia?.("(prefers-color-scheme: dark)").matches || false;
    } catch {
      return false;
    }
  });
  const [catalogPreferences, setCatalogPreferences] = useState(() => {
    try {
      const savedPreferences = localStorage.getItem(CATALOG_PREFERENCES_STORAGE_KEY);
      return savedPreferences
        ? normalizeCatalogPreferences(JSON.parse(savedPreferences))
        : DEFAULT_CATALOG_PREFERENCES;
    } catch {
      return DEFAULT_CATALOG_PREFERENCES;
    }
  });
  const [favoriteBooks, setFavoriteBooks] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch {
      return [];
    }
  });

  const favoriteIds = new Set(favoriteBooks.map(getBookId).filter(Boolean));
  const activePage = activeRoute === "koleksi" ? "home" : activeRoute;
  const appLanguage = currentUser?.language === "English" ? "English" : "Indonesia";
  const t = (text) => translateText(text, appLanguage);

  const showToast = (
    title,
    message = "",
    type = "success",
    options = {},
  ) => {
    if (currentUser?.toastNotifications === false && !options.force) return;

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((currentToasts) => [
      { id, title, message, type },
      ...currentToasts,
    ].slice(0, 4));
  };

  const dismissToast = (toastId) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId),
    );
  };

  const toggleFavorite = (book) => {
    if (!currentUser) {
      showToast(
        t("Masuk dulu, ya"),
        t("Setelah login, buku favoritmu bisa disimpan rapi."),
        "info",
      );
      window.location.hash = "#/login";
      return;
    }

    const bookId = getBookId(book);
    if (!bookId) return;

    const alreadySaved = favoriteBooks.some(
      (favoriteBook) => getBookId(favoriteBook) === bookId,
    );

    setFavoriteBooks((currentFavorites) => {
      const isStillSaved = currentFavorites.some(
        (favoriteBook) => getBookId(favoriteBook) === bookId,
      );

      if (isStillSaved) {
        return currentFavorites.filter(
          (favoriteBook) => getBookId(favoriteBook) !== bookId,
        );
      }

      return [book, ...currentFavorites];
    });

    showToast(
      alreadySaved ? t("Dihapus dari favorit") : t("Favorit disimpan"),
      book.title || t("Rak favoritmu sudah diperbarui."),
      "success",
    );
  };

  const updateTheme = (nextMode) => {
    setIsDarkMode(nextMode);
    showToast(
      nextMode ? t("Mode gelap aktif") : t("Mode terang aktif"),
      nextMode
        ? t("Tampilan dibuat lebih teduh untuk membaca.")
        : t("Tampilan kembali cerah dan ringan."),
      "info",
    );
  };

  const toggleTheme = () => {
    updateTheme(!isDarkMode);
  };

  const updateCatalogPreferences = (preferences) => {
    const nextPreferences = normalizeCatalogPreferences(preferences);
    setCatalogPreferences(nextPreferences);
    localStorage.setItem(
      CATALOG_PREFERENCES_STORAGE_KEY,
      JSON.stringify(nextPreferences),
    );
    showToast(
      t("Preferensi katalog tersimpan"),
      t("Katalog akan memakai pilihan ini sebagai bawaan."),
      "success",
    );
  };

  const clearFavoriteBooks = () => {
    setFavoriteBooks([]);
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
    showToast(
      t("Favorit dibersihkan"),
      t("Semua buku favorit lokal sudah dihapus."),
      "info",
      { force: true },
    );
  };

  const resetSettings = () => {
    const nextCatalogPreferences = DEFAULT_CATALOG_PREFERENCES;
    setCatalogPreferences(nextCatalogPreferences);
    localStorage.setItem(
      CATALOG_PREFERENCES_STORAGE_KEY,
      JSON.stringify(nextCatalogPreferences),
    );
    setIsDarkMode(false);
    localStorage.setItem(THEME_STORAGE_KEY, "light");

    setCurrentUser((current) => {
      if (!current) return current;

      const nextUser = {
        ...current,
        language: "Indonesia",
        preferredGenres: ["Fiction", "Science"],
        toastNotifications: true,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
      return nextUser;
    });

    showToast(
      translateText("Pengaturan direset", "Indonesia"),
      translateText(
        "Preferensi aplikasi dan katalog dikembalikan ke bawaan.",
        "Indonesia",
      ),
      "info",
      { force: true },
    );
  };

  const handleLogin = (user) => {
    if (currentUser) {
      const nextUser = normalizeStoredUser({
        ...currentUser,
        ...user,
        role: normalizeRole(user.role || currentUser.role),
        password: user.password ?? currentUser.password ?? "",
      });
      setCurrentUser(nextUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
      localStorage.setItem(
        ACCOUNT_STORAGE_KEY,
        JSON.stringify(stripSessionFields(nextUser)),
      );
      return { ok: true, user: nextUser };
    }

    const email = user.email?.trim() || "";
    const password = user.password?.trim() || "";
    const fallbackName = email.split("@")[0] || "Pembaca";
    const submittedUser = normalizeStoredUser({
      name: user.name?.trim() || fallbackName,
      email,
      avatarUrl: user.avatarUrl?.trim() || "",
      role: normalizeRole(user.role),
      language: user.language || "Indonesia",
      preferredGenres:
        user.preferredGenres?.length > 0
          ? user.preferredGenres
          : ["Fiction", "Science"],
      toastNotifications: user.toastNotifications !== false,
      password,
    });

    let storedAccount = null;
    try {
      const rawStoredAccount = localStorage.getItem(ACCOUNT_STORAGE_KEY);
      storedAccount = rawStoredAccount
        ? normalizeStoredUser(JSON.parse(rawStoredAccount))
        : null;
    } catch {
      storedAccount = null;
    }

    const sameAccount =
      storedAccount?.email?.trim().toLowerCase() === email.toLowerCase();

    if (sameAccount) {
      const savedPassword = storedAccount.password || "";
      if (savedPassword && savedPassword !== password) {
        return {
          ok: false,
          message: t("Password yang kamu masukkan belum cocok."),
        };
      }

      const syncedAccount = normalizeStoredUser({
        ...storedAccount,
        password: password || savedPassword,
      });
      const nextUser = {
        ...syncedAccount,
        loggedInAt: new Date().toISOString(),
      };
      setCurrentUser(nextUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
      localStorage.setItem(
        ACCOUNT_STORAGE_KEY,
        JSON.stringify(stripSessionFields(nextUser)),
      );
      return { ok: true, user: nextUser };
    }

    const nextUser = {
      ...submittedUser,
      loggedInAt: new Date().toISOString(),
    };
    setCurrentUser(nextUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    localStorage.setItem(
      ACCOUNT_STORAGE_KEY,
      JSON.stringify(stripSessionFields(nextUser)),
    );
    return { ok: true, user: nextUser };
  };

  const changePassword = ({ currentPassword = "", newPassword = "" }) => {
    if (!currentUser) {
      return {
        ok: false,
        message: t("Masuk dulu, ya"),
      };
    }

    const savedPassword = currentUser.password || "";
    if (savedPassword && currentPassword !== savedPassword) {
      return {
        ok: false,
        message: t("Password saat ini belum cocok."),
      };
    }

    if (newPassword.trim().length < 6) {
      return {
        ok: false,
        message: t("Password baru minimal 6 karakter."),
      };
    }

    const nextUser = {
      ...currentUser,
      password: newPassword.trim(),
    };
    setCurrentUser(nextUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    localStorage.setItem(
      ACCOUNT_STORAGE_KEY,
      JSON.stringify(stripSessionFields(nextUser)),
    );
    return { ok: true };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    if (activeRoute === "favorit") {
      window.location.hash = "#/";
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const handleRouteChange = () => {
      setActiveRoute(getRouteFromHash());
    };

    window.addEventListener("hashchange", handleRouteChange);
    handleRouteChange();

    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  useEffect(() => {
    const targetId = activeRoute === "koleksi" ? "koleksi" : null;
    window.setTimeout(() => {
      if (targetId) {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 0);
  }, [activeRoute]);

  useEffect(() => {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favoriteBooks),
    );
  }, [favoriteBooks]);

  async function fetchData(rawFilters = {}) {
    const filters = rawFilters || {};
    const isDefaultFetch = Object.keys(filters).length === 0;

    setIsLoading(true);
    setError(null);
    try {
      const books = await fetchOpenLibraryBooks(filters);

      setDataStore(books);
      if (isDefaultFetch) {
        setRecommendationStore(books);
      } else {
        setRecommendationStore((currentRecommendations) =>
          currentRecommendations.length === 0 ? books : currentRecommendations,
        );
      }
    } catch (err) {
      setDataStore((currentBooks) => {
        const nextBooks = currentBooks.length > 0 ? currentBooks : FALLBACK_BOOKS;
        setRecommendationStore((currentRecommendations) =>
          currentRecommendations.length === 0 ? nextBooks : currentRecommendations,
        );
        return nextBooks;
      });
      setError(
        t("Open Library sedang sulit dihubungi. Kami tampilkan data contoh dulu, ya."),
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (error && dataStore.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="max-w-md rounded-lg border border-borderSoft bg-white p-6 text-center shadow-book">
          <p className="font-playfair text-xl font-semibold text-textMain mb-2">
            {t("Data belum bisa dibuka")}
          </p>
          <p className="font-crimson text-textSecondary mb-4">{error}</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => fetchData()}
          >
            {t("Coba lagi")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider language={appLanguage}>
      <div className="min-h-screen flex flex-col bg-cream font-crimson transition-colors duration-300">
      <Header
        favoriteCount={favoriteBooks.length}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        activePage={activePage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main id="main-content" className="flex-1" role="main">
        {activePage === "home" && (
          <HomePage
            books={dataStore}
            featuredSourceBooks={
              recommendationStore.length > 0 ? recommendationStore : dataStore
            }
            error={error}
            fetchData={fetchData}
            isLoading={isLoading}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onToast={showToast}
          />
        )}

        {activePage === "katalog" && (
          <LibraryPage
            books={dataStore}
            isLoading={isLoading}
            fetchData={fetchData}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onToast={showToast}
            catalogPreferences={catalogPreferences}
          />
        )}

        {activePage === "favorit" && (
          currentUser ? (
            <FavoritesPage
              favoriteBooks={favoriteBooks}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              onToast={showToast}
            />
          ) : (
            <LoginPage
              currentUser={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onToast={showToast}
              redirectTo="favorit"
            />
          )
        )}

        {activePage === "tentang" && <AboutPage />}
        {activePage === "profile" && (
          currentUser ? (
            <ProfilePage
              currentUser={currentUser}
              isDarkMode={isDarkMode}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onToast={showToast}
            />
          ) : (
            <LoginPage
              currentUser={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onToast={showToast}
              redirectTo="profile"
            />
          )
        )}
        {activePage === "settings" && (
          currentUser ? (
            <SettingsPage
              currentUser={currentUser}
              isDarkMode={isDarkMode}
              catalogPreferences={catalogPreferences}
              favoriteCount={favoriteBooks.length}
              onLogin={handleLogin}
              onSetTheme={updateTheme}
              onSaveCatalogPreferences={updateCatalogPreferences}
              onClearFavorites={clearFavoriteBooks}
              onResetSettings={resetSettings}
              onChangePassword={changePassword}
              onToast={showToast}
            />
          ) : (
            <LoginPage
              currentUser={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onToast={showToast}
              redirectTo="settings"
            />
          )
        )}
        {activePage === "login" && (
          <LoginPage
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onToast={showToast}
          />
        )}
      </main>

        <Footer onToast={showToast} activePage={activePage} />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    </LanguageProvider>
  );
}
