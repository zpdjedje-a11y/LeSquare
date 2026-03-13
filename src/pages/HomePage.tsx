export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1A1A" }}>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-ambre/20">
        <h1 className="font-playfair text-2xl font-black text-ambre">
          Le Square
        </h1>
        <div className="flex items-center gap-3">
          <button className="text-creme/70 text-sm hover:text-ambre transition-colors">
            Connexion
          </button>
          <button className="bg-ambre text-noir font-bold px-4 py-2 rounded-xl text-sm hover:bg-or transition-colors">
            S'inscrire
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-16 text-center max-w-2xl mx-auto">
        <h2 className="font-playfair text-5xl font-black text-creme mb-4 leading-tight">
          La place du marché <span className="text-ambre">premium</span> d'Abidjan
        </h2>
        <p className="text-creme/60 text-lg mb-8">
          Achetez et vendez des produits de qualité. <span className="text-ambre">Le Square</span> : C'est propre, c'est pro, c'est nous !
        </p>
        <div className="flex gap-3 justify-center">
          <button className="bg-ambre text-noir font-bold px-6 py-3 rounded-xl hover:bg-or transition-colors">
            Explorer les boutiques
          </button>
          <button className="border border-ambre/40 text-ambre font-bold px-6 py-3 rounded-xl hover:border-ambre transition-colors">
            Ouvrir ma boutique
          </button>
        </div>
      </section>

      {/* Catégories */}
      <section className="px-6 py-8 max-w-4xl mx-auto">
        <h3 className="font-playfair text-2xl font-bold text-creme mb-6">
          Catégories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { nom: "Mode", emoji: "👗" },
            { nom: "Électronique", emoji: "📱" },
            { nom: "Beauté", emoji: "💄" },
            { nom: "Maison", emoji: "🏠" },
            { nom: "Alimentation", emoji: "🍎" },
            { nom: "Sport", emoji: "⚽" },
            { nom: "Enfants", emoji: "🧸" },
            { nom: "Services", emoji: "🔧" },
          ].map(cat => (
            <button
              key={cat.nom}
              className="bg-gris border border-ambre/10 hover:border-ambre/40 rounded-2xl p-4 text-center transition-all hover:scale-105"
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <p className="text-creme/80 text-sm font-medium">{cat.nom}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Produits vedettes */}
      <section className="px-6 py-8 max-w-4xl mx-auto">
        <h3 className="font-playfair text-2xl font-bold text-creme mb-6">
          Produits vedettes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="bg-gris border border-ambre/10 rounded-2xl overflow-hidden hover:border-ambre/40 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="h-40 flex items-center justify-center" style={{ backgroundColor: "#2A2A2A" }}>
                <span className="text-4xl">🛍️</span>
              </div>
              <div className="p-3">
                <p className="text-creme text-sm font-medium mb-1">Produit {i}</p>
                <p className="text-creme/50 text-xs mb-2">Boutique Exemple</p>
                <p className="text-ambre font-bold text-sm">5 000 FCFA</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}