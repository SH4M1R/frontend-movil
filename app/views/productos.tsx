import FilterModal from '@/components/FilterModal';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/contexts/StoreContext';
import { products } from '@/data/productos';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, FlatList, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = (width - 40) / 2;

export default function ProductsScreen() {
  const { filters, setFilters, setFilterVisible } = useStore();

  const filterByPrice = (product: any) => {
    if (filters.priceRange === 'Todos') return true;
    if (filters.priceRange === 'Menos de S/50') return product.price < 50;
    if (filters.priceRange === 'S/50 - S/100') return product.price >= 50 && product.price <= 100;
    if (filters.priceRange === 'Más de S/100') return product.price > 100;
    return true;
  };

  const filteredProducts = products
    .filter(p => filters.category === 'Todos' || p.category === filters.category)
    .filter(filterByPrice)
    .filter(p => p.name.toLowerCase().includes(filters.searchText.toLowerCase()));

  return (
    <View className="flex-1 bg-white">
      {/* 🔹 Barra de búsqueda y botón de filtro */}
      <View className="flex-row items-center justify-between px-4 pt-4 mb-2">
        <View className="flex-row flex-1 items-center bg-gray-100 rounded-md px-3 mr-2">
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput
            placeholder="Buscar producto..."
            value={filters.searchText}
            onChangeText={(text) => setFilters({ ...filters, searchText: text })}
            className="flex-1 ml-2 text-base text-gray-800"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
          className="bg-blue-600 p-3 rounded-md"
        >
          <Ionicons name="filter-outline" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* 🔹 Modal de filtros */}
      <FilterModal />

      {/* 🔹 Lista de productos */}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductCard item={item} itemWidth={itemWidth} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
}