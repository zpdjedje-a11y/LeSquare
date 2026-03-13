import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import Header from "../components/Header"
import CitySearch from "../components/CitySearch"

interface VendeurPageProps {
  user: User | null
  onSignOut: () => void
}

export default function VendeurPage({ user, onSignOut }: VendeurPageProps) {
  const navigate = useNavigate()
  const [onglet, setOnglet] = useState<"boutique" | "produits" | "commandes">("boutique")
  const [boutique, setBoutique] = useState<any>(null)
  const [produits, setProduits] = useState<any[]>([])
  const [commandes, setCommandes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Form boutique
  const [nomBoutique, setNomBoutique] = useState("")
  const [nomVendeur, setNomVendeur] = useState("")
  const [descBoutique, setDescBoutique] = useState("")
  const [villeBoutique, setVilleBoutique] = useState("Abidjan")
  const [categorieBoutique, setCategorieBoutique] = useState("")
  const [logoBoutique, setLogoBoutique] = useState<File | null>(null)
  const [bannerBoutique, setBannerBoutique] = useState<File | null>(null)
  const [savingBoutique, setSavingBoutique] = useState(false)

  // Form produit
  const [showAddProduit, setShowAddProduit] = useState(false)
  const [nomProduit, setNomProduit] = useState("")
  const [descProduit, setDescProduit] = useState("")
  const [prixProduit, setPrixProduit] = useState("")
  const [stockProduit, setStockProduit] = useState("")
  const [categorieProduit, setCategorieProduit] = useState("")
  const [imageProduit, setImageProduit] = useState<File | null>(null)
  const [savingProduit, setSavingProduit] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!user) { navigate("/connexion"); return }
    chargerDonnees()
  }, [user])

  const chargerDonnees = async () => {
    const { data: b } = await supabase
      .from("boutiques")
      .select("*")
      .eq("vendor_id", user!.id)
      .single()

    if (b) {
      setBoutique(b)
      setNomBoutique(b.nom)
      setNomVendeur(b.nom_vendeur || "")
      setDescBoutique(b.description || "")
      setVilleBoutique(b.ville || "Abidjan")
      setCategorieBoutique(b.categorie || "")

      const { data: p } = await supabase
        .from("produits")
        .select("*")
        .eq("boutique_id", b.id)

      const { data: c } = await supabase
        .from("commandes")
        .select("*, commande_items(*)")
        .eq("boutique_id", b.id)
        .order("created_at", { ascending: false })

      setProduits(p || [])
      setCommandes(c || [])
    }
    setLoading(false)
  }

  const uploadImage = async (bucket: string, file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true })
    if (error) throw error
    return data.path
  }

  const getImageUrl = (bucket: string, path: string) => {
    if (!path) return null
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  const sauvegarderBoutique = async () => {
    if (!nomBoutique.trim()) { setError("Le nom est obligatoire"); return }
    setSavingBoutique(true)
    setError("")
    try {
      let logoPath = boutique?.logo_path || null
      let bannerPath = boutique?.banner_path || null

      if (logoBoutique) {
        logoPath = await uploadImage("boutiques", logoBoutique, `${user!.id}/logo`)
      }
      if (bannerBoutique) {
        bannerPath = await uploadImage("boutiques", bannerBoutique, `${user!.id}/banner`)
      }

      if (boutique) {
        await supabase.from("boutiques").update({
          nom: nomBoutique,
          nom_vendeur: nomVendeur,
          description: descBoutique,
          ville: villeBoutique,
          categorie: categorieBoutique,
          logo_path: logoPath,
          banner_path: bannerPath,
        }).eq("id", boutique.id)
      } else {
        await supabase.from("boutiques").insert({
          vendor_id: user!.id,
          nom: nomBoutique,
          nom_vendeur: nomVendeur,
          description: descBoutique,
          ville: villeBoutique,
          categorie: categorieBoutique,
          logo_path: logoPath,
          banner_path: bannerPath,
        })
      }

      setSuccess("Boutique sauvegardée ✅")
      await chargerDonnees()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSavingBoutique(false)
    }
  }

  const ajouterProduit = async () => {
    if (!boutique) { setError("Crée ta boutique d'abord !"); return }
    if (!nomProduit.trim() || !prixProduit) { setError("Nom et prix obligatoires"); return }
    setSavingProduit(true)
    setError("")
    try {
      let imagePath = null
      if (imageProduit) {
        imagePath = await uploadImage("produits", imageProduit, `${user!.id}/${Date.now()}`)
      }

      await supabase.from("produits").insert({
        boutique_id: boutique.id,
        nom: nomProduit,
        description: descProduit,
        prix: parseInt(prixProduit),
        stock: parseInt(stockProduit) || 0,
        categorie: categorieProduit,
        image_path: imagePath,
      })

      setSuccess("Produit ajouté ✅")
      setShowAddProduit(false)
      setNomProduit(""); setDescProduit(""); setPrixProduit("")
      setStockProduit(""); setCategorieProduit(""); setImageProduit(null)
      await chargerDonnees()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSavingProduit(false)
    }
  }

  const supprimerProduit = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return
    await supabase.from("produits").delete().eq("id", id)
    await chargerDonnees()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1A1A1A" }}>
      <p className="text-ambre animate-pulse font-playfair text-xl">Chargement...</p>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1A1A" }}>
      <Header user={user} onSignOut={onSignOut} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="font-playfair text-3xl font-black text-creme mb-6">
          Mon espace vendeur
        </h2>

        {/* Onglets */}
        <div className="flex gap-2 mb-8 border-b border-ambre/20">
          {[
            { key: "boutique", label: "🏪 Ma boutique" },
            { key: "produits", label: "📦 Mes produits" },
            { key: "commandes", label: "🛒 Commandes" },
          ].map(o => (
            <button
              key={o.key}
              onClick={() => { setOnglet(o.key as any); setError(""); setSuccess("") }}
              className={`px-4 py-3 text-sm font-bold transition-all border-b-2 -mb-px ${
                onglet === o.key
                  ? "border-ambre text-ambre"
                  : "border-transparent text-creme/50 hover:text-creme"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 bg-red-400/10 px-4 py-2 rounded-xl text-sm mb-4">{error}</p>}
        {success && <p className="text-green-400 bg-green-400/10 px-4 py-2 rounded-xl text-sm mb-4">{success}</p>}

        {/* ONGLET BOUTIQUE */}
        {onglet === "boutique" && (
          <div className="bg-gris rounded-2xl p-6 border border-ambre/10 space-y-4">
            <h3 className="font-playfair text-xl font-bold text-creme">
              {boutique ? "Modifier ma boutique" : "Créer ma boutique"}
            </h3>

            {/* Banner preview */}
            <div>
              <label className="block text-creme/70 text-sm mb-2">Bannière</label>
              <div className="h-32 rounded-xl overflow-hidden border border-ambre/20 flex items-center justify-center mb-2"
                style={{ backgroundColor: "#2A2A2A" }}>
                {bannerBoutique ? (
                  <img src={URL.createObjectURL(bannerBoutique)} className="w-full h-full object-cover" />
                ) : boutique?.banner_path ? (
                  <img src={getImageUrl("boutiques", boutique.banner_path)!} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-creme/30 text-sm">Aucune bannière</span>
                )}
              </div>
              <input type="file" accept="image/*"
                onChange={e => setBannerBoutique(e.target.files?.[0] || null)}
                className="text-creme/50 text-xs" />
            </div>

            {/* Logo preview */}
            <div>
              <label className="block text-creme/70 text-sm mb-2">Logo</label>
              <div className="w-20 h-20 rounded-full overflow-hidden border border-ambre/20 flex items-center justify-center mb-2"
                style={{ backgroundColor: "#2A2A2A" }}>
                {logoBoutique ? (
                  <img src={URL.createObjectURL(logoBoutique)} className="w-full h-full object-cover" />
                ) : boutique?.logo_path ? (
                  <img src={getImageUrl("boutiques", boutique.logo_path)!} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🏪</span>
                )}
              </div>
              <input type="file" accept="image/*"
                onChange={e => setLogoBoutique(e.target.files?.[0] || null)}
                className="text-creme/50 text-xs" />
            </div>

            <div>
              <label className="block text-creme/70 text-sm mb-1.5">Nom de la boutique *</label>
              <input value={nomBoutique} onChange={e => setNomBoutique(e.target.value)}
                placeholder="Ex: Boutique Aminata"
                className="w-full bg-noir border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm" />
            </div>
            <div>
  <label className="block text-creme/70 text-sm mb-1.5">Nom du vendeur *</label>
  <input value={nomVendeur} onChange={e => setNomVendeur(e.target.value)}
    placeholder="Ex: Aminata Koné"
    className="w-full bg-noir border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm" />
</div>

            <div>
              <label className="block text-creme/70 text-sm mb-1.5">Description</label>
              <textarea value={descBoutique} onChange={e => setDescBoutique(e.target.value)}
                placeholder="Décris ta boutique..."
                rows={3}
                className="w-full bg-noir border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
  <label className="block text-creme/70 text-sm mb-1.5">Ville</label>
  <CitySearch value={villeBoutique} onChange={setVilleBoutique} />
</div>
              <div>
                <label className="block text-creme/70 text-sm mb-1.5">Catégorie</label>
                <select value={categorieBoutique} onChange={e => setCategorieBoutique(e.target.value)}
                  className="w-full bg-noir border border-ambre/20 rounded-xl px-4 py-3 text-creme focus:outline-none focus:border-ambre text-sm">
                  <option value="">Choisir...</option>
                  <option>Mode</option>
                  <option>Électronique</option>
                  <option>Beauté</option>
                  <option>Maison</option>
                  <option>Alimentation</option>
                  <option>Sport</option>
                  <option>Enfants</option>
                  <option>Services</option>
                </select>
              </div>
            </div>

            <button onClick={sauvegarderBoutique} disabled={savingBoutique}
              className="w-full bg-ambre text-noir font-bold py-3.5 rounded-xl hover:bg-or transition-all disabled:opacity-50">
              {savingBoutique ? "Sauvegarde..." : boutique ? "Mettre à jour" : "Créer ma boutique"}
            </button>

            {boutique && (
              <button onClick={() => navigate(`/boutique/${boutique.id}`)}
                className="w-full border border-ambre/40 text-ambre font-bold py-3 rounded-xl hover:border-ambre transition-all text-sm">
                Voir ma boutique →
              </button>
            )}
          </div>
        )}

        {/* ONGLET PRODUITS */}
        {onglet === "produits" && (
          <div>
            {!boutique ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🏪</p>
                <p className="text-creme/50 mb-4">Crée ta boutique d'abord !</p>
                <button onClick={() => setOnglet("boutique")}
                  className="bg-ambre text-noir font-bold px-6 py-3 rounded-xl hover:bg-or transition-colors">
                  Créer ma boutique
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-creme/50 text-sm">{produits.length} produit{produits.length > 1 ? "s" : ""}</p>
                  <button onClick={() => setShowAddProduit(!showAddProduit)}
                    className="bg-ambre text-noir font-bold px-4 py-2 rounded-xl text-sm hover:bg-or transition-colors">
                    + Ajouter un produit
                  </button>
                </div>

                {/* Formulaire ajout produit */}
                {showAddProduit && (
                  <div className="bg-gris rounded-2xl p-6 border border-ambre/20 mb-6 space-y-4">
                    <h3 className="font-playfair text-xl font-bold text-creme">Nouveau produit</h3>

                    <div>
                      <label className="block text-creme/70 text-sm mb-2">Photo du produit</label>
                      <div className="h-40 rounded-xl overflow-hidden border border-ambre/20 flex items-center justify-center mb-2"
                        style={{ backgroundColor: "#2A2A2A" }}>
                        {imageProduit ? (
                          <img src={URL.createObjectURL(imageProduit)} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl">📷</span>
                        )}
                      </div>
                      <input type="file" accept="image/*"
                        onChange={e => setImageProduit(e.target.files?.[0] || null)}
                        className="text-creme/50 text-xs" />
                    </div>

                    <div>
                      <label className="block text-creme/70 text-sm mb-1.5">Nom du produit *</label>
                      <input value={nomProduit} onChange={e => setNomProduit(e.target.value)}
                        placeholder="Ex: Robe wax bleue"
                        className="w-full bg-noir border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm" />
                    </div>

                    <div>
                      <label className="block text-creme/70 text-sm mb-1.5">Description</label>
                      <textarea value={descProduit} onChange={e => setDescProduit(e.target.value)}
                        placeholder="Décris ton produit..."
                        rows={2}
                        className="w-full bg-noir border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-creme/70 text-sm mb-1.5">Prix (FCFA) *</label>
                        <input type="number" value={prixProduit} onChange={e => setPrixProduit(e.target.value)}
                          placeholder="5000"
                          className="w-full bg-noir border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm" />
                      </div>
                      <div>
                        <label className="block text-creme/70 text-sm mb-1.5">Stock</label>
                        <input type="number" value={stockProduit} onChange={e => setStockProduit(e.target.value)}
                          placeholder="10"
                          className="w-full bg-noir border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-creme/70 text-sm mb-1.5">Catégorie</label>
                      <select value={categorieProduit} onChange={e => setCategorieProduit(e.target.value)}
                        className="w-full bg-noir border border-ambre/20 rounded-xl px-4 py-3 text-creme focus:outline-none focus:border-ambre text-sm">
                        <option value="">Choisir...</option>
                        <option>Mode</option>
                        <option>Électronique</option>
                        <option>Beauté</option>
                        <option>Maison</option>
                        <option>Alimentation</option>
                        <option>Sport</option>
                        <option>Enfants</option>
                        <option>Services</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={ajouterProduit} disabled={savingProduit}
                        className="flex-1 bg-ambre text-noir font-bold py-3 rounded-xl hover:bg-or transition-all disabled:opacity-50 text-sm">
                        {savingProduit ? "Ajout..." : "Ajouter le produit"}
                      </button>
                      <button onClick={() => setShowAddProduit(false)}
                        className="px-4 border border-ambre/20 text-creme/50 rounded-xl hover:border-ambre/40 text-sm">
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {/* Liste produits */}
                {produits.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-5xl mb-4">📦</p>
                    <p className="text-creme/50">Aucun produit — ajoute ton premier !</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {produits.map(p => (
                      <div key={p.id}
                        className="bg-gris border border-ambre/10 rounded-2xl overflow-hidden">
                        <div className="h-36 flex items-center justify-center"
                          style={{ backgroundColor: "#2A2A2A" }}>
                          {p.image_path ? (
                            <img src={getImageUrl("produits", p.image_path)!}
                              className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">🛍️</span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-creme text-sm font-medium mb-1 truncate">{p.nom}</p>
                          <p className="text-ambre font-bold text-sm mb-1">
                            {p.prix.toLocaleString("fr-FR")} FCFA
                          </p>
                          <p className="text-creme/40 text-xs mb-2">Stock: {p.stock}</p>
                          <button onClick={() => supprimerProduit(p.id)}
                            className="w-full border border-red-400/30 text-red-400 text-xs py-1.5 rounded-lg hover:border-red-400/60 transition-colors">
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ONGLET COMMANDES */}
        {onglet === "commandes" && (
          <div>
            {commandes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🛒</p>
                <p className="text-creme/50">Aucune commande pour le moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {commandes.map(c => (
                  <div key={c.id}
                    className="bg-gris border border-ambre/10 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-creme font-bold text-sm">
                        #{c.id.slice(0, 8).toUpperCase()}
                      </p>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        c.statut === "livree" ? "bg-green-400/20 text-green-400" :
                        c.statut === "en_cours" ? "bg-blue-400/20 text-blue-400" :
                        "bg-ambre/20 text-ambre"
                      }`}>
                        {c.statut.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-creme/60 text-sm">{c.nom_client} — {c.telephone_client}</p>
                    <p className="text-ambre font-bold text-sm mt-1">
                      {c.total.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}