import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type Item = { image?: any; title: string; description?: string };
type Props = { items: Item[]; title?: string };

export default function ProductosDestacados({ items, title = 'Productos' }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const CARD_WIDTH = width * 0.6; 
  const SPACING = 10; 

  const renderItem = (item: Item) => (
    <Animated.View
      entering={FadeIn}
      style={{ width: CARD_WIDTH }}
      className="bg-white rounded-xl mx-4 my-4 items-center shadow-lg shadow-black  "
    >
      {item.image && (
        <Image
          source={item.image}
          className="w-full h-32 rounded-lg mb-2"
          resizeMode="cover"
        />
      )}
      <Text className="text-base font-bold text-blue-600 text-center">{item.title}</Text>
      {item.description && (
        <Text className="text-sm text-gray-600 my-2 text-center">
          {item.description}
        </Text>
      )}
      <TouchableOpacity className="my-2 bg-blue-600 px-4 py-2  rounded-lg">
        <Text className="text-white font-semibold ">Comprar</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View className="py-2">

      <FlatList
        data={items}
        horizontal
        ref={listRef}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => 'product-' + index}
        renderItem={({ item }) => renderItem(item)}
        snapToInterval={CARD_WIDTH + SPACING} 
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 10 }}
        onScroll={(e) =>
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING)))
        }
      />

      <View className="flex-row justify-center mt-3">
        {items.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>
    </View>
  );
}
