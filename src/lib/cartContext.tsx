import { createContext, useContext, useState, ReactNode } from "react"

interface CartItem {
  id: string
  nom: string
  prix: number
  quantite: number
  image_path: string | null
  boutique_id: string
  boutique_nom: string
}

interface CartContextType {
  items: CartItem[]
  boutiqueId: string | null
  boutiqueNom: string | null
  addItem: (item: Omit<CartItem, "quantite">) => "ok" | "conflict"
  removeItem: (id: string) => void
  updateQuantite: (id: string, quantite: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [boutiqueId, setBoutiqueId] = useState<string | null>(null)
  const [boutiqueNom, setBoutiqueNom] = useState<string | null>(null)

  const addItem = (item: Omit<CartItem, "quantite">): "ok" | "conflict" => {
    if (boutiqueId && boutiqueId !== item.boutique_id) {
      return "conflict"
    }
    setBoutiqueId(item.boutique_id)
    setBoutiqueNom(item.boutique_nom)
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantite: i.quantite + 1 } : i)
      }
      return [...prev, { ...item, quantite: 1 }]
    })
    return "ok"
  }

  const removeItem = (id: string) => {
    setItems(prev => {
      const newItems = prev.filter(i => i.id !== id)
      if (newItems.length === 0) {
        setBoutiqueId(null)
        setBoutiqueNom(null)
      }
      return newItems
    })
  }

  const updateQuantite = (id: string, quantite: number) => {
    if (quantite <= 0) { removeItem(id); return }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantite } : i))
  }

  const clearCart = () => {
    setItems([])
    setBoutiqueId(null)
    setBoutiqueNom(null)
  }

  const total = items.reduce((sum, i) => sum + i.prix * i.quantite, 0)
  const count = items.reduce((sum, i) => sum + i.quantite, 0)

  return (
    <CartContext.Provider value={{
      items, boutiqueId, boutiqueNom,
      addItem, removeItem, updateQuantite, clearCart,
      total, count
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be inside CartProvider")
  return ctx
}