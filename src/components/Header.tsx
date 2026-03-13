import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import type { User } from "@supabase/supabase-js"
import { useCart } from "../lib/cartContext"
import CartDrawer from "./CartDrawer"

interface HeaderProps {
  user: User | null
  onSignOut: () => void
}

export default function Header({ user, onSignOut }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === "/"
  const { count } = useCart()
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b border-ambre/20 sticky top-0 z-40"
        style={{ backgroundColor: "#1A1A1A" }}>
        <div className="flex items-center gap-3">
          {!isHome && (
            <button onClick={() => navigate(-1)}
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
          {/* Bouton panier */}
          <button onClick={() => setCartOpen(true)}
            className="relative text-creme/70 hover:text-ambre transition-colors">
            <span className="text-xl">🛒</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-ambre text-noir text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          {user ? (
            <>
              <span className="text-creme/70 text-sm hidden md:block">{user.email}</span>
              <button onClick={() => navigate("/vendeur")}
                className="border border-ambre/40 text-ambre font-bold px-4 py-2 rounded-xl text-sm hover:border-ambre transition-colors">
                Ma boutique
              </button>
              <button onClick={onSignOut}
                className="bg-ambre text-noir font-bold px-4 py-2 rounded-xl text-sm hover:bg-or transition-colors">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/connexion")}
                className="text-creme/70 text-sm hover:text-ambre transition-colors">
                Connexion
              </button>
              <button onClick={() => navigate("/connexion")}
                className="bg-ambre text-noir font-bold px-4 py-2 rounded-xl text-sm hover:bg-or transition-colors">
                S'inscrire
              </button>
            </>
          )}
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}