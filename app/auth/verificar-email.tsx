import { router } from "expo-router";
import { getAuth, reload, sendEmailVerification } from "firebase/auth";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, Text, View } from "react-native";

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
      await reload(user); // refresca estado desde Firebase
      if (user.emailVerified) {
        Alert.alert(" Email verificado", "Ahora puedes iniciar sesión");
        router.replace("/auth/login");
      } else {
        Alert.alert("Aún no verificado", "Revisa el correo y prueba nuevamente.");
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
        Verifica tu correo
      </Text>
      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        Te enviamos un correo con un enlace para activar tu cuenta.
      </Text>

      <Button title="Reenviar correo de verificación" onPress={reenviarVerificacion} />

      <View style={{ marginTop: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button title="Ya verifiqué mi correo" onPress={comprobarVerificacion} />
        )}
      </View>
    </View>
  );
}
