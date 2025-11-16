import React from "react";
import { Text, View } from "react-native";

export default function CheckoutScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-slate-700">
        Pagos & Confirmación
      </Text>
      <Text className="text-slate-500 mt-2">
        Aquí va tu pantalla de Checkout.
      </Text>
    </View>
  );
}
