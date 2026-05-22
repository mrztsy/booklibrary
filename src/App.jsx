import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-parchment-50 font-crimson">
      <Header />

      <main id="main-content" className="flex-1" role="main">
        <HomePage />

        <LibraryPage />

        <AboutPage />
      </main>

      <Footer />
    </div>
  );
}
