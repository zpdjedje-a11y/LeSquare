import { useNavigate, useLocation } from "react-router-dom"
import type { User } from "@supabase/supabase-js"

interface HeaderProps {
  user: User | null
  onSignOut: () => void
}

export default function Header({ user, onSignOut }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === "/"

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-ambre/20 sticky top-0 z-50"
      style={{ backgroundColor: "#1A1A1A" }}>
      <div className="flex items-center gap-3">
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            className="text-creme/70 hover:text-ambre transition-colors text-xl">
            ←
          </button>
        )}
        <h1 className="font-playfair text-2xl font-black text-ambre cursor-pointer"
          onClick={() => navigate("/")}>
          Le Square
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-creme/70 text-sm hidden md:block">{user.email}</span>
            <button
              onClick={() => navigate("/vendeur")}
              className="border border-ambre/40 text-ambre font-bold px-4 py-2 rounded-xl text-sm hover:border-ambre transition-colors">
              Ma boutique
            </button>
            <button
              onClick={onSignOut}
              className="bg-ambre text-noir font-bold px-4 py-2 rounded-xl text-sm hover:bg-or transition-colors">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/connexion")}
              className="text-creme/70 text-sm hover:text-ambre transition-colors">
              Connexion
            </button>
            <button
              onClick={() => navigate("/connexion")}
              className="bg-ambre text-noir font-bold px-4 py-2 rounded-xl text-sm hover:bg-or transition-colors">
              S'inscrire
            </button>
          </>
        )}
      </div>
    </header>
  )
}