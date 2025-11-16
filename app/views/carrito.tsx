import { useStore } from '@/contexts/StoreContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MinusIcon, PlusIcon, TrashIcon } from 'react-native-heroicons/outline';

export default function CarritoView() {
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useStore();
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-100 p-4">

      <Text className="text-2xl font-bold text-slate-700 mb-4">Tu Carrito</Text>

      {cart.length === 0 ? (
        <Text className="text-center text-slate-500 mt-10">
          Tu carrito está vacío 🛒
        </Text>
      ) : (
        <>
          <ScrollView className="space-y-4 mb-4">
            {cart.map((item) => (
              <View
                key={item.idProducto}
                className="bg-white p-3 rounded-xl shadow-sm flex-row items-center"
              >
                {/* Imagen */}
                <Image
                  source={{ uri: item.imagen }}
                  className="w-20 h-20 rounded-lg mr-3 bg-slate-200"
                />

                {/* Info */}
                <View className="flex-1">
                  <Text className="text-base font-semibold text-slate-700">
                    {item.producto}
                  </Text>

                  <Text className="text-sm text-slate-500">
                    S/ {item.precioVenta.toFixed(2)}
                  </Text>

                  {/* Controles de cantidad */}
                  <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                      className="p-1"
                      onPress={() => updateQuantity(item.idProducto, -1)}
                    >
                      <MinusIcon size={22} color="#64748b" />
                    </TouchableOpacity>

                    <Text className="mx-3 font-semibold text-slate-700">
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      className="p-1"
                      onPress={() => updateQuantity(item.idProducto, +1)}
                    >
                      <PlusIcon size={22} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Botón eliminar */}
                <TouchableOpacity
                  className="p-2"
                  onPress={() => removeFromCart(item.idProducto)}
                >
                  <TrashIcon size={26} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Total y botones */}
          <View className="bg-white p-4 rounded-xl shadow-md">
            <View className="flex-row justify-between mb-3">
              <Text className="text-lg font-semibold text-slate-700">Total:</Text>
              <Text className="text-lg font-bold text-indigo-600">S/ {getTotal()}</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/views/checkout')}
              className="bg-indigo-600 py-3 rounded-xl shadow text-center"
            >
              <Text className="text-white font-semibold text-lg">Proceder al Pago</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={clearCart}
              className="mt-3 py-3 rounded-xl bg-slate-200"
            >
              <Text className="text-slate-700 text-center font-semibold">
                Vaciar Carrito
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
