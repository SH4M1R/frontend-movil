import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function LoginScreen() {
  const { login, setUser } = useAuth();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para login normal
  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    const success = await login(correo, contrasena);
    setLoading(false);

    if (success) {
      Alert.alert("Bienvenido", "Has iniciado sesión correctamente");
      router.replace('/views/home');
    } else {
      Alert.alert("Error", "Correo o contraseña incorrectos");
    }
  };

  // Función para Modo Invitado
  const handleGuestMode = async () => {
    const guestUser = {
      nombre: "Invitado",
      correo: "invitado@demo.com",
      token: "",
    };

    setUser(guestUser);
    await AsyncStorage.setItem("user", JSON.stringify(guestUser));
    router.replace('/views/home');
  };

  return (
    <LinearGradient colors={["#764ba2", "#667eea"]} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, flexGrow: 1, justifyContent: "center" }}
        >
          {/* Botón Modo Invitado */}
          <TouchableOpacity
            className="absolute top-10 right-6 z-10 bg-indigo-700 rounded-md py-1.5 px-3"
            onPress={handleGuestMode}
          >
            <Text className="text-white font-semibold text-sm">Modo Invitado</Text>
          </TouchableOpacity>

          {/* Logo */}
          <Animated.View entering={FadeInUp.duration(900).springify()} className="items-center mb-6">
            <Image
              source={require("@/assets/img/logo.jpg")}
              className="w-28 h-28 rounded-full"
              resizeMode="contain"
            />
          </Animated.View>

          {/* Formulario */}
          <Animated.View
            entering={FadeInDown.duration(900).springify()}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <Text className="text-center text-2xl font-semibold text-gray-800 mb-5">
              Iniciar Sesión
            </Text>

            {/* Correo */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3 mb-3 h-12">
              <Ionicons name="mail-outline" size={20} color="#666" />
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                className="flex-1 text-base text-gray-800 ml-2"
                keyboardType="email-address"
                autoCapitalize="none"
                value={correo}
                onChangeText={setCorreo}
                editable={!loading}
              />
            </View>

            {/* Contraseña */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3 mb-3 h-12">
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#999"
                secureTextEntry
                className="flex-1 text-base text-gray-800 ml-2"
                value={contrasena}
                onChangeText={setContrasena}
                editable={!loading}
              />
            </View>

            {/* Botón Login */}
            <TouchableOpacity
              className={`bg-indigo-500 py-3 rounded-xl mt-2 ${loading ? "opacity-60" : ""}`}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text className="text-white text-center text-lg font-semibold">
                {loading ? "Ingresando..." : "Iniciar Sesión"}
              </Text>
            </TouchableOpacity>

            {/* Enlace a Registro */}
            <View className="mt-4 items-center">
              <TouchableOpacity onPress={() => router.push("/auth/registro")}>
                <Text className="text-gray-600">
                  ¿No tienes cuenta?{" "}
                  <Text className="text-indigo-500 font-bold">Regístrate</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
