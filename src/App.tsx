import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "./hooks/useAuth"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import BoutiquesPage from "./pages/BoutiquesPage"
import BoutiquePage from "./pages/BoutiquePage"
import VendeurPage from "./pages/VendeurPage"
import CommandePage from "./pages/CommandePage"
import ConfirmationPage from "./pages/ConfirmationPage"
import AdminPage from "./pages/AdminPage"
import CityModal from "./components/CityModal"

function App() {
  const { user, loading, signOut } = useAuth()
  const [villeChoisie, setVilleChoisie] = useState<string | null>(null)
  const [showCityModal, setShowCityModal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("lesquare_ville")
    if (saved) {
      setVilleChoisie(saved)
    } else {
      setShowCityModal(true)
    }
  }, [])

  const handleVilleSelect = (ville: string) => {
    setVilleChoisie(ville)
    localStorage.setItem("lesquare_ville", ville)
    setShowCityModal(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#1A1A1A" }}>
      <p className="font-playfair text-2xl animate-pulse" style={{ color: "#F59E0B" }}>
        Le Square...
      </p>
    </div>
  )

  return (
    <>
      {showCityModal && (
  <CityModal
    onSelect={handleVilleSelect}
    onClose={villeChoisie ? () => setShowCityModal(false) : undefined}
  />
)}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <HomePage user={user} onSignOut={signOut}
              villeChoisie={villeChoisie}
              onChangeVille={() => setShowCityModal(true)} />
          } />
          <Route path="/connexion" element={user ? <Navigate to="/" /> : <AuthPage />} />
          <Route path="/boutiques" element={
            <BoutiquesPage user={user} onSignOut={signOut}
              villeChoisie={villeChoisie}
              onChangeVille={() => setShowCityModal(true)} />
          } />
          <Route path="/boutique/:id" element={<BoutiquePage user={user} onSignOut={signOut} />} />
          <Route path="/commande" element={<CommandePage user={user} onSignOut={signOut} />} />
<Route path="/confirmation" element={<ConfirmationPage user={user} onSignOut={signOut} />} />
          <Route path="/vendeur" element={
            user ? <VendeurPage user={user} onSignOut={signOut} /> : <Navigate to="/connexion" />
          } />
          <Route path="/admin" element={<AdminPage user={user} onSignOut={signOut} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App