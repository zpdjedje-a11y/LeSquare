import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import BoutiquesPage from "./pages/BoutiquesPage"
import BoutiquePage from "./pages/BoutiquePage"
import VendeurPage from "./pages/VendeurPage"

function App() {
  const { user, loading, signOut } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#1A1A1A" }}>
      <p className="font-playfair text-2xl animate-pulse" style={{ color: "#F59E0B" }}>
        Le Square...
      </p>
    </div>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage user={user} onSignOut={signOut} />} />
        <Route path="/connexion" element={user ? <Navigate to="/" /> : <AuthPage />} />
        <Route path="/boutiques" element={<BoutiquesPage user={user} onSignOut={signOut} />} />
        <Route path="/boutique/:id" element={<BoutiquePage user={user} onSignOut={signOut} />} />
        <Route path="/vendeur" element={
  user ? <VendeurPage user={user} onSignOut={signOut} /> : <Navigate to="/connexion" />
} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App