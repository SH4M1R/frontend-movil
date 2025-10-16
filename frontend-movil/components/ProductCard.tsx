import { useStore } from '@/contexts/StoreContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function ProductCard({ item, itemWidth }: { item: any; itemWidth: number; }) {
  const { addToCart } = useStore();

  return (
    <View style={{ width: itemWidth }} className="bg-white rounded-xl p-3 shadow-md m-2">
      <Image source={item.image} className="w-full h-32 rounded-lg mb-2 bg-gray-200" resizeMode="cover" />
      <Text className="text-base mb-1">{item.name}</Text>
      <Text className="text-blue-500 font-bold text-lg">S/ {item.price}</Text>

      <TouchableOpacity className="absolute bottom-4 right-4" onPress={() => addToCart(item)}>
        <Ionicons name="add-circle" size={28} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}
