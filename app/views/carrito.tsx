import { CartItem, useStore } from "@/contexts/StoreContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function Carrito() {
  const { cart, removeFromCart, updateQuantity, getTotal } = useStore();
  const router = useRouter();

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Carrito vacío", "Agrega productos antes de continuar.");
      return;
    }
    router.push("/views/metodopago");
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View className="flex-row bg-white rounded-xl p-3 mb-3 shadow items-center">
      {item.imagen ? (
        <Image source={{ uri: item.imagen }} resizeMode="cover" className="w-20 h-20 rounded-lg mr-3" />
      ) : (
        <View className="w-20 h-20 rounded-lg mr-3 bg-gray-200 flex items-center justify-center">
          <Ionicons name="image-outline" size={24} color="gray" />
        </View>
      )}
      <View className="flex-1">
        <Text className="font-semibold text-gray-800 text-lg">{item.producto}</Text>
        <Text className="text-indigo-600 font-bold mt-1">S/ {item.precioVenta.toFixed(2)}</Text>
        <View className="flex-row items-center mt-2">
          <TouchableOpacity onPress={() => updateQuantity(item.idProducto, -1)} className="p-1 bg-indigo-100 rounded">
            <Ionicons name="remove" size={20} color="#4F46E5" />
          </TouchableOpacity>
          <Text className="mx-3 text-gray-800 font-semibold">{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.idProducto, 1)} className="p-1 bg-indigo-100 rounded">
            <Ionicons name="add" size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.idProducto)}>
        <Ionicons name="trash" size={28} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-5">
      <Text className="text-2xl font-bold text-indigo-700 mb-4">Carrito de Compras</Text>
      {cart.length === 0 ? (
        <Text className="text-center text-gray-600 mt-10">Tu carrito está vacío.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.idProducto.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
      {cart.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-800">Total: S/ {getTotal().toFixed(2)}</Text>
          <TouchableOpacity onPress={handleCheckout} className="bg-indigo-700 px-5 py-3 rounded-xl">
            <Text className="text-white font-bold">Pagar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
