import { useStore } from '@/contexts/StoreContext'; // <- Importa el store
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState('');
  const { cart } = useStore(); // <- Obtenemos el carrito

  // Calculamos el total de items en el carrito
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (pathname.includes('home')) setActive('home');
    else if (pathname.includes('productos')) setActive('productos');
    else if (pathname.includes('carrito')) setActive('carrito');
    else if (pathname.includes('perfil')) setActive('perfil');
    else setActive('');
  }, [pathname]);

  const buttons = [
    { key: 'home', label: 'Inicio', icon: 'home', route: '/views/home' },
    { key: 'productos', label: 'Productos', icon: 'pricetag', route: '/views/productos' },
    { key: 'carrito', label: 'Carrito', icon: 'cart', route: '/views/carrito' },
    { key: 'perfil', label: 'Perfil', icon: 'person', route: '/views/perfil' },
  ];

  return (
    <View className="h-16 flex-row justify-around items-center border-t border-gray-300 bg-white">
      {buttons.map((btn) => {
        const isActive = active === btn.key;
        const color = isActive ? '#007AFF' : '#999';

        return (
          <TouchableOpacity
            key={btn.key}
            className={`flex items-center justify-center px-2 py-1 rounded-xl ${
              isActive ? 'bg-blue-100' : ''
            }`}
            onPress={() => router.push(btn.route)}
          >
            <View className="relative">
              <Ionicons name={btn.icon as any} size={24} color={color} />
              {/* Contador solo para el botón del carrito */}
              {btn.key === 'carrito' && cartCount > 0 && (
                <View className="absolute -top-2 -right-3 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                  <Text className="text-white text-[10px] font-bold">
                    {cartCount}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-xs font-medium" style={{ color }}>
              {btn.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}