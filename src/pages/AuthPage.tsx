import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nom, setNom] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { nom } }
        })
        if (error) throw error
        setError("✅ Vérifie ta boîte mail pour confirmer ton compte !")
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#1A1A1A" }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-playfair text-5xl font-black text-ambre">
            Le Square
          </h1>
          <p className="text-creme opacity-60 text-sm mt-2">
            C'est propre, c'est pro, c'est nous !
          </p>
        </div>

        {/* Card */}
        <div className="bg-gris rounded-2xl p-8 border border-ambre/20">
          <h2 className="font-playfair text-2xl font-bold text-creme mb-1">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h2>
          <p className="text-creme/50 text-sm mb-6">
            {mode === "login" ? "Content de te revoir !" : "Rejoins Le Square 🛍️"}
          </p>

          <form onSubmit={handle} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-creme/70 text-sm mb-1.5">Nom complet</label>
                <input
                  type="text"
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="Ton nom"
                  className="w-full bg-noir border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-creme/70 text-sm mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full bg-noir border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm"
              />
            </div>

            <div>
              <label className="block text-creme/70 text-sm mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-noir border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm"
              />
            </div>

            {error && (
              <p className={`text-sm text-center px-3 py-2 rounded-xl ${error.startsWith("✅") ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>
                {error}
              </p>
            )}
{mode === "login" && (
  <p className="text-right">
    <button type="button" className="text-ambre text-sm hover:underline">
      Mot de passe oublié ?
    </button>
  </p>
)}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ambre hover:bg-or text-noir font-bold py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 text-sm"
            >
              {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-ambre/10 text-center text-sm text-creme/40">
            {mode === "login" ? (
              <>Pas encore de compte ?{" "}
                <button onClick={() => { setMode("signup"); setError("") }}
                  className="text-ambre font-bold hover:underline">
                  S'inscrire
                </button>
              </>
            ) : (
              <>Déjà un compte ?{" "}
                <button onClick={() => { setMode("login"); setError("") }}
                  className="text-ambre font-bold hover:underline">
                  Se connecter
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}