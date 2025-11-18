import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">
      {/* Header */}
      <View className="bg-indigo-600 p-6 rounded-2xl items-center mb-5">
        <Image
          source={require("@/assets/img/logo.jpg")}
          className="w-24 h-24 rounded-full border-4 border-white"
        />
        <Text className="text-white text-xl font-semibold mt-3">
          {user?.nombre || "Invitado"}
        </Text>
        <Text className="text-indigo-200 text-sm">{user?.correo}</Text>
      </View>

      {/* Opciones */}
      <View className="bg-white rounded-xl p-4 shadow-md">
        {/* Editar Perfil */}
        <TouchableOpacity
          onPress={() => router.push("/views/editarPerfil")}
          className="flex-row items-center py-4 border-b border-gray-200"
        >
          <Ionicons name="person-outline" size={24} color="#4f46e5" />
          <Text className="ml-3 text-gray-800 text-lg">Editar Perfil</Text>
        </TouchableOpacity>

        {/* Direcciones */}
        <TouchableOpacity
          onPress={() => router.push("/views/direcciones")}
          className="flex-row items-center py-4 border-b border-gray-200"
        >
          <Ionicons name="location-outline" size={24} color="#4f46e5" />
          <Text className="ml-3 text-gray-800 text-lg">Direcciones</Text>
        </TouchableOpacity>

        {/* Favoritos */}
        <TouchableOpacity
          onPress={() => router.push("/views/favoritos")}
          className="flex-row items-center py-4 border-b border-gray-200"
        >
          <Ionicons name="heart-outline" size={24} color="#4f46e5" />
          <Text className="ml-3 text-gray-800 text-lg">Favoritos</Text>
        </TouchableOpacity>

        {/* Pedidos */}
        <TouchableOpacity
          onPress={() => router.push("/views/pedidos")}
          className="flex-row items-center py-4 border-b border-gray-200"
        >
          <Ionicons name="receipt-outline" size={24} color="#4f46e5" />
          <Text className="ml-3 text-gray-800 text-lg">Mis Pedidos</Text>
        </TouchableOpacity>

        {/* Cerrar Sesión */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center py-4 mt-2"
        >
          <Ionicons name="log-out-outline" size={24} color="red" />
          <Text className="ml-3 text-red-600 text-lg font-semibold">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
