import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

type CategoryItem = {
    title: string;
    image?: any;
}

type Props = {
    items: CategoryItem[];
}

export default function CategoriasCarousel({ items }: Props) {
  return (
     <FlatList
     className='mx-4'
      data={items}
      horizontal
      keyExtractor={(item, index) => `cat-${index}`}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 10 }}
      renderItem={({ item }) => (
        <TouchableOpacity className="items-center mx-2">
          {item.image ? (
            <Image
              source={item.image}
              className="w-20 h-20 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 rounded-full bg-gray-300 items-center justify-center">
              <Text>?</Text>
            </View>
          )}
          <Text className="text-sm font-medium text-gray-700 mt-2 text-center">
            {item.title}
          </Text>
        </TouchableOpacity>
      )}
    />
  )
}
