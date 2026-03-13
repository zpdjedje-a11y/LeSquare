import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { useCart } from "../lib/cartContext"
import Header from "../components/Header"

interface CommandePageProps {
  user: User | null
  onSignOut: () => void
}

const PAIEMENTS = [
  { id: "wave", label: "Wave", emoji: "🌊", couleur: "#1BA8F0" },
  { id: "orange", label: "Orange Money", emoji: "🟠", couleur: "#FF6600" },
  { id: "mtn", label: "MTN Mobile Money", emoji: "🟡", couleur: "#FFC200" },
]

export default function CommandePage({ user, onSignOut }: CommandePageProps) {
  const navigate = useNavigate()
  const { items, total, boutiqueId, boutiqueNom, clearCart } = useCart()

  const [nom, setNom] = useState(user?.user_metadata?.nom || "")
  const [telephone, setTelephone] = useState("")
  const [adresse, setAdresse] = useState("")
  const [paiement, setPaiement] = useState("wave")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#1A1A1A" }}>
        <Header user={user} onSignOut={onSignOut} />
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-creme/50 mb-4">Ton panier est vide</p>
          <button onClick={() => navigate("/boutiques")}
            className="bg-ambre text-noir font-bold px-6 py-3 rounded-xl hover:bg-or transition-colors">
            Explorer les boutiques
          </button>
        </div>
      </div>
    )
  }

  const handleCommander = async () => {
    if (!nom.trim()) { setError("Ton nom est obligatoire"); return }
    if (!telephone.trim()) { setError("Ton téléphone est obligatoire"); return }
    if (telephone.length < 8) { setError("Numéro de téléphone invalide"); return }

    setLoading(true)
    setError("")

    try {
      // Créer la commande
      const { data: commande, error: errCommande } = await supabase
        .from("commandes")
        .insert({
          acheteur_id: user?.id || null,
          boutique_id: boutiqueId,
          total,
          nom_client: nom,
          telephone_client: telephone,
          adresse_livraison: adresse,
          statut: "en_attente",
        })
        .select()
        .single()

      if (errCommande) throw errCommande

      // Créer les items
      await supabase.from("commande_items").insert(
        items.map(item => ({
          commande_id: commande.id,
          produit_id: item.id,
          quantite: item.quantite,
          prix_unitaire: item.prix,
        }))
      )

      // Numéro de commande court
      const numCommande = commande.id.slice(0, 8).toUpperCase()

      // Message WhatsApp
      const lignes = items.map(i => `• ${i.nom} x${i.quantite} — ${(i.prix * i.quantite).toLocaleString("fr-FR")} FCFA`).join("\n")
      const message = encodeURIComponent(
        `🛍️ Nouvelle commande #${numCommande}\n` +
        `Boutique: ${boutiqueNom}\n\n` +
        `${lignes}\n\n` +
        `💰 Total: ${total.toLocaleString("fr-FR")} FCFA\n` +
        `💳 Paiement: ${PAIEMENTS.find(p => p.id === paiement)?.label}\n\n` +
        `👤 ${nom} — 📞 ${telephone}\n` +
        (adresse ? `📍 ${adresse}` : "")
      )

      clearCart()

      // Rediriger vers confirmation
      navigate(`/confirmation?num=${numCommande}&tel=${telephone}&wa=${message}&boutique=${boutiqueNom}`)

    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1A1A" }}>
      <Header user={user} onSignOut={onSignOut} />

      <div className="max-w-lg mx-auto px-6 py-8">
        <h2 className="font-playfair text-3xl font-black text-creme mb-2">
          Ma commande
        </h2>
        <p className="text-ambre text-sm mb-8">🏪 {boutiqueNom}</p>

        {/* Récap panier */}
        <div className="bg-gris rounded-2xl p-4 border border-ambre/10 mb-6">
          <h3 className="text-creme font-bold text-sm mb-3">Récapitulatif</h3>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-creme/70">{item.nom} × {item.quantite}</span>
                <span className="text-creme">{(item.prix * item.quantite).toLocaleString("fr-FR")} FCFA</span>
              </div>
            ))}
          </div>
          <div className="border-t border-ambre/20 mt-3 pt-3 flex justify-between">
            <span className="text-creme font-bold">Total</span>
            <span className="text-ambre font-black text-lg">{total.toLocaleString("fr-FR")} FCFA</span>
          </div>
        </div>

        {/* Infos client */}
        <div className="space-y-4 mb-6">
          <h3 className="text-creme font-bold">Tes informations</h3>

          <div>
            <label className="block text-creme/70 text-sm mb-1.5">Nom complet *</label>
            <input value={nom} onChange={e => setNom(e.target.value)}
              placeholder="Ton nom"
              className="w-full bg-gris border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm" />
          </div>

          <div>
            <label className="block text-creme/70 text-sm mb-1.5">Téléphone *</label>
            <input value={telephone} onChange={e => setTelephone(e.target.value)}
              placeholder="07 XX XX XX XX"
              type="tel"
              className="w-full bg-gris border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm" />
          </div>

          <div>
            <label className="block text-creme/70 text-sm mb-1.5">Adresse de livraison</label>
            <input value={adresse} onChange={e => setAdresse(e.target.value)}
              placeholder="Quartier, rue..."
              className="w-full bg-gris border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm" />
          </div>
        </div>

        {/* Choix paiement */}
        <div className="mb-6">
          <h3 className="text-creme font-bold mb-3">Mode de paiement</h3>
          <div className="space-y-3">
            {PAIEMENTS.map(p => (
              <button
                key={p.id}
                onClick={() => setPaiement(p.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  paiement === p.id
                    ? "border-ambre bg-ambre/10"
                    : "border-ambre/10 bg-gris hover:border-ambre/30"
                }`}>
                <span className="text-2xl">{p.emoji}</span>
                <span className="text-creme font-medium">{p.label}</span>
                {paiement === p.id && (
                  <span className="ml-auto text-ambre font-black">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-400 bg-red-400/10 px-4 py-2 rounded-xl text-sm mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleCommander}
          disabled={loading}
          className="w-full bg-ambre text-noir font-black py-4 rounded-xl hover:bg-or transition-all disabled:opacity-50 text-base">
          {loading ? "Traitement..." : `Commander — ${total.toLocaleString("fr-FR")} FCFA`}
        </button>
      </div>
    </div>
  )
}