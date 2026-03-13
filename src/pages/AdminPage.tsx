import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { useAdmin } from "../hooks/useAdmin"
import Header from "../components/Header"

interface AdminPageProps {
  user: User | null
  onSignOut: () => void
}

export default function AdminPage({ user, onSignOut }: AdminPageProps) {
  const navigate = useNavigate()
  const { isAdmin, loading: adminLoading } = useAdmin(user)
  const [onglet, setOnglet] = useState<"stats" | "boutiques" | "commandes" | "users">("stats")
  const [boutiques, setBoutiques] = useState<any[]>([])
  const [commandes, setCommandes] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate("/connexion"); return }
    if (!adminLoading && !isAdmin) { navigate("/"); return }
    if (!adminLoading && isAdmin) chargerDonnees()
  }, [user, isAdmin, adminLoading])

  const chargerDonnees = async () => {
    const [{ data: b }, { data: c }, { data: u }] = await Promise.all([
      supabase.from("boutiques").select("*, profiles(email)").order("created_at", { ascending: false }),
      supabase.from("commandes").select("*, boutiques(nom)").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    ])
    setBoutiques(b || [])
    setCommandes(c || [])
    setUsers(u || [])
    setLoading(false)
  }

  const toggleBoutique = async (id: string, actif: boolean) => {
    await supabase.from("boutiques").update({ actif: !actif }).eq("id", id)
    await chargerDonnees()
  }

  const updateStatutCommande = async (id: string, statut: string) => {
    await supabase.from("commandes").update({ statut }).eq("id", id)
    await chargerDonnees()
  }

  if (adminLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1A1A1A" }}>
      <p className="text-ambre animate-pulse font-playfair text-xl">Chargement...</p>
    </div>
  )

  const totalVentes = commandes.reduce((sum, c) => sum + (c.total || 0), 0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1A1A" }}>
      <Header user={user} onSignOut={onSignOut} />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="font-playfair text-3xl font-black text-creme mb-2">
          👑 Administration
        </h2>
        <p className="text-creme/40 text-sm mb-8">Tableau de bord Le Square</p>

        {/* Onglets */}
        <div className="flex gap-2 mb-8 border-b border-ambre/20 overflow-x-auto">
          {[
            { key: "stats", label: "📊 Stats" },
            { key: "boutiques", label: "🏪 Boutiques" },
            { key: "commandes", label: "🛒 Commandes" },
            { key: "users", label: "👤 Utilisateurs" },
          ].map(o => (
            <button key={o.key}
              onClick={() => setOnglet(o.key as any)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-bold transition-all border-b-2 -mb-px ${
                onglet === o.key
                  ? "border-ambre text-ambre"
                  : "border-transparent text-creme/50 hover:text-creme"
              }`}>
              {o.label}
            </button>
          ))}
        </div>

        {/* STATS */}
        {onglet === "stats" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Boutiques", value: boutiques.length, emoji: "🏪" },
              { label: "Commandes", value: commandes.length, emoji: "🛒" },
              { label: "Utilisateurs", value: users.length, emoji: "👤" },
              { label: "Total ventes", value: `${totalVentes.toLocaleString("fr-FR")} F`, emoji: "💰" },
            ].map(stat => (
              <div key={stat.label}
                className="bg-gris border border-ambre/10 rounded-2xl p-5 text-center">
                <p className="text-3xl mb-2">{stat.emoji}</p>
                <p className="font-playfair text-2xl font-black text-ambre">{stat.value}</p>
                <p className="text-creme/50 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* BOUTIQUES */}
        {onglet === "boutiques" && (
          <div className="space-y-3">
            {boutiques.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🏪</p>
                <p className="text-creme/50">Aucune boutique</p>
              </div>
            ) : boutiques.map(b => (
              <div key={b.id}
                className="bg-gris border border-ambre/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-creme font-bold">{b.nom}</p>
                  <p className="text-creme/40 text-xs">{b.ville} • {b.profiles?.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    b.actif ? "bg-green-400/20 text-green-400" : "bg-red-400/20 text-red-400"
                  }`}>
                    {b.actif ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => toggleBoutique(b.id, b.actif)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                      b.actif
                        ? "border-red-400/30 text-red-400 hover:border-red-400/60"
                        : "border-green-400/30 text-green-400 hover:border-green-400/60"
                    }`}>
                    {b.actif ? "Désactiver" : "Activer"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMMANDES */}
        {onglet === "commandes" && (
          <div className="space-y-3">
            {commandes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🛒</p>
                <p className="text-creme/50">Aucune commande</p>
              </div>
            ) : commandes.map(c => (
              <div key={c.id}
                className="bg-gris border border-ambre/10 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-creme font-bold text-sm">
                    #{c.id.slice(0, 8).toUpperCase()}
                  </p>
                  <select
                    value={c.statut}
                    onChange={e => updateStatutCommande(c.id, e.target.value)}
                    className="bg-noir border border-ambre/20 rounded-lg px-2 py-1 text-creme text-xs focus:outline-none focus:border-ambre">
                    <option value="en_attente">En attente</option>
                    <option value="en_cours">En cours</option>
                    <option value="livree">Livrée</option>
                    <option value="annulee">Annulée</option>
                  </select>
                </div>
                <p className="text-creme/60 text-sm">{c.nom_client} — {c.telephone_client}</p>
                <p className="text-creme/40 text-xs">{c.boutiques?.nom}</p>
                <p className="text-ambre font-bold text-sm mt-1">
                  {c.total?.toLocaleString("fr-FR")} FCFA
                </p>
              </div>
            ))}
          </div>
        )}

        {/* USERS */}
        {onglet === "users" && (
          <div className="space-y-3">
            {users.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">👤</p>
                <p className="text-creme/50">Aucun utilisateur</p>
              </div>
            ) : users.map(u => (
              <div key={u.id}
                className="bg-gris border border-ambre/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-creme font-bold text-sm">{u.nom || "Sans nom"}</p>
                  <p className="text-creme/40 text-xs">{u.email}</p>
                </div>
                <span className="text-xs text-ambre/60">
                  {new Date(u.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}