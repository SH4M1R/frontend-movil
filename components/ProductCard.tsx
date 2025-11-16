import { Producto, useStore } from "@/contexts/StoreContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ProductCard({ item, onPress }: { item: Producto; onPress: () => void }) {
  const { addToCart } = useStore();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-3 shadow flex"
      style={{
        width: "48%",
        height: 200,
      }}
    >
      <View
        className="rounded-lg bg-gray-100 mb-2"
        style={{
          width: "100%",
          height: 110,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: item.imagen }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </View>

      <Text className="font-semibold text-gray-800" numberOfLines={2}>
        {item.producto}
      </Text>

      <Text className="text-indigo-600 font-bold mt-1">
        S/ {item.precioVenta.toFixed(2)}
      </Text>

      <TouchableOpacity
        className="absolute bottom-4 right-4"
        onPress={() => addToCart(item)}
      >
        <Ionicons name="add-circle" size={30} color="#4F46E5" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
