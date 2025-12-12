import { useAuth } from '@/contexts/AuthContext';
import { usePedidos } from '@/contexts/PedidoContext';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  const { notificaciones } = usePedidos();

  // OCULTAR header en la ruta de Delivery
  if (pathname.includes('delivery')) return null;

  return (
    <SafeAreaView>
      <View className="bg-white shadow px-3 py-3">
        <View className="flex-row items-center justify-between">

          {/* Logo y nombre */}
          <View className="flex-row items-center">
            <Ionicons name="pricetag-outline" size={24} color="indigo" />
            <Text className="ml-2 text-lg font-nunito font-black text-indigo-700">
              MODASTYLE
            </Text>
          </View>

          {/* Usuario + Notificaciones */}
          {user && (
            <View className="flex-row items-center">

              {/* Usuario */}
              <Ionicons name="person-circle-outline" size={24} color="indigo" />
              <Text className="ml-1 text-base font-semibold text-indigo-700">
                {user.nombre || 'Usuario'}
              </Text>

              {/* Notificaciones */}
              <TouchableOpacity
                onPress={() => router.push('/views/pedidos')}
                className="ml-3 relative"
              >
                <Ionicons
                  name="notifications-outline"
                  size={26}
                  color="indigo"
                />

                {notificaciones.length > 0 && (
                  <View className="absolute -top-1 -right-1 bg-red-600 w-5 h-5 rounded-full items-center justify-center">
                    <Text className="text-white text-[10px] font-bold">
                      {notificaciones.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
