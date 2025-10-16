import CartModal from '@/components/CartModal';
import CategoriasCarousel from '@/components/CategoriasCarousel';
import FilterModal from '@/components/FilterModal';
import Header from '@/components/Header';
import ProductosDestacados from '@/components/ProductosDestacados';
import PromoCarousel from '@/components/PromoCarousel';
import { categories, productItems, promoItems } from '@/data/homeData';
import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
const { width } = Dimensions.get('window');

export default function HomeScreen() {
  

  return (
    <View>
      <Header />
      <FilterModal />
      <CartModal />
      <ScrollView className="pt-4 bg-slate-100" contentContainerStyle={{ paddingBottom: 200 }}>
        <Text className="text-lg text-slate-600 font-nunito font-bold px-4">Promociones</Text>
        <PromoCarousel items={promoItems} autoplay autoplayInterval={3000} />

        <Text className="text-lg text-slate-600 font-bold px-4">Productos Destacados</Text>
        <ProductosDestacados items={productItems} title="Productos Destacados" />

        <Text className="text-lg text-slate-600 font-nunito font-bold px-4">Categorías</Text>
        <CategoriasCarousel items={categories} />
      </ScrollView>
    </View>
  );
}
