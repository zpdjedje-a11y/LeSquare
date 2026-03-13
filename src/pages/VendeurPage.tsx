import Header from "../components/Header"
import type { User } from "@supabase/supabase-js"

interface VendeurPageProps {
  user: User | null
  onSignOut: () => void
}

export default function VendeurPage({ user, onSignOut }: VendeurPageProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1A1A" }}>
      <Header user={user} onSignOut={onSignOut} />
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <p className="text-5xl mb-4">🏪</p>
        <h2 className="font-playfair text-3xl font-black text-creme mb-2">
          Mon espace vendeur
        </h2>
        <p className="text-creme/50">Bientôt disponible...</p>
      </div>
    </div>
  )
}