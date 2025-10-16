import { useStore } from '@/contexts/StoreContext';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

const categories = ['Todos', 'Camisetas', 'Pantalones', 'Vestidos', 'Chaquetas', 'Faldas', 'Suéteres'];
const priceRanges = ['Todos', 'Menos de S/50', 'S/50 - S/100', 'Más de S/100'];

export default function FilterModal() {
  const { filters, setFilters, filterVisible, setFilterVisible } = useStore();

  return (
    <Modal visible={filterVisible} animationType="slide" transparent onRequestClose={() => setFilterVisible(false)}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white w-[90%] rounded-lg p-4">
          <Text className="text-xl font-bold mb-3">Filtros</Text>

          {/* Categoría */}
          <Text className="text-lg font-semibold mt-2">Categoría</Text>
          <View className="mt-2">
            {categories.map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => setFilters({ category: c })}
                className={`py-2 px-3 my-1 rounded-md ${
                  filters.category === c ? 'bg-blue-500' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`${
                    filters.category === c ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Precio */}
          <Text className="text-lg font-semibold mt-3">Precio</Text>
          <View className="mt-2">
            {priceRanges.map(r => (
              <TouchableOpacity
                key={r}
                onPress={() => setFilters({ priceRange: r })}
                className={`py-2 px-3 my-1 rounded-md ${
                  filters.priceRange === r ? 'bg-blue-500' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`${
                    filters.priceRange === r ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Botón cerrar */}
          <TouchableOpacity
            onPress={() => setFilterVisible(false)}
            className="mt-4 bg-blue-600 py-3 rounded-md items-center"
          >
            <Text className="text-white font-semibold">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
