import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';

export type Producto = {
  idProducto: number;
  producto: string;
  categoria: { idCategoria: number; categoria: string };
  precioVenta: number;
  imagen?: string;
};

export type CartItem = Producto & { quantity: number; idCarrito?: number };

export type Filters = {
  categoria: number | null;
  searchText: string;
};

type StoreContextType = {
  productos: Producto[];
  categorias: { idCategoria: number; categoria: string }[];
  cart: CartItem[];
  addToCart: (product: Producto) => void;
  removeFromCart: (idProducto: number) => void;
  updateQuantity: (idProducto: number, delta: number) => void;
  setQuantity: (idProducto: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  filters: Filters;
  setFilters: (obj: Partial<Filters>) => void;
  filtroVisible: boolean;
  setFiltroVisible: (v: boolean) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);
export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};

const getBaseURL = () =>
  Platform.OS === "android" ? "http://10.0.2.2:8500" : "http://localhost:8500";

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<{ idCategoria: number; categoria: string }[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filters, setFiltersState] = useState<Filters>({ categoria: null, searchText: "" });
  const [filtroVisible, setFiltroVisible] = useState(false);
  const baseURL = getBaseURL();

  // Cargar productos y categorías
  useEffect(() => {
    const loadData = async () => {
      try {
        const proRes = await axios.get(`${baseURL}/api/catalogo/productos`);
        const catRes = await axios.get(`${baseURL}/api/catalogo/categorias`);
        const mappedProducts: Producto[] = proRes.data.map((p: any) => ({
          idProducto: p.idProducto,
          producto: p.producto ?? p.Producto,
          precioVenta: Number(p.precioVenta ?? p.PrecioVenta),
          imagen: p.imagen ? `${baseURL}${p.imagen}` : undefined,
          categoria: { idCategoria: p.categoria?.idCategoria, categoria: p.categoria?.categoria }
        }));
        setProductos(mappedProducts);
        setCategorias(catRes.data);
      } catch (error: any) {
        console.log("Error cargando productos/categorías:", error?.message ?? error);
      }
    };
    loadData();
  }, []);

  // Cargar carrito desde backend y AsyncStorage
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (!user) return;
        const res = await axios.get(`${baseURL}/api/carrito/${user.idUsuario}`);
        // Solo agregar items con idProducto definido
        setCart(res.data.filter((item: any) => item.idProducto !== undefined));
      } catch (error) {
        console.log("Error cargando carrito backend:", error);
        const data = await AsyncStorage.getItem("cart");
        if (data) setCart(JSON.parse(data).filter((item: any) => item.idProducto !== undefined));
      }
    };
    loadCart();
  }, [user]);

  // Guardar carrito en AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product: Producto) => {
    if (!user) return;
    if (!product.idProducto) return console.warn("Producto inválido", product);

    try {
      const res = await axios.post(`${baseURL}/api/carrito/agregar`, {
        usuarioId: user.idUsuario,
        productoId: product.idProducto,
        cantidad: 1
      });
      const backendItem = res.data;

      setCart(prev => {
        const exists = prev.find(p => p.idProducto === product.idProducto);
        if (exists) {
          return prev.map(p =>
            p.idProducto === product.idProducto
              ? { ...p, quantity: p.quantity + 1, idCarrito: backendItem.idCarrito }
              : p
          );
        }
        return [...prev, { ...product, quantity: 1, idCarrito: backendItem.idCarrito }];
      });
    } catch (error: any) {
      console.log("Error agregando al carrito:", error?.response?.data ?? error?.message ?? error);
    }
  };

  const updateQuantity = async (idProducto: number, delta: number) => {
    if (!user) return;
    setCart(prev => {
      const item = prev.find(p => p.idProducto === idProducto);
      if (!item) return prev;

      const newQuantity = Math.max(1, item.quantity + delta);

      if (item.idCarrito) {
        axios
          .post(`${baseURL}/api/carrito/agregar`, {
            usuarioId: user.idUsuario,
            productoId: idProducto,
            cantidad: delta
          })
          .catch(err => console.log("Error backend actualizar cantidad:", err?.response?.data ?? err));
      }

      return prev.map(p =>
        p.idProducto === idProducto ? { ...p, quantity: newQuantity } : p
      );
    });
  };

  const setQuantity = async (idProducto: number, quantity: number) => {
    if (!user) return;
    setCart(prev => {
      const item = prev.find(p => p.idProducto === idProducto);
      if (!item) return prev;

      const delta = quantity - item.quantity;

      if (item.idCarrito) {
        axios
          .post(`${baseURL}/api/carrito/agregar`, {
            usuarioId: user.idUsuario,
            productoId: idProducto,
            cantidad: delta
          })
          .catch(err => console.log("Error backend setQuantity:", err?.response?.data ?? err));
      }

      return prev.map(p =>
        p.idProducto === idProducto ? { ...p, quantity } : p
      );
    });
  };

  const removeFromCart = async (idProducto: number) => {
    if (!user) return;
    setCart(prev => {
      const item = prev.find(p => p.idProducto === idProducto);
      if (item && item.idCarrito) {
        axios
          .delete(`${baseURL}/api/carrito/eliminar/${item.idCarrito}`)
          .catch(err => console.log("Error backend eliminar:", err?.response?.data ?? err));
      }
      return prev.filter(p => p.idProducto !== idProducto);
    });
  };

  const clearCart = async () => {
    if (!user) return;
    setCart([]);
    try {
      await axios.delete(`${baseURL}/api/carrito/vaciar/${user.idUsuario}`);
    } catch (error) {
      console.log("Error vaciando carrito backend:", error);
    }
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + (Number(item.precioVenta) || 0) * (Number(item.quantity) || 0), 0);

  const setFilters = (obj: Partial<Filters>) =>
    setFiltersState(prev => ({ ...prev, ...obj }));

  return (
    <StoreContext.Provider
      value={{
        productos,
        categorias,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        setQuantity,
        clearCart,
        getTotal,
        filters,
        setFilters,
        filtroVisible,
        setFiltroVisible
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
