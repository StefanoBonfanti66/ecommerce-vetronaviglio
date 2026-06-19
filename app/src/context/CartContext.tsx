import { createContext, useContext, useState, ReactNode } from 'react';
import { useLang } from './LanguageContext';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const { lang, t } = useLang();

  const addToCart = (product: any, type: 'sale' | 'sample' = 'sale', quantity: number = 1, price: number) => {
    const existingIndex = cart.findIndex(item => item.id === product.id && item.cartType === type);

    if (existingIndex !== -1) {
      const existingItem = cart[existingIndex];
      const newTotalQuantity = existingItem.quantity + quantity;

      if (newTotalQuantity > product.stock_quantity) {
        alert(`Disponibilità massima raggiunta: ${product.stock_quantity} pezzi.`);
        return;
      }

      const updatedCart = [...cart];
      updatedCart[existingIndex] = { ...existingItem, quantity: newTotalQuantity };
      setCart(updatedCart);
      setNotification(`${product.title_it} (x${quantity}) aggiunto al carrello`);
    } else {
      setCart([...cart, { ...product, cartType: type, quantity, price }]);
      setNotification(`${product.title_it} (x${quantity}) aggiunto ${type === 'sample' ? 'alla richiesta campioni' : 'al carrello'}`);
    }
    
    setTimeout(() => setNotification(null), 3000);
  };

  const updateQuantity = (index: number, quantity: number, price: number) => {
    const updatedCart = [...cart];
    updatedCart[index] = { ...updatedCart[index], quantity, price };
    setCart(updatedCart);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-onyx text-bone px-6 py-3 shadow-lg z-[100] text-sm tracking-wide">
          {notification}
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
