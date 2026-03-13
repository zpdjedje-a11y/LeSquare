import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import Header from "../components/Header"

interface HomePageProps {
  user: User | null
  onSignOut: () => void
  villeChoisie: string | null
  onChangeVille: () => void
}

export default function HomePage({ user, onSignOut, villeChoisie, onChangeVille }: HomePageProps) {
  const navigate = useNavigate()
  const [produits, setProduits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [recherche, setRecherche] = useState("")
  const [categorieActive, setCategorieActive] = useState("")

  const CATEGORIES = [
    { nom: "Tous", emoji: "🛍️" },
    { nom: "Mode", emoji: "👗" },
    { nom: "Électronique", emoji: "📱" },
    { nom: "Beauté", emoji: "💄" },
    { nom: "Maison", emoji: "🏠" },
    { nom: "Alimentation", emoji: "🍎" },
    { nom: "Sport", emoji: "⚽" },
    { nom: "Enfants", emoji: "🧸" },
    { nom: "Services", emoji: "🔧" },
  ]

  useEffect(() => {
    chargerProduits()
  }, [villeChoisie, categorieActive])

  const chargerProduits = async () => {
    setLoading(true)
    let query = supabase
      .from("produits")
      .select("*, boutiques(id, nom, ville)")
      .eq("actif", true)

    if (categorieActive && categorieActive !== "Tous") {
      query = query.eq("categorie", categorieActive)
    }

    if (villeChoisie && villeChoisie !== "Toutes") {
      query = query.eq("boutiques.ville", villeChoisie)
    }

    const { data } = await query.order("created_at", { ascending: false })
    setProduits(data?.filter(p => p.boutiques) || [])
    setLoading(false)
  }

  const getImageUrl = (path: string) => {
    const { data } = supabase.storage.from("produits").getPublicUrl(path)
    return data.publicUrl
  }

  const produitsFiltres = produits.filter(p =>
    recherche === "" ||
    p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    p.boutiques?.nom.toLowerCase().includes(recherche.toLowerCase())
  )

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

        <div className="flex gap-3 justify-center mb-8">
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

        {/* Barre de recherche */}
        <div className="relative max-w-md mx-auto">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-creme/40">🔍</span>
          <input
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            placeholder="Rechercher un produit ou une boutique..."
            className="w-full bg-gris border border-ambre/20 rounded-xl pl-10 pr-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm"
          />
        </div>
      </section>

      {/* Catégories */}
      <section className="px-6 pb-6 max-w-4xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.nom}
              onClick={() => setCategorieActive(cat.nom === "Tous" ? "" : cat.nom)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                (categorieActive === "" && cat.nom === "Tous") || categorieActive === cat.nom
                  ? "bg-ambre text-noir border-ambre"
                  : "border-ambre/20 text-creme/60 hover:border-ambre/40"
              }`}>
              <span>{cat.emoji}</span>
              <span>{cat.nom}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Produits */}
      <section className="px-6 py-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-playfair text-2xl font-bold text-creme">
            {recherche ? `Résultats pour "${recherche}"` : "Produits"}
          </h3>
          <p className="text-creme/40 text-sm">
            {produitsFiltres.length} produit{produitsFiltres.length > 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-ambre animate-pulse font-playfair text-xl">Chargement...</p>
          </div>
        ) : produitsFiltres.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-creme/50 mb-4">
              {recherche ? `Aucun résultat pour "${recherche}"` : "Aucun produit disponible"}
            </p>
            {villeChoisie && villeChoisie !== "Toutes" && (
              <button onClick={onChangeVille}
                className="text-ambre text-sm hover:underline">
                Essayer une autre ville ?
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {produitsFiltres.map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/boutique/${p.boutiques?.id}`)}
                className="bg-gris border border-ambre/10 rounded-2xl overflow-hidden hover:border-ambre/40 transition-all hover:scale-105 cursor-pointer"
              >
                <div className="h-40 flex items-center justify-center"
                  style={{ backgroundColor: "#2A2A2A" }}>
                  {p.image_path ? (
                    <img src={getImageUrl(p.image_path)}
                      className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🛍️</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-creme text-sm font-medium mb-1 truncate">{p.nom}</p>
                  <p className="text-ambre/70 text-xs mb-1 truncate">
                    🏪 {p.boutiques?.nom}
                  </p>
                  <p className="text-ambre font-bold text-sm">
                    {p.prix.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}