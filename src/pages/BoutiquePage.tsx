import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import Header from "../components/Header"

interface BoutiquePageProps {
  user: User | null
  onSignOut: () => void
}

export default function BoutiquePage({ user, onSignOut }: BoutiquePageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [boutique, setBoutique] = useState<any>(null)
  const [produits, setProduits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      supabase.from("boutiques").select("*").eq("id", id).single(),
      supabase.from("produits").select("*").eq("boutique_id", id).eq("actif", true)
    ]).then(([{ data: b }, { data: p }]) => {
      setBoutique(b)
      setProduits(p || [])
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#1A1A1A" }}>
      <p className="text-ambre animate-pulse font-playfair text-xl">Chargement...</p>
    </div>
  )

  if (!boutique) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#1A1A1A" }}>
      <p className="text-creme/50">Boutique introuvable</p>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1A1A" }}>
      <Header user={user} onSignOut={onSignOut} />

      {/* Banner boutique */}
      <div className="h-48 flex items-center justify-center"
        style={{ backgroundColor: "#2A2A2A" }}>
        <span className="text-7xl">🏪</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Infos boutique */}
        <div className="mb-8">
          <h2 className="font-playfair text-3xl font-black text-creme mb-2">
            {boutique.nom}
          </h2>
          <p className="text-creme/50 mb-1">
            {boutique.description || "Bienvenue dans notre boutique !"}
          </p>
          <p className="text-ambre text-sm">📍 {boutique.ville}</p>
        </div>

        {/* Produits */}
        <h3 className="font-playfair text-2xl font-bold text-creme mb-6">
          Nos produits ({produits.length})
        </h3>

        {produits.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-creme/50">Aucun produit pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {produits.map(p => (
              <div
                key={p.id}
                className="bg-gris border border-ambre/10 hover:border-ambre/40 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105"
              >
                <div className="h-40 flex items-center justify-center"
                  style={{ backgroundColor: "#2A2A2A" }}>
                  <span className="text-4xl">🛍️</span>
                </div>
                <div className="p-3">
                  <p className="text-creme text-sm font-medium mb-1">{p.nom}</p>
                  <p className="text-ambre font-bold text-sm">
                    {p.prix.toLocaleString("fr-FR")} FCFA
                  </p>
                  <button className="w-full mt-2 bg-ambre text-noir font-bold py-2 rounded-xl text-xs hover:bg-or transition-colors">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}