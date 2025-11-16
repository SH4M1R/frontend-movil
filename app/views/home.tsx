import CategoriasCarousel from '@/components/CategoriasCarousel';
import ProductosDestacados from '@/components/ProductosDestacados';
import PromoCarousel from '@/components/PromoCarousel';
import { categories, productItems, promoItems } from '@/data/homeData';
import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-slate-100">
      <ScrollView
        className="pt-4"
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        <Text className="text-lg text-slate-600 font-bold px-4">Promociones</Text>
        <PromoCarousel items={promoItems} autoplay autoplayInterval={3000} />

        <Text className="text-lg text-slate-600 font-bold px-4 mt-2">Productos Destacados</Text>
        <ProductosDestacados items={productItems} title="Productos Destacados" />

        <Text className="text-lg text-slate-600 font-bold px-4 mt-2">Categorías</Text>
        <CategoriasCarousel items={categories} />
      </ScrollView>
    </View>
  );
}
