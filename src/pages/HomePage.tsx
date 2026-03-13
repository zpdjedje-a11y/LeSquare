import { useNavigate } from "react-router-dom"
import type { User } from "@supabase/supabase-js"
import Header from "../components/Header"

interface HomePageProps {
  user: User | null
  onSignOut: () => void
  villeChoisie: string | null
  onChangeVille: () => void
}

export default function HomePage({ user, onSignOut, villeChoisie, onChangeVille }: HomePageProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1A1A" }}>

      <Header user={user} onSignOut={onSignOut} />

      {/* Hero */}
<section className="px-6 py-8 text-center max-w-2xl mx-auto">
  <p className="text-creme/60 text-2xl mb-2">
    Achetez et vendez des produits de qualité
  </p>
  <h2 className="font-playfair text-6xl font-black text-ambre mb-2">
    Le Square
  </h2>
  <p className="text-creme/60 text-lg mb-5">
    C'est propre, c'est pro, c'est nous !
  </p>

  {villeChoisie && (
    <div className="flex items-center justify-center gap-2 mb-6">
      <span className="bg-ambre/10 border border-ambre/30 text-ambre text-sm px-4 py-1.5 rounded-full">
        📍 {villeChoisie}
      </span>
      <button onClick={onChangeVille}
        className="text-creme/40 text-xs hover:text-creme/60 transition-colors underline">
        Changer
      </button>
    </div>
  )}

  <div className="flex gap-3 justify-center">
    <button
      onClick={() => navigate("/boutiques")}
      className="bg-ambre text-noir font-bold px-6 py-3 rounded-xl hover:bg-or transition-colors">
      Explorer les boutiques
    </button>
    <button
      onClick={() => navigate(user ? "/vendeur" : "/connexion")}
      className="border border-ambre/40 text-ambre font-bold px-6 py-3 rounded-xl hover:border-ambre transition-colors">
      Ouvrir ma boutique
    </button>
  </div>
</section>

      {/* Catégories */}
      <section className="px-6 py-8 max-w-4xl mx-auto">
        <h3 className="font-playfair text-2xl font-bold text-creme mb-6">
          Catégories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { nom: "Mode", emoji: "👗" },
            { nom: "Électronique", emoji: "📱" },
            { nom: "Beauté", emoji: "💄" },
            { nom: "Maison", emoji: "🏠" },
            { nom: "Alimentation", emoji: "🍎" },
            { nom: "Sport", emoji: "⚽" },
            { nom: "Enfants", emoji: "🧸" },
            { nom: "Services", emoji: "🔧" },
          ].map(cat => (
            <button
              key={cat.nom}
              className="bg-gris border border-ambre/10 hover:border-ambre/40 rounded-2xl p-4 text-center transition-all hover:scale-105"
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <p className="text-creme/80 text-sm font-medium">{cat.nom}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Produits vedettes */}
      <section className="px-6 py-8 max-w-4xl mx-auto">
        <h3 className="font-playfair text-2xl font-bold text-creme mb-6">
          Produits vedettes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="bg-gris border border-ambre/10 rounded-2xl overflow-hidden hover:border-ambre/40 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="h-40 flex items-center justify-center" style={{ backgroundColor: "#2A2A2A" }}>
                <span className="text-4xl">🛍️</span>
              </div>
              <div className="p-3">
                <p className="text-creme text-sm font-medium mb-1">Produit {i}</p>
                <p className="text-creme/50 text-xs mb-2">Boutique Exemple</p>
                <p className="text-ambre font-bold text-sm">5 000 FCFA</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}