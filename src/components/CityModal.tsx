import { useState } from "react"
import CitySearch from "./CitySearch"

interface CityModalProps {
  onSelect: (ville: string) => void
  onClose?: () => void
}

export default function CityModal({ onSelect, onClose }: CityModalProps) {
  const [ville, setVille] = useState("")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
      <div className="w-full max-w-sm rounded-2xl p-8 border border-ambre/20"
        style={{ backgroundColor: "#2A2A2A" }}>

        {onClose && (
          <button onClick={onClose}
            className="text-creme/40 hover:text-creme text-sm mb-4 flex items-center gap-1">
            ← Retour
          </button>
        )}

        <div className="text-center mb-6">
          <p className="text-4xl mb-3">📍</p>
          <h2 className="font-playfair text-2xl font-black text-creme mb-2">
            Où es-tu ?
          </h2>
          <p className="text-sm" style={{ color: "rgba(255,248,240,0.5)" }}>
            Choisis ta ville pour voir les boutiques près de chez toi
          </p>
        </div>

        <div className="mb-6">
          <CitySearch value={ville} onChange={setVille} placeholder="Tape ta ville..." />
        </div>

        <button
          onClick={() => ville && onSelect(ville)}
          disabled={!ville}
          className="w-full bg-ambre text-noir font-bold py-3.5 rounded-xl hover:bg-or transition-all disabled:opacity-40 text-sm">
          Voir les boutiques →
        </button>

        <button
          onClick={() => onSelect("Toutes")}
          className="w-full mt-3 text-sm transition-colors"
          style={{ color: "rgba(255,248,240,0.4)" }}>
          Voir toutes les villes
        </button>
      </div>
    </div>
  )
}