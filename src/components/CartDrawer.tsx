import { useCart } from "../lib/cartContext"
import { useNavigate } from "react-router-dom"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantite, total, count, boutiqueNom, clearCart } = useCart()
  const navigate = useNavigate()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full flex flex-col"
        style={{ backgroundColor: "#1A1A1A" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ambre/20">
          <div>
            <h2 className="font-playfair text-xl font-black text-creme">Mon panier</h2>
            {boutiqueNom && (
              <p className="text-ambre text-xs">🏪 {boutiqueNom}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button onClick={clearCart}
                className="text-red-400 text-xs hover:underline">
                Vider
              </button>
            )}
            <button onClick={onClose}
              className="text-creme/50 hover:text-creme text-2xl">
              ×
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🛒</p>
              <p className="text-creme/50">Ton panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id}
                  className="flex gap-3 bg-gris rounded-xl p-3 border border-ambre/10">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: "#2A2A2A" }}>
                    <span className="text-2xl">🛍️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-creme text-sm font-medium truncate">{item.nom}</p>
                    <p className="text-ambre text-sm font-bold">
                      {(item.prix * item.quantite).toLocaleString("fr-FR")} FCFA
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantite(item.id, item.quantite - 1)}
                        className="w-6 h-6 rounded-full border border-ambre/30 text-ambre text-sm flex items-center justify-center hover:border-ambre">
                        -
                      </button>
                      <span className="text-creme text-sm w-4 text-center">{item.quantite}</span>
                      <button onClick={() => updateQuantite(item.id, item.quantite + 1)}
                        className="w-6 h-6 rounded-full border border-ambre/30 text-ambre text-sm flex items-center justify-center hover:border-ambre">
                        +
                      </button>
                      <button onClick={() => removeItem(item.id)}
                        className="ml-auto text-red-400/60 hover:text-red-400 text-xs">
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-ambre/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-creme/70">Total ({count} article{count > 1 ? "s" : ""})</span>
              <span className="text-ambre font-black text-xl font-playfair">
                {total.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
            <button
              onClick={() => { onClose(); navigate("/commande") }}
              className="w-full bg-ambre text-noir font-bold py-4 rounded-xl hover:bg-or transition-all text-sm">
              Commander →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}