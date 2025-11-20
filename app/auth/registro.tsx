import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";
const auth = getAuth();

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

export default function RegisterScreen() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const handleRegister = async () => {
  if (!nombre || !correo || !direccion || !contrasena || !confirmar) {
    Alert.alert("Error", "Completa todos los campos");
    return;
  }

  if (contrasena !== confirmar) {
    Alert.alert("Error", "Las contraseñas no coinciden");
    return;
  }

  setLoading(true);

  try {
    // Crear usuario en Firebase
    const userCred = await createUserWithEmailAndPassword(auth, correo, contrasena);

    // Enviar verificación al correo
    await sendEmailVerification(userCred.user);

    // Registrar también en tu backend (solo si Firebase fue exitoso)
    const nuevoUsuario = { nombre, correo, direccion, contrasena };
    await fetch("http://10.0.2.2:8500/api/usuarios/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario),
    });

    Alert.alert(
      "Verifica tu correo",
      "Te enviamos un enlace. Debes verificar antes de iniciar sesión."
    );

    // Mandamos al usuario a la pantalla verificar-email
    router.replace("../auth/verificar-email");

  } catch (error: any) {
    console.error(error);
    Alert.alert("Error", error.message || "Ocurrió un problema");
  }

  setLoading(false);
};
  /*const handleRegister = async () => {
    if (!nombre || !correo || !direccion || !contrasena || !confirmar) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (contrasena !== confirmar) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      // JSON que enviamos al backend
      const nuevoUsuario = {
        nombre,
        correo,
        direccion,
        contrasena,
      };

      const response = await fetch("http://10.0.2.2:8500/api/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        Alert.alert("Registro exitoso", "Tu cuenta ha sido creada correctamente");
        router.replace("/auth/login"); // redirige al login
      } else {
        Alert.alert("Error", "No se pudo registrar el usuario");
      }
    } catch (error) {
      Alert.alert("Error de conexión", "No se pudo conectar al servidor");
      console.error(error);
    }

    setLoading(false);
  };*/

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, flexGrow: 1, justifyContent: "center" }}
        >
          {/* Botón volver */}
          <TouchableOpacity onPress={() => router.back()} className="absolute top-10 left-5 z-10">
            <Ionicons name="arrow-back" size={26} color="white" />
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
              Crear Cuenta
            </Text>

            {/* Nombre */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3 mb-3 h-12">
              <Ionicons name="person-outline" size={20} color="#666" />
              <TextInput
                placeholder="Nombre completo"
                placeholderTextColor="#999"
                className="flex-1 text-base text-gray-800 ml-2"
                value={nombre}
                onChangeText={setNombre}
                editable={!loading}
              />
            </View>

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

            {/* Dirección */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3 mb-3 h-12">
              <Ionicons name="home-outline" size={20} color="#666" />
              <TextInput
                placeholder="Dirección"
                placeholderTextColor="#999"
                className="flex-1 text-base text-gray-800 ml-2"
                value={direccion}
                onChangeText={setDireccion}
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

            {/* Confirmar Contraseña */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3 mb-3 h-12">
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                placeholder="Confirmar contraseña"
                placeholderTextColor="#999"
                secureTextEntry
                className="flex-1 text-base text-gray-800 ml-2"
                value={confirmar}
                onChangeText={setConfirmar}
                editable={!loading}
              />
            </View>

            {/* Botón Registrar */}
            <TouchableOpacity
              className={`bg-indigo-500 py-3 rounded-xl mt-2 ${loading ? "opacity-60" : ""}`}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white text-center text-lg font-semibold">
                {loading ? "Creando cuenta..." : "Registrar"}
              </Text>
            </TouchableOpacity>

            {/* Enlace a Login */}
            <View className="mt-4 items-center">
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text className="text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <Text className="text-indigo-500 font-bold">Inicia sesión</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}