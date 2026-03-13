import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import Header from "../components/Header"

interface BoutiquesPageProps {
  user: User | null
  onSignOut: () => void
}

export default function BoutiquesPage({ user, onSignOut }: BoutiquesPageProps) {
  const navigate = useNavigate()
  const [boutiques, setBoutiques] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from("boutiques")
      .select("*")
      .eq("actif", true)
      .then(({ data }) => {
        setBoutiques(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1A1A" }}>
      <Header user={user} onSignOut={onSignOut} />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="font-playfair text-3xl font-black text-creme mb-2">
          Toutes les boutiques
        </h2>
        <p className="text-creme/50 text-sm mb-8">
          {boutiques.length} boutique{boutiques.length > 1 ? "s" : ""} disponible{boutiques.length > 1 ? "s" : ""}
        </p>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-ambre animate-pulse font-playfair text-xl">Chargement...</p>
          </div>
        ) : boutiques.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏪</p>
            <p className="text-creme/50">Aucune boutique pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {boutiques.map(b => (
              <div
                key={b.id}
                onClick={() => navigate(`/boutique/${b.id}`)}
                className="bg-gris border border-ambre/10 hover:border-ambre/40 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105"
              >
                {/* Banner */}
                <div className="h-32 flex items-center justify-center"
                  style={{ backgroundColor: "#2A2A2A" }}>
                  <span className="text-5xl">🏪</span>
                </div>
                <div className="p-4">
                  <h3 className="font-playfair text-xl font-bold text-creme mb-1">
                    {b.nom}
                  </h3>
                  <p className="text-creme/50 text-sm mb-3 line-clamp-2">
                    {b.description || "Bienvenue dans notre boutique !"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-ambre text-xs font-medium">
                      📍 {b.ville}
                    </span>
                    <span className="text-ambre text-xs font-bold">
                      Voir →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}