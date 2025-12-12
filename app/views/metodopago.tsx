import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function MetodoPago() {
  const { cart, getTotal, clearCart } = useStore();
  const { user } = useAuth();
  const router = useRouter();
  const { confirmPayment } = useStripe();

  const [metodo, setMetodo] = useState<"efectivo" | "transferencia" | "tarjeta">("efectivo");
  const [nombreTarjeta, setNombreTarjeta] = useState(user?.nombre || "");
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const baseURL = "http://10.248.48.237:8500"; // Ajusta según tu plataforma

  const total = getTotal();

  // Crear PaymentIntent al seleccionar tarjeta
  useEffect(() => {
    if (metodo === "tarjeta" && user) {
      crearPaymentIntent();
    }
  }, [metodo]);

  // Sincroniza carrito con backend
  const sincronizarCarrito = async () => {
    if (!user) return;
    try {
      await Promise.all(
        cart.map(item =>
          fetch(`${baseURL}/api/carrito/agregar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usuarioId: user.idUsuario,
              productoId: item.idProducto,
              cantidad: item.quantity
            }),
          })
        )
      );
    } catch (error) {
      console.log("Error sincronizando carrito:", error);
      Alert.alert("Error", "No se pudo sincronizar el carrito con el servidor.");
    }
  };

  // Crear PaymentIntent en backend
  const crearPaymentIntent = async () => {
    if (!user) return;

    if (total <= 0) {
      Alert.alert("Error", "El total debe ser mayor que 0.");
      return;
    }

    await sincronizarCarrito();

    try {
      const res = await fetch(`${baseURL}/api/pago/crear-intencion-pago/${user.idUsuario}`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.mensaje || "No se pudo crear la intención de pago.");
        return;
      }

      setClientSecret(data.clientSecret);
    } catch (e) {
      console.log("Error PaymentIntent:", e);
      Alert.alert("Error", "No se pudo crear la intención de pago.");
    }
  };

  const handlePago = async () => {
    if (cart.length === 0) {
      Alert.alert("Carrito vacío", "Agrega productos antes de pagar.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "Usuario no encontrado.");
      return;
    }

    if (total <= 0) {
      Alert.alert("Error", "El total debe ser mayor a 0.");
      return;
    }

    setIsLoading(true);

    try {
      await sincronizarCarrito(); // Siempre sincroniza antes de confirmar venta
      let ventaResponse;

      if (metodo === "tarjeta") {
        if (!clientSecret) {
          Alert.alert("Error", "PaymentIntent no creado.");
          setIsLoading(false);
          return;
        }

        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          paymentMethodType: "Card",
          paymentMethodData: { billingDetails: { name: nombreTarjeta } },
        });

        if (error) {
          Alert.alert("Error en pago", error.message ?? "No se pudo procesar la tarjeta.");
          setIsLoading(false);
          return;
        }

        if (paymentIntent) {
          const res = await fetch(`${baseURL}/api/pago/confirmar-venta`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usuarioId: user.idUsuario,
              metodoPago: "stripe",
              paymentIntentId: paymentIntent.id,
            }),
          });

          ventaResponse = await res.json();
        }
      } else {
        // Efectivo o transferencia
        const res = await fetch(`${baseURL}/api/pago/confirmar-venta`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: user.idUsuario,
            metodoPago: metodo,
          }),
        });

        ventaResponse = await res.json();
      }

      await clearCart(); // Vaciar carrito frontend + backend
      router.push("/views/confirmacion");
    } catch (e) {
      console.log("Error pago:", e);
      Alert.alert("Error", "No se pudo procesar el pago.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 pt-5">
      <Text className="text-2xl font-bold text-indigo-700 mb-4">Selecciona método de pago</Text>

      <View className="flex-row justify-between mb-4">
        {["efectivo", "transferencia", "tarjeta"].map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setMetodo(m as any)}
            className={`flex-1 py-3 mx-1 rounded-xl border-2 ${
              metodo === m ? "border-indigo-700 bg-indigo-100" : "border-gray-300 bg-white"
            }`}
          >
            <Text className="text-center text-indigo-700 font-semibold capitalize">{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {metodo === "tarjeta" && (
        <View className="bg-white p-4 rounded-2xl shadow mb-4">
          <Text className="text-gray-700 mb-2 font-semibold">Nombre en la tarjeta</Text>
          <Text className="p-3 border border-gray-300 rounded-xl mb-3 bg-gray-100">{nombreTarjeta}</Text>
          <CardField
            postalCodeEnabled={false}
            cardStyle={{ backgroundColor: "#FFFFFF", textColor: "#000000", borderRadius: 8 }}
            style={{ height: 200, marginBottom: 16, borderRadius: 8 }}
          />
        </View>
      )}

      <View className="bg-white p-4 rounded-2xl shadow">
        <Text className="text-lg font-semibold text-gray-700 mb-4">
          Total: S/. {total.toFixed(2)}
        </Text>

        <TouchableOpacity
          onPress={handlePago}
          disabled={isLoading}
          className={`py-3 rounded-xl ${isLoading ? "bg-indigo-300" : "bg-indigo-700"}`}
        >
          <Text className="text-center text-white font-bold text-lg">
            {isLoading ? "Procesando..." : "Pagar"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
