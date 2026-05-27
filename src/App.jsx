import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import FavoritesPage from "./pages/FavoritesPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ToastContainer from "./components/ToastContainer";
import { FALLBACK_BOOKS } from "./data/books";
import { fetchOpenLibraryBooks } from "./services/bookApi";
import { normalizeRole } from "./utils/accountRoles";
import { LanguageProvider, translateText } from "./utils/language";

const FAVORITES_STORAGE_KEY = "aksarahub-favorite-books";
const THEME_STORAGE_KEY = "aksarahub-theme";
const AUTH_STORAGE_KEY = "aksarahub-user";

const ROUTES = new Set([
  "home",
  "katalog",
  "favorit",
  "tentang",
  "koleksi",
  "login",
  "profile",
]);

const getBookId = (book) => book?.key || book?.id || book?.workKey || book?.title;

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
      return parsedUser
        ? {
            role: "user",
            language: "Indonesia",
            preferredGenres: ["Fiction", "Science"],
            ...parsedUser,
          }
        : null;
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

  const showToast = (title, message = "", type = "success") => {
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

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    showToast(
      nextMode ? t("Mode gelap aktif") : t("Mode terang aktif"),
      nextMode
        ? t("Tampilan dibuat lebih teduh untuk membaca.")
        : t("Tampilan kembali cerah dan ringan."),
      "info",
    );
  };

  const handleLogin = (user) => {
    const nextUser = {
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || "",
      role: normalizeRole(user.role),
      language: user.language || "Indonesia",
      preferredGenres:
        user.preferredGenres?.length > 0
          ? user.preferredGenres
          : ["Fiction", "Science"],
      loggedInAt: new Date().toISOString(),
    };
    setCurrentUser(nextUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
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
