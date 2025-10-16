import { useStore } from '@/contexts/StoreContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Header() {
  const {
    setCartVisible,
    setFilterVisible,
    // 
    // filters,
    // setFilters,
  } = useStore();

 
  const cartCount = 2; 

  return (
    <View className="bg-white shadow px-4 py-3">
      {/* Logo + Icons */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="pricetag-outline" size={24} color="#1e3a8a" />
          <Text className="ml-2 text-lg font-nunito font-black text-blue-950">
            MODASTYLE
          </Text>
        </View>

        <View className="flex-row items-center space-x-4">
          {/* Botón filtro */}
          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            accessibilityLabel="Abrir filtros"
          >
            <Ionicons name="filter-outline" size={24} color="#1e3a8a" />
          </TouchableOpacity>

          {/* Botón carrito */}
          <TouchableOpacity
            onPress={() => setCartVisible(true)}
            accessibilityLabel="Abrir carrito"
            className="relative"
          >
            <Ionicons name="cart-outline" size={24} color="#1e3a8a" />
            {cartCount > 0 && (
              <View className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-[10px] font-bold">{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      <View className="bg-gray-200 flex-row items-center mt-3 px-3 rounded-2xl">
        <Ionicons name="search" size={20} color="#333" />
        <TextInput
          placeholder="Buscar productos..."
          className="ml-2 flex-1 text-gray-700 py-2"
          // para agregar filtros
          // value={filters?.searchText || ''}
          // onChangeText={(t) => setFilters({ searchText: t })}
        />
      </View>
    </View>
  );
}
