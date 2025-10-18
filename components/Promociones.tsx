import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const productItems = [
  { image: require('@/assets/img/product1.jpg'), title: 'Chaqueta Casual', description: 'Comodidad y estilo.' },
  { image: require('@/assets/img/product2.jpg'), title: 'Zapatillas Urbanas', description: 'Perfectas para caminar.' },
  { image: require('@/assets/img/product3.jpg'), title: 'Bolso Elegante', description: 'Complementa tu outfit.' },
];

export default function ProductCarousel() {
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (index + 1) % productItems.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <View className="mt-4">
      {/* Header */}
      <View className="flex-row justify-between px-4 mb-2">
        <Text className="text-lg font-bold text-black">Promociones</Text>
        <Text className="text-blue-500">Ver todo</Text>
      </View>

      {/* Carrusel */}
      <FlatList
        ref={flatListRef}
        data={productItems}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View className="mx-2 rounded-xl overflow-hidden" style={{ width: width * 0.9, backgroundColor: '#f5f5dc' }}>
            <Image source={item.image} className="w-full h-48" resizeMode="cover" />
            <View className="p-4">
              <Text className="text-white text-lg font-bold">{item.title}</Text>
              <Text className="text-white text-sm mt-1">{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Indicadores */}
      <View className="flex-row justify-center mt-2">
        {productItems.map((_, i) => (
          <View
            key={i}
            className={`w-2 h-2 rounded-full mx-1 ${i === index ? 'bg-white' : 'border border-white'}`}
          />
        ))}
      </View>
    </View>
  );
}
