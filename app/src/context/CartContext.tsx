import { createContext, useContext, useState, ReactNode } from 'react';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const addToCart = (product: any, type: 'sale' | 'sample' = 'sale', quantity: number = 1, price: number) => {
    setCart([...cart, { ...product, cartType: type, quantity, price }]);
    setNotification(`${product.title_it} (x${quantity}) aggiunto ${type === 'sample' ? 'alla richiesta campioni' : 'al carrello'}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
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
