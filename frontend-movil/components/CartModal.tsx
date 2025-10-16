import { useStore } from '@/contexts/StoreContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CartModal() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getTotal,
    cartVisible,
    setCartVisible,
  } = useStore();

  return (
    <Modal
      visible={cartVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setCartVisible(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white h-[70%] rounded-t-2xl p-4">
          <Text className="text-xl font-bold text-center mb-3">Carrito</Text>

          <ScrollView className="flex-1">
            {cart.length === 0 ? (
              <Text className="text-center mt-5">Tu carrito está vacío 🛍️</Text>
            ) : (
              cart.map(item => (
                <View key={item.id} className="mb-4">
                  <Text className="font-semibold text-base">{item.name}</Text>

                  <View className="flex-row items-center justify-between mt-1">
                    {/* Botones de cantidad */}
                    <View className="flex-row items-center">
                      <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                        <Text className="text-blue-500 text-lg w-6 text-center">-</Text>
                      </TouchableOpacity>
                      <Text className="font-semibold mx-2">{item.quantity}</Text>
                      <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                        <Text className="text-blue-500 text-lg w-6 text-center">+</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Precio total del producto */}
                    <Text className="font-bold text-blue-600">
                      S/ {(item.price * item.quantity).toFixed(2)}
                    </Text>

                    {/* Eliminar */}
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Ionicons name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Total general */}
          <Text className="text-lg font-bold text-right mt-2">
            Total: S/ {getTotal()}
          </Text>

          {/* Botones */}
          <TouchableOpacity className="bg-blue-500 py-3 rounded-lg mt-3 items-center">
            <Text className="text-white font-semibold">Pagar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCartVisible(false)}
            className="bg-gray-300 py-2 rounded-lg mt-2 items-center"
          >
            <Text className="text-gray-700 font-semibold">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
