import ProductCard from '@/components/ProductCard';
import { useStore } from '@/contexts/StoreContext';
import { products } from '@/data/productos';
import React from 'react';
import { Dimensions, FlatList, View } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = (width - 40) / 2;

export default function ProductsScreen() {
  const { filters } = useStore();

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

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductCard item={item} itemWidth={itemWidth} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 20 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
}
