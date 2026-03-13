import { useAuth } from "./hooks/useAuth"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"

function App() {
  const { user, loading, signOut } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" 
      style={{ backgroundColor: "#1A1A1A" }}>
      <p className="text-ambre font-playfair text-2xl animate-pulse">
        Le Square...
      </p>
    </div>
  )

  return user ? (
    <HomePage user={user} onSignOut={signOut} />
  ) : (
    <AuthPage />
  )
}

export default App