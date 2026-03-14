import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './lib/cartContext.tsx'

createRoot(document.getElementById('root')!).render(
  <CartProvider>
    <App />
  </CartProvider>,
)