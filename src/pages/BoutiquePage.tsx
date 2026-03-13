import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import Header from "../components/Header"
import { useCart } from "../lib/cartContext"

interface BoutiquePageProps {
  user: User | null
  onSignOut: () => void
}

export default function BoutiquePage({ user, onSignOut }: BoutiquePageProps) {
  const { id } = useParams()
  const { addItem, clearCart } = useCart()
  const [boutique, setBoutique] = useState<any>(null)
  const [produits, setProduits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [conflictModal, setConflictModal] = useState(false)
  const [pendingItem, setPendingItem] = useState<any>(null)
  const [added, setAdded] = useState<string | null>(null)

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

  const getImageUrl = (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  const handleAddToCart = (produit: any) => {
    if (!boutique) return
    const item = {
      id: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      image_path: produit.image_path,
      boutique_id: boutique.id,
      boutique_nom: boutique.nom,
    }
    const result = addItem(item)
    if (result === "conflict") {
      setPendingItem(item)
      setConflictModal(true)
    } else {
      setAdded(produit.id)
      setTimeout(() => setAdded(null), 1500)
    }
  }

  const handleConflictConfirm = () => {
    clearCart()
    if (pendingItem) {
      addItem(pendingItem)
      setAdded(pendingItem.id)
      setTimeout(() => setAdded(null), 1500)
    }
    setConflictModal(false)
    setPendingItem(null)
  }

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
        {boutique.banner_path ? (
          <img src={getImageUrl("boutiques", boutique.banner_path)}
            className="w-full h-full object-cover" />
        ) : (
          <span className="text-7xl">🏪</span>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Infos boutique */}
        <div className="mb-8">
          <h2 className="font-playfair text-3xl font-black text-creme mb-1">
            {boutique.nom}
          </h2>
          {boutique.nom_vendeur && (
            <p className="text-ambre/70 text-sm mb-1">par {boutique.nom_vendeur}</p>
          )}
          <p className="text-creme/50 mb-1">
            {boutique.description || "Bienvenue dans notre boutique !"}
          </p>
          <p className="text-ambre text-sm">📍 {boutique.ville}</p>
        </div>

        {/* Liste produits */}
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
              <div key={p.id}
                className="bg-gris border border-ambre/10 hover:border-ambre/40 rounded-2xl overflow-hidden transition-all">
                <div className="h-40 flex items-center justify-center"
                  style={{ backgroundColor: "#2A2A2A" }}>
                  {p.image_path ? (
                    <img src={getImageUrl("produits", p.image_path)}
                      className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🛍️</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-creme text-sm font-medium mb-1">{p.nom}</p>
                  {p.description && (
                    <p className="text-creme/40 text-xs mb-2 line-clamp-2">{p.description}</p>
                  )}
                  <p className="text-ambre font-bold text-sm mb-2">
                    {p.prix.toLocaleString("fr-FR")} FCFA
                  </p>
                  <button
                    onClick={() => handleAddToCart(p)}
                    className={`w-full font-bold py-2 rounded-xl text-xs transition-all ${
                      added === p.id
                        ? "bg-green-500 text-white"
                        : "bg-ambre text-noir hover:bg-or"
                    }`}>
                    {added === p.id ? "✓ Ajouté !" : "Ajouter au panier"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal conflit boutique */}
      {conflictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6 border border-ambre/20"
            style={{ backgroundColor: "#2A2A2A" }}>
            <p className="text-3xl text-center mb-3">⚠️</p>
            <h3 className="font-playfair text-xl font-bold text-creme text-center mb-2">
              Panier d'une autre boutique
            </h3>
            <p className="text-creme/50 text-sm text-center mb-6">
              Ton panier contient des produits d'une autre boutique.
              Vider le panier et continuer ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setConflictModal(false); setPendingItem(null) }}
                className="flex-1 border border-ambre/20 text-creme/70 py-3 rounded-xl text-sm hover:border-ambre/40">
                Annuler
              </button>
              <button
                onClick={handleConflictConfirm}
                className="flex-1 bg-ambre text-noir font-bold py-3 rounded-xl text-sm hover:bg-or">
                Vider et continuer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}