import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Confirmacion() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 px-4">
      <Text className="text-6xl mb-4">✅</Text>
      <Text className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        ¡Compra realizada con éxito!
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/views/home")}
        className="bg-indigo-700 px-6 py-3 rounded-full"
      >
        <Text className="text-white text-lg font-semibold">Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}
