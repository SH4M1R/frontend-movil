import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

export type Producto = {
  idProducto: number;
  producto: string;
  categoria: {
    idCategoria: number;
    categoria: string;
  };
  precioVenta: number;
  imagen?: string;
};

export type CartItem = Producto & { quantity: number };

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
  clearCart: () => void;
  getTotal: () => string;

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


const getBaseURL = () => {
  if (Platform.OS === "android") return "http://10.0.2.2:8500";
  return "http://localhost:8500";
};


export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<
    { idCategoria: number; categoria: string }[]
  >([]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [filters, setFiltersState] = useState<Filters>({
    categoria: null,
    searchText: "",
  });

  const [filtroVisible, setFiltroVisible] = useState(false);

  const baseURL = getBaseURL();


  useEffect(() => {
    const loadData = async () => {
      try {
        const proRes = await axios.get(`${baseURL}/api/catalogo/productos`);
        const catRes = await axios.get(`${baseURL}/api/catalogo/categorias`);

        const mappedProducts: Producto[] = proRes.data.map((p: any) => ({
          idProducto: p.idProducto,
          producto: p.producto ?? p.Producto,
          precioVenta: Number(p.precioVenta ?? p.PrecioVenta),
          imagen:
            p.imagen || p.Imagen
              ? `${baseURL}${p.imagen ?? p.Imagen}`
              : undefined,
          categoria: {
            idCategoria: p.categoria?.idCategoria,
            categoria: p.categoria?.categoria,
          },
        }));

        setProductos(mappedProducts);
        setCategorias(catRes.data);

      } catch (error: any) {
        console.log(
          " Error cargando productos/categorías:",
          error?.response?.data ?? error?.message ?? error
        );
      }
    };

    loadData();
  }, []);


  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await AsyncStorage.getItem("cart");
        if (data) setCart(JSON.parse(data));
      } catch (error) {
        console.log(" Error cargando carrito:", error);
      }
    };

    loadCart();
  }, []);


  useEffect(() => {
    AsyncStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  const addToCart = (product: Producto) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.idProducto === product.idProducto);

      if (exists) {
        return prev.map((p) =>
          p.idProducto === product.idProducto
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (idProducto: number) =>
    setCart((prev) => prev.filter((p) => p.idProducto !== idProducto));

  const updateQuantity = (idProducto: number, delta: number) =>
    setCart((prev) =>
      prev.map((p) =>
        p.idProducto === idProducto
          ? { ...p, quantity: Math.max(1, p.quantity + delta) }
          : p
      )
    );

  const clearCart = () => setCart([]);

  const getTotal = () =>
    cart
      .reduce((sum, item) => sum + item.precioVenta * item.quantity, 0)
      .toFixed(2);

  const setFilters = (obj: Partial<Filters>) =>
    setFiltersState((prev) => ({ ...prev, ...obj }));

  const value: StoreContextType = {
    productos,
    categorias,

    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,

    filters,
    setFilters,

    filtroVisible,
    setFiltroVisible,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
