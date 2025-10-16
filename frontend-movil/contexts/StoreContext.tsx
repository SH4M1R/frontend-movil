import React, { createContext, ReactNode, useContext, useState } from 'react';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: any;
};

type CartItem = Product & { quantity: number };

type Filters = {
  category: string;
  priceRange: string;
  searchText: string;
};

type StoreContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  getTotal: () => string;
  filters: Filters;
  setFilters: (f: Partial<Filters>) => void;
  clearCart: () => void;

  // 👇 NUEVO: para manejar visibilidad global de modales
  cartVisible: boolean;
  setCartVisible: (v: boolean) => void;
  filterVisible: boolean;
  setFilterVisible: (v: boolean) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  // 🛒 Estado del carrito
  const [cart, setCart] = useState<CartItem[]>([]);

  // 🎯 Estado de filtros
  const [filters, setFiltersState] = useState<Filters>({
    category: 'Todos',
    priceRange: 'Todos',
    searchText: '',
  });

  // 🪟 NUEVO: estado de visibilidad de modales
  const [cartVisible, setCartVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  // === LÓGICA DEL CARRITO ===
  const addToCart = (product: Product) => {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id);
      if (found)
        return prev.map(p =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) =>
    setCart(prev => prev.filter(p => p.id !== id));

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const q = Math.max(1, p.quantity + delta);
        return { ...p, quantity: q };
      })
    );
  };

  const getTotal = () =>
    cart.reduce((s, p) => s + p.price * p.quantity, 0).toFixed(2);

  const setFilters = (f: Partial<Filters>) =>
    setFiltersState(prev => ({ ...prev, ...f }));

  const clearCart = () => setCart([]);

  const value: StoreContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotal,
    filters,
    setFilters,
    clearCart,

    // 👇 visibilidad global
    cartVisible,
    setCartVisible,
    filterVisible,
    setFilterVisible,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
