import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { getAuth, reload, sendEmailVerification } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function VerificarEmail() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(false);

  const reenviarVerificacion = async () => {
    if (!user) return;

    try {
      await sendEmailVerification(user);
      Alert.alert("Correo enviado", "Revisa tu bandeja de entrada 🎯");
    } catch (e) {
      Alert.alert("Error", "No se pudo enviar el correo");
      console.log(e);
    }
  };

  const comprobarVerificacion = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await reload(user);

      if (user.emailVerified) {
        Alert.alert("Email verificado", "Ahora puedes iniciar sesión");
        router.replace("/auth/login"); // 🔥 SIN CAMBIAR
      } else {
        Alert.alert("Aún no verificado", "Revisa el correo y prueba nuevamente.");
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  return (
    <LinearGradient colors={["#764ba2", "#667eea"]} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          {/* Logo */}
          <Animated.View
            entering={FadeInUp.duration(900).springify()}
            className="items-center mb-6"
          >
            <Image
              source={require("@/assets/img/logo.jpg")}
              className="w-28 h-28 rounded-full"
              resizeMode="contain"
            />
          </Animated.View>

          {/* Tarjeta */}
          <Animated.View
            entering={FadeInDown.duration(900).springify()}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <Text className="text-center text-2xl font-semibold text-gray-800 mb-3">
              Verifica tu correo
            </Text>

            <Text className="text-center text-gray-600 mb-6">
              Te enviamos un enlace a tu correo.  
              Presiona el botón cuando ya lo hayas verificado.
            </Text>

            {/* BOTÓN REENVIAR */}
            <TouchableOpacity
              onPress={reenviarVerificacion}
              className="bg-indigo-500 py-3 rounded-xl mb-4"
            >
              <Text className="text-white text-center text-lg font-semibold">
                Reenviar correo de verificación
              </Text>
            </TouchableOpacity>

            {/* BOTÓN COMPROBAR */}
            <TouchableOpacity
              onPress={comprobarVerificacion}
              disabled={loading}
              className={`bg-green-500 py-3 rounded-xl ${
                loading ? "opacity-60" : ""
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Ya verifiqué mi correo
                </Text>
              )}
            </TouchableOpacity>

            {/* Regresar al login */}
            <TouchableOpacity
              onPress={() => router.replace("/auth/login")}
              className="flex-row justify-center mt-5"
            >
              <Ionicons name="arrow-back" size={16} color="#667eea" />
              <Text className="text-indigo-500 font-semibold ml-2">
                Volver al inicio de sesión
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
