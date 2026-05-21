import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LibraryPage from './pages/LibraryPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  const [activePage, setActivePage] = useState('home')

  return (
    <div className="min-h-screen flex flex-col bg-parchment-50 font-crimson">
      <Header activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1">
        {activePage === 'home'    && <HomePage />}
        {activePage === 'library' && <LibraryPage />}
        {activePage === 'about'   && <AboutPage />}
      </main>

      <Footer />
    </div>
  )
}
