import { useStore } from '@/contexts/StoreContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CarritoView() {
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useStore();
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      {/* 🔹 Lista de productos */}
      <ScrollView className="flex-1 px-4 py-3">
        {cart.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Ionicons name="cart-outline" size={70} color="#bbb" />
            <Text className="text-gray-500 text-base mt-3">
              Tu carrito está vacío
            </Text>
          </View>
        ) : (
          cart.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-xl shadow-sm p-4 mb-3 border border-gray-100"
            >
              <View className="flex-row justify-between items-center mb-2">
                {/* Imagen del producto */}
                <Image
                  source={item.image}
                  className="w-16 h-16 rounded-lg mr-3"
                  resizeMode="cover"
                />
                <Text className="font-semibold text-base flex-1">{item.name}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-between mt-2">
                {/* Botones de cantidad */}
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, -1)}
                    className="bg-gray-200 w-7 h-7 rounded-full items-center justify-center"
                  >
                    <Text className="text-lg text-blue-600 font-bold">−</Text>
                  </TouchableOpacity>

                  <Text className="font-semibold mx-3 text-base">{item.quantity}</Text>

                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, 1)}
                    className="bg-gray-200 w-7 h-7 rounded-full items-center justify-center"
                  >
                    <Text className="text-lg text-blue-600 font-bold">+</Text>
                  </TouchableOpacity>
                </View>

                {/* Precio total del producto */}
                <Text className="font-bold text-blue-600 text-base">
                  S/ {(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {cart.length > 0 && (
        <View className="bg-white border-t border-gray-200 p-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-blue-950">Total:</Text>
            <Text className="text-xl font-bold text-blue-600">
              S/ {parseFloat(getTotal()).toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity className="bg-blue-500 py-3 rounded-lg items-center mb-2">
            <Text className="text-white font-semibold text-base">Pagar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-200 py-3 rounded-lg items-center"
            onPress={clearCart}
          >
            <Text className="text-gray-700 font-semibold text-base">Vaciar Carrito</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
