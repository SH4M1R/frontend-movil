import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filters, setFiltersState] = useState<Filters>({
    category: 'Todos',
    priceRange: 'Todos',
    searchText: '',
  });

  const [cartVisible, setCartVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  // 🔹 Cargar carrito desde AsyncStorage al iniciar
  useEffect(() => {
    const loadCart = async () => {
      try {
        const json = await AsyncStorage.getItem('cart');
        if (json) setCart(JSON.parse(json));
      } catch (error) {
        console.log('Error cargando carrito:', error);
      }
    };
    loadCart();
  }, []);

  // 🔹 Guardar carrito en AsyncStorage cada vez que cambie
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.log('Error guardando carrito:', error);
      }
    };
    saveCart();
  }, [cart]);

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
    cartVisible,
    setCartVisible,
    filterVisible,
    setFilterVisible,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
