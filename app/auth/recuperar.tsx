import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function RecuperarContrasenaScreen() {
  const { requestPasswordReset, resetPassword } = useAuth();
  const [step, setStep] = useState(1); // 1: Solicitar código, 2: Resetear
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [loading, setLoading] = useState(false);

  // Paso 1: Solicitar Código
  const handleRequestCode = async () => {
    if (!correo) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico.");
      return;
    }

    setLoading(true);
    const success = await requestPasswordReset(correo);
    setLoading(false);

    if (success) {
      Alert.alert(
        "Código Enviado",
        "Si el correo existe, hemos enviado un código de 6 dígitos. Revisa tu bandeja de entrada (y spam)."
      );
      setStep(2); // Pasar al paso de reseteo
    } else {
      Alert.alert(
        "Error",
        "Ocurrió un error al intentar enviar el código. Intenta de nuevo."
      );
    }
  };

  // Paso 2: Resetear Contraseña
  const handleResetPassword = async () => {
    if (!codigo || !nuevaContrasena) {
      Alert.alert("Error", "Completa el código y la nueva contraseña.");
      return;
    }

    setLoading(true);
    const success = await resetPassword(correo, codigo, nuevaContrasena);
    setLoading(false);

    if (success) {
      Alert.alert("Éxito", "Tu contraseña ha sido restablecida correctamente.");
      router.replace("/auth/login");
    } else {
      Alert.alert("Error", "Código inválido, expirado o error al actualizar.");
    }
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
          <Animated.View
            entering={FadeInDown.duration(900).springify()}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <Text className="text-center text-2xl font-semibold text-gray-800 mb-5">
              {step === 1 ? "Recuperar Contraseña" : "Verificar Código"}
            </Text>

            {/* PASO 1: Ingresar Correo */}
            {step === 1 && (
              <>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-3 mb-4 h-12">
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

                <TouchableOpacity
                  className={`bg-indigo-500 py-3 rounded-xl mt-2 ${loading ? "opacity-60" : ""}`}
                  onPress={handleRequestCode}
                  disabled={loading}
                >
                  <Text className="text-white text-center text-lg font-semibold">
                    {loading ? "Enviando..." : "Enviar Código"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* PASO 2: Ingresar Código y Contraseña */}
            {step === 2 && (
              <>
                <Text className="text-center text-gray-600 mb-4">
                  Ingresa el código enviado a **{correo}** y tu nueva contraseña.
                </Text>

                {/* Código */}
                <View className="flex-row items-center border border-gray-300 rounded-xl px-3 mb-3 h-12">
                  <Ionicons name="key-outline" size={20} color="#666" />
                  <TextInput
                    placeholder="Código de 6 dígitos"
                    placeholderTextColor="#999"
                    className="flex-1 text-base text-gray-800 ml-2"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={codigo}
                    onChangeText={setCodigo}
                    editable={!loading}
                  />
                </View>
                
                {/* Nueva Contraseña */}
                <View className="flex-row items-center border border-gray-300 rounded-xl px-3 mb-4 h-12">
                  <Ionicons name="lock-closed-outline" size={20} color="#666" />
                  <TextInput
                    placeholder="Nueva Contraseña"
                    placeholderTextColor="#999"
                    secureTextEntry
                    className="flex-1 text-base text-gray-800 ml-2"
                    value={nuevaContrasena}
                    onChangeText={setNuevaContrasena}
                    editable={!loading}
                  />
                </View>

                <TouchableOpacity
                  className={`bg-indigo-500 py-3 rounded-xl mt-2 ${loading ? "opacity-60" : ""}`}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  <Text className="text-white text-center text-lg font-semibold">
                    {loading ? "Actualizando..." : "Restablecer Contraseña"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setStep(1)} 
                    className="mt-4 items-center"
                >
                    <Text className="text-gray-500 text-sm">
                        Volver a solicitar código
                    </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity 
                onPress={() => router.replace("/auth/login")} 
                className="mt-4 items-center"
            >
                <Text className="text-indigo-500 font-bold">
                    Volver al Login
                </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}