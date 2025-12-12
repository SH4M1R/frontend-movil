import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Pedido {
  idVentaOnline: number;
  usuario: { nombre: string };
  estado: "PENDIENTE" | "EN_RUTA" | "ENTREGADO" | "CANCELADO";
  total: number;
  fechaVenta: string;
}

interface LocalEvidence {
  fotoUri: string | null;
  descripcion: string | null;
  fechaGuardado?: string;
  estado?: string | null;
}

/* ------------------------------------------
   CARD DE PEDIDO (Mejorado solo en diseño)
-------------------------------------------*/
const PedidoCard = ({
  pedido,
  onRequestFinalizar,
}: {
  pedido: Pedido;
  onRequestFinalizar: (pedido: Pedido) => void;
}) => {
  let statusClass = "";
  let nextStatusText = "";
  let nextStatusValue: Pedido["estado"] | null = null;

  switch (pedido.estado) {
    case "PENDIENTE":
      statusClass = "bg-yellow-50 border-yellow-400";
      nextStatusText = "Recoger (EN_RUTA)";
      nextStatusValue = "EN_RUTA";
      break;
    case "EN_RUTA":
      statusClass = "bg-indigo-50 border-indigo-500";
      nextStatusText = "Finalizar (ENTREGADO)";
      nextStatusValue = "ENTREGADO";
      break;
    case "ENTREGADO":
      statusClass = "bg-green-50 border-green-500";
      nextStatusText = "Finalizado";
      nextStatusValue = null;
      break;
    default:
      statusClass = "bg-gray-100 border-gray-400";
      nextStatusText = "";
      nextStatusValue = null;
  }

  return (
    <View
      className={`rounded-2xl p-5 mb-4 border ${statusClass} shadow-md shadow-black/10`}
    >
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-xl font-extrabold text-gray-900">
          Orden #{pedido.idVentaOnline}
        </Text>
        <Text className="text-indigo-700 font-black text-lg">
          S/ {pedido.total.toFixed(2)}
        </Text>
      </View>

      <Text className="text-gray-700 text-sm mb-1">
        <Text className="font-semibold">Cliente:</Text> {pedido.usuario.nombre}
      </Text>

      <Text className="text-gray-700 text-sm mb-4">
        <Text className="font-semibold">Fecha:</Text>{" "}
        {new Date(pedido.fechaVenta).toLocaleString()}
      </Text>

      <View className="flex-row justify-between items-center pt-4 border-t border-gray-200">
        <View>
          <Text className="text-xs text-gray-500">Estado actual</Text>
          <Text className="text-base font-bold text-indigo-700">
            {pedido.estado}
          </Text>
        </View>

        {nextStatusValue ? (
          <TouchableOpacity
            className="bg-indigo-600 px-5 py-2.5 rounded-xl shadow shadow-indigo-300"
            onPress={() => onRequestFinalizar(pedido)}
            disabled={pedido.estado === "ENTREGADO"}
          >
            <Text className="text-white text-sm font-bold">
              {nextStatusText}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-gray-200 px-5 py-2.5 rounded-xl"
            onPress={() => onRequestFinalizar(pedido)}
          >
            <Text className="text-gray-700 text-sm font-semibold">Ver</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function DeliveryScreen() {
  const { user, logout } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const API = "http://10.0.2.2:8500/api/pago";

  const [mostrarModal, setMostrarModal] = useState(false);
  const [pedidoActual, setPedidoActual] = useState<Pedido | null>(null);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [evidenceLoading, setEvidenceLoading] = useState(false);

  const [filter, setFilter] = useState<"TODOS" | "ACTIVOS" | "ENTREGADOS">(
    "ACTIVOS"
  );

  useEffect(() => {
    if (user && user.rol !== "delivery") {
      Alert.alert("Acceso Denegado", "Solo repartidores pueden acceder.");
      router.replace("/auth/login");
    }
  }, [user]);

  const fetchPedidos = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const { data } = await axios.get<Pedido[]>(`${API}/listar`);
      setPedidos(data || []);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      logout(); 
      router.replace("/auth/login");
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filter === "TODOS") return true;
    if (filter === "ACTIVOS")
      return p.estado !== "ENTREGADO" && p.estado !== "CANCELADO";
    if (filter === "ENTREGADOS") return p.estado === "ENTREGADO";
    return true;
  });

  const openModalForPedido = async (pedido: Pedido) => {
    setPedidoActual(pedido);
    try {
      const key = `deliveryData_${pedido.idVentaOnline}`;
      const raw = await AsyncStorage.getItem(key);
      if (raw) {
        const parsed: LocalEvidence = JSON.parse(raw);
        setFotoUri(parsed.fotoUri ?? null);
        setDescripcion(parsed.descripcion ?? "");
      } else {
        setFotoUri(null);
        setDescripcion("");
      }
    } catch {
      setFotoUri(null);
      setDescripcion("");
    }
    setMostrarModal(true);
  };

  const pickImageFromCamera = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso requerido", "Activa cámara.");
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.6,
        base64: false,
      });

      if (!result.canceled) {
        setFotoUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert("Error", "No se pudo abrir la cámara.");
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        quality: 0.6,
        base64: false,
      });
      if (!res.canceled) setFotoUri(res.assets[0].uri);
    } catch {
      Alert.alert("Error", "No se pudo abrir la galería.");
    }
  };

  const saveLocalEvidence = async (
    id: number,
    foto: string | null,
    desc: string | null,
    estado: string | null
  ) => {
    try {
      const key = `deliveryData_${id}`;
      const payload: LocalEvidence = {
        fotoUri: foto,
        descripcion: desc,
        fechaGuardado: new Date().toISOString(),
        estado,
      };
      await AsyncStorage.setItem(key, JSON.stringify(payload));
    } catch {}
  };

  const actualizarEstadoBackend = async (
    id: number,
    nuevoEstado: Pedido["estado"]
  ) => {
    setEvidenceLoading(true);
    try {
      await axios.put(`${API}/estado/${id}`, null, {
        params: { estado: nuevoEstado },
      });

      await saveLocalEvidence(id, fotoUri, descripcion, nuevoEstado);
      await fetchPedidos();

      Alert.alert("Éxito", `Pedido actualizado a "${nuevoEstado}".`);
      setMostrarModal(false);
      setPedidoActual(null);
      setFotoUri(null);
      setDescripcion("");
    } finally {
      setEvidenceLoading(false);
    }
  };

  const confirmarAccion = async (nuevoEstado: Pedido["estado"]) => {
    if (!pedidoActual) return;
    if (!fotoUri)
      return Alert.alert("Falta foto", "Debes tomar/seleccionar una foto.");
    if (!descripcion.trim())
      return Alert.alert("Falta descripción", "Ingresa una descripción.");

    Alert.alert(
      "Confirmar",
      `¿Marcar como "${nuevoEstado}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí",
          onPress: async () =>
            await actualizarEstadoBackend(
              pedidoActual.idVentaOnline,
              nuevoEstado
            ),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* NAVBAR */}
      <View className="bg-indigo-700 p-4 flex-row justify-between items-center shadow-lg shadow-black/20">
        <Text className="text-2xl font-extrabold text-white">
          Panel de Reparto
        </Text>

        <View className="flex-row items-center space-x-1">
          {/* Logout */}
          <TouchableOpacity
            onPress={() => {
              logout();
              router.replace("/auth/login");
            }}
            className="flex-row items-center px-3 py-1 rounded-md bg-red-600 shadow"
          >
            <Text className="text-white text-xs font-bold mr-1">Salir</Text>
            <Ionicons name="log-out-outline" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row items-center space-x-2 px-4 py-3 bg-white shadow">
      {["ACTIVOS", "ENTREGADOS", "TODOS"].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f as any)}
              className={`px-3 py-1 rounded-md ${
                filter === f
                  ? "bg-indigo-500"
                  : "bg-white border border-indigo-200"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  filter === f ? "text-white" : "text-indigo-700"
                }`}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
      {/* LISTA */}
      <ScrollView
        className="p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchPedidos}
            colors={["#4f46e5"]}
          />
        }
      >
        <Text className="text-xl font-extrabold text-gray-800 mb-4 mt-2">
          Pedidos ({pedidosFiltrados.length})
        </Text>

        {loading && (
          <ActivityIndicator size="small" color="#4f46e5" className="my-3" />
        )}

        {pedidosFiltrados.length === 0 && !loading && (
          <View className="bg-white p-6 rounded-xl border border-indigo-200 items-center mt-10">
            <Ionicons
              name="checkmark-circle-outline"
              size={55}
              color="#4f46e5"
            />
            <Text className="mt-4 text-gray-600 text-base font-semibold">
              No hay pedidos.
            </Text>
          </View>
        )}

        {pedidosFiltrados.map((pedido) => (
          <PedidoCard
            key={pedido.idVentaOnline}
            pedido={pedido}
            onRequestFinalizar={openModalForPedido}
          />
        ))}

        <View className="h-20" />
      </ScrollView>

      {/* MODAL */}
      {mostrarModal && pedidoActual && (
        <View className="absolute inset-0 bg-black/60 justify-center items-center px-6">
          <View className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">
            <Text className="text-lg font-extrabold mb-2 text-gray-900">
              Evidencia — Pedido #{pedidoActual.idVentaOnline}
            </Text>

            <Text className="text-sm text-gray-600 mb-3">
              Estado actual:{" "}
              <Text className="font-bold">{pedidoActual.estado}</Text>
            </Text>

            {/* botones foto */}
            <View className="flex-row space-x-2 mb-4">
              <TouchableOpacity
                className="flex-1 bg-indigo-600 p-3 rounded-xl shadow"
                onPress={pickImageFromCamera}
              >
                <Text className="text-white text-center font-bold">
                  Cámara
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 border border-indigo-600 p-3 rounded-xl"
                onPress={pickImageFromGallery}
              >
                <Text className="text-indigo-600 text-center font-bold">
                  Galería
                </Text>
              </TouchableOpacity>
            </View>

            {fotoUri ? (
              <Image
                source={{ uri: fotoUri }}
                className="w-full h-56 rounded-xl mb-4"
              />
            ) : (
              <View className="py-8 items-center border border-gray-200 rounded-xl mb-4">
                <Text className="text-gray-500">No hay foto aún</Text>
              </View>
            )}

            <TextInput
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Descripción"
              multiline
              className="border border-gray-300 rounded-xl p-3 min-h-[80px] mb-4 text-gray-700"
            />

            <View className="flex-row space-x-2">
              <TouchableOpacity
                disabled={evidenceLoading}
                className={`flex-1 p-3 rounded-xl bg-green-600 ${
                  !fotoUri || !descripcion.trim() ? "opacity-50" : ""
                }`}
                onPress={() => confirmarAccion("ENTREGADO")}
              >
                {evidenceLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-center">
                    Marcar ENTREGADO
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                disabled={evidenceLoading}
                className={`flex-1 p-3 rounded-xl bg-red-600 ${
                  !fotoUri || !descripcion.trim() ? "opacity-50" : ""
                }`}
                onPress={() => confirmarAccion("CANCELADO")}
              >
                {evidenceLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-center">
                    NO ENTREGADO
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="mt-4 p-3 rounded-xl bg-gray-200"
              onPress={() => setMostrarModal(false)}
            >
              <Text className="text-center font-bold text-gray-700">
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
