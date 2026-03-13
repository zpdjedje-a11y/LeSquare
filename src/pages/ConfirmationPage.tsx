import { useSearchParams, useNavigate } from "react-router-dom"
import type { User } from "@supabase/supabase-js"
import Header from "../components/Header"

interface ConfirmationPageProps {
  user: User | null
  onSignOut: () => void
}

export default function ConfirmationPage({ user, onSignOut }: ConfirmationPageProps) {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const num = params.get("num") || ""
  const tel = params.get("tel") || ""
  const wa = params.get("wa") || ""
  const boutique = params.get("boutique") || ""

  const whatsappUrl = "https://wa.me/?text=" + wa

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1A1A" }}>
      <Header user={user} onSignOut={onSignOut} />

      <div className="max-w-lg mx-auto px-6 py-12 text-center">
        <p className="text-6xl mb-4">🎉</p>
        <h2 className="font-playfair text-3xl font-black text-creme mb-2">
          Commande confirmée !
        </h2>
        <p className="text-creme/50 mb-6">
          Merci pour ta commande chez{" "}
          <span className="text-ambre">{boutique}</span>
        </p>

        {/* Numéro commande */}
        <div className="bg-gris border border-ambre/20 rounded-2xl p-6 mb-6">
          <p className="text-creme/50 text-sm mb-1">Ton numéro de commande</p>
          <p className="font-playfair text-3xl font-black text-ambre">#{num}</p>
          <p className="text-creme/40 text-xs mt-2">
            Garde ce numéro pour suivre ta commande
          </p>
        </div>

        {/* SMS info */}
        <div className="bg-gris border border-ambre/10 rounded-2xl p-4 mb-6 text-left">
          <p className="text-creme text-sm font-bold mb-1">
            📱 SMS envoyé au {tel}
          </p>
          <p className="text-creme/50 text-xs">
            Tu recevras un SMS avec ton numéro de commande
            et les instructions de paiement
          </p>
        </div>

        {/* WhatsApp */}
        <button
          onClick={() => window.open(whatsappUrl, "_blank")}
          className="flex items-center justify-center gap-3 w-full font-bold py-4 rounded-xl transition-colors mb-4"
          style={{ backgroundColor: "#25D366", color: "#fff" }}
        >
          <span className="text-xl">💬</span>
          Partager sur WhatsApp
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full border border-ambre/30 text-ambre font-bold py-3 rounded-xl hover:border-ambre transition-colors text-sm">
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}