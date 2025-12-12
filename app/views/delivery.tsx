import { useAuth } from "@/contexts/AuthContext";
import { Pedido as PedidoType, usePedidos } from "@/contexts/PedidoContext";
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
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LocalEvidence {
  fotoUri: string | null;
  descripcion: string | null;
  fechaGuardado?: string;
  estado?: string | null;
}

// =========================================================================
// PedidoCard (SIN CAMBIOS)
// =========================================================================
const PedidoCard = ({
  pedido,
  onRequestFinalizar,
}: {
  pedido: PedidoType;
  onRequestFinalizar: (pedido: PedidoType) => void;
}) => {
  let statusClass = "";
  let nextStatusText = "";
  let nextStatusValue: PedidoType["estado"] | null = null;

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
    <View className={`rounded-2xl p-5 mb-4 border ${statusClass} shadow-md shadow-black/10`}>
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
        <Text className="font-semibold">Fecha:</Text> {new Date(pedido.fechaVenta).toLocaleString()}
      </Text>

      <View className="flex-row justify-between items-center pt-4 border-t border-gray-200">
        <View>
          <Text className="text-xs text-gray-500">Estado actual</Text>
          <Text className="text-base font-bold text-indigo-700">{pedido.estado}</Text>
        </View>

        {nextStatusValue ? (
          <TouchableOpacity
            className="bg-indigo-600 px-5 py-2.5 rounded-xl shadow shadow-indigo-300"
            onPress={() => onRequestFinalizar(pedido)}
            disabled={pedido.estado === "ENTREGADO"}
          >
            <Text className="text-white text-sm font-bold">{nextStatusText}</Text>
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

// =========================================================================
// DeliveryScreen (MODIFICADO)
// =========================================================================
export default function DeliveryScreen() {
  const { user, logout } = useAuth();
  const { setPedidosGlobal, setNotificaciones } = usePedidos();

  const [pedidos, setPedidos] = useState<PedidoType[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const API = "http://10.248.48.237:8500/api/pago";

  const [mostrarModal, setMostrarModal] = useState(false);
  const [pedidoActual, setPedidoActual] = useState<PedidoType | null>(null);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [evidenceLoading, setEvidenceLoading] = useState(false);

  const [filter, setFilter] = useState<"TODOS" | "ACTIVOS" | "ENTREGADOS">("ACTIVOS");

  // Variable para determinar si se puede finalizar (ENTREGADO/CANCELADO)
  const puedeFinalizar = fotoUri && descripcion.trim();

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
      const { data } = await axios.get<PedidoType[]>(`${API}/listar`);
      setPedidos(data || []);
      setPedidosGlobal(data || []);
      const activos = data?.filter(p => p.estado !== "ENTREGADO" && p.estado !== "CANCELADO").length || 0;
      setNotificaciones(activos);
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

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filter === "TODOS") return true;
    if (filter === "ACTIVOS") return p.estado !== "ENTREGADO" && p.estado !== "CANCELADO";
    if (filter === "ENTREGADOS") return p.estado === "ENTREGADO";
    return true;
  });

  // LÓGICA MODIFICADA: Abrir modal solo si está EN_RUTA. Si está PENDIENTE, se cambia directo.
  const openModalForPedido = async (pedido: PedidoType) => {
    if (pedido.estado === "PENDIENTE") {
      // Si está PENDIENTE, preguntar si quiere ponerlo EN_RUTA y ejecutar la acción de inmediato.
      Alert.alert(
        "Confirmar Recojo",
        `¿Confirmas que has recogido el pedido #${pedido.idVentaOnline} y lo pones EN RUTA?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Sí", onPress: () => actualizarEstadoBackend(pedido.idVentaOnline, "EN_RUTA", false) },
        ]
      );
      return;
    }

    if (pedido.estado === "EN_RUTA") {
      // Si está EN_RUTA, abrir el modal de evidencia.
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
      return;
    }

    // Si está ENTREGADO/CANCELADO/etc., solo se cierra o muestra un mensaje.
    if (pedido.estado === "ENTREGADO" || pedido.estado === "CANCELADO") {
      Alert.alert("Pedido Finalizado", `El pedido #${pedido.idVentaOnline} ya se encuentra ${pedido.estado}.`);
    }
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
      const result = await ImagePicker.launchCameraAsync({ quality: 0.6, base64: false });
      if (!result.canceled) setFotoUri(result.assets[0].uri);
    } catch {
      Alert.alert("Error", "No se pudo abrir la cámara.");
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.6, base64: false });
      if (!res.canceled) setFotoUri(res.assets[0].uri);
    } catch {
      Alert.alert("Error", "No se pudo abrir la galería.");
    }
  };

  const saveLocalEvidence = async (id: number, foto: string | null, desc: string | null, estado: string | null) => {
    try {
      const key = `deliveryData_${id}`;
      const payload: LocalEvidence = { fotoUri: foto, descripcion: desc, fechaGuardado: new Date().toISOString(), estado };
      await AsyncStorage.setItem(key, JSON.stringify(payload));
    } catch {}
  };

  // Función de actualización ajustada
  const actualizarEstadoBackend = async (id: number, nuevoEstado: PedidoType["estado"], requiereEvidencia: boolean = true) => {
    setEvidenceLoading(true);
    try {
      await axios.put(`${API}/estado/${id}`, null, { params: { estado: nuevoEstado } });
      
      // Solo guardar evidencia local si se requirió (ENTREGADO/CANCELADO)
      if (requiereEvidencia) {
        await saveLocalEvidence(id, fotoUri, descripcion, nuevoEstado);
      } else {
        // Para EN_RUTA, se puede limpiar o simplemente no hacer nada con la evidencia.
        await saveLocalEvidence(id, null, null, nuevoEstado);
      }

      await fetchPedidos();
      Alert.alert("Éxito", `Pedido actualizado a "${nuevoEstado}".`);
      closeModal(); // Cerrar el modal si estaba abierto
    } catch (error) {
       Alert.alert("Error", `No se pudo actualizar el pedido a "${nuevoEstado}".`);
    } finally {
      setEvidenceLoading(false);
    }
  };

  const confirmarAccion = async (nuevoEstado: PedidoType["estado"]) => {
    if (!pedidoActual) return;
    
    // Validaciones solo para estados finales (ENTREGADO/CANCELADO)
    if (nuevoEstado !== "EN_RUTA") {
        if (!fotoUri) return Alert.alert("Falta foto", "Debes tomar/seleccionar una foto.");
        if (!descripcion.trim()) return Alert.alert("Falta descripción", "Ingresa una descripción.");
    }

    Alert.alert("Confirmar", `¿Marcar como "${nuevoEstado}"?`, [
      { text: "Cancelar", style: "cancel" },
      // Notar que ahora enviamos `true` para `requiereEvidencia`
      { text: "Sí", onPress: async () => await actualizarEstadoBackend(pedidoActual.idVentaOnline, nuevoEstado, true) },
    ]);
  };

  const closeModal = () => {
    setMostrarModal(false);
    setPedidoActual(null);
    setFotoUri(null);
    setDescripcion("");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* NAVBAR y FILTROS (SIN CAMBIOS) */}
      <View className="bg-indigo-700 p-4 flex-row justify-between items-center shadow-lg shadow-black/20">
        <Text className="text-2xl font-extrabold text-white">Panel de Reparto</Text>
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            logout();
            router.replace("/auth/login");
          }}
          className="flex-row items-center px-3 py-1 rounded-md bg-red-600 shadow"
        >
          <Text className="text-white text-xs font-bold mr-1">Salir</Text>
          <Ionicons name="log-out-outline" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center space-x-2 px-4 py-3 bg-white shadow">
        {["ACTIVOS", "ENTREGADOS", "TODOS"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f as any)}
            className={`px-3 py-1 rounded-md ${filter === f ? "bg-indigo-500" : "bg-white border border-indigo-200"}`}
          >
            <Text className={`text-xs font-bold ${filter === f ? "text-white" : "text-indigo-700"}`}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTA (SIN CAMBIOS) */}
      <ScrollView
        className="p-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPedidos} colors={["#4f46e5"]} />}
      >
        <Text className="text-xl font-extrabold text-gray-800 mb-4 mt-2">
          Pedidos ({pedidosFiltrados.length})
        </Text>

        {loading && <ActivityIndicator size="small" color="#4f46e5" className="my-3" />}

        {pedidosFiltrados.length === 0 && !loading && (
          <View className="bg-white p-6 rounded-xl border border-indigo-200 items-center mt-10">
            <Ionicons name="checkmark-circle-outline" size={55} color="#4f46e5" />
            <Text className="mt-4 text-gray-600 text-base font-semibold">No hay pedidos.</Text>
          </View>
        )}

        {pedidosFiltrados.map((pedido) => (
          <PedidoCard key={pedido.idVentaOnline} pedido={pedido} onRequestFinalizar={openModalForPedido} />
        ))}

        <View className="h-20" />
      </ScrollView>

      {/* MODAL (AHORA SOLO PARA EVIDENCIA cuando el estado es EN_RUTA) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={mostrarModal && pedidoActual?.estado === "EN_RUTA"} // Solo visible si está EN_RUTA
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-center items-center bg-black/70 p-4">
          <View className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* TÍTULO Y ESTADO */}
                <View className="border-b border-gray-100 pb-3 mb-4">
                    <Text className="text-2xl font-extrabold text-gray-900">
                      Evidencia de Entrega
                    </Text>
                    <Text className="text-lg font-bold mb-2 text-gray-900">
                      Pedido #{pedidoActual?.idVentaOnline}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Estado actual: <Text className="font-bold text-indigo-600">{pedidoActual?.estado}</Text>
                    </Text>
                </View>

                <Text className="text-base text-gray-700 font-semibold mb-3">Sube la foto de la entrega y añade una descripción.</Text>

                {/* BOTONES CÁMARA/GALERÍA */}
                <View className="flex-row space-x-3 mb-4">
                    <TouchableOpacity 
                        className="flex-1 bg-indigo-600 p-3 rounded-xl shadow-md shadow-indigo-300" 
                        onPress={pickImageFromCamera}
                    >
                        <Text className="text-white text-center font-bold">Cámara</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        className="flex-1 border border-indigo-600 p-3 rounded-xl bg-indigo-50" 
                        onPress={pickImageFromGallery}
                    >
                        <Text className="text-indigo-600 text-center font-bold">Galería</Text>
                    </TouchableOpacity>
                </View>

                {/* VISUALIZADOR DE FOTO */}
                {fotoUri ? (
                    <Image 
                        source={{ uri: fotoUri }} 
                        className="w-full h-56 rounded-xl mb-4 border border-gray-300"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="py-8 items-center border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl mb-4">
                        <Ionicons name="camera-outline" size={30} color="#9ca3af" />
                        <Text className="text-gray-500 mt-2">No hay foto aún</Text>
                    </View>
                )}

                {/* DESCRIPCIÓN */}
                <TextInput
                    value={descripcion}
                    onChangeText={setDescripcion}
                    placeholder="Descripción (requerida)"
                    multiline
                    className="border border-gray-300 rounded-xl p-3 min-h-[80px] mb-6 text-gray-700 bg-white"
                />

                {/* BOTONES DE ACCIÓN (ENTREGADO / NO ENTREGADO) */}
                <View className="flex-row space-x-3 mb-4">
                    <TouchableOpacity
                        disabled={evidenceLoading || !puedeFinalizar}
                        className={`flex-1 p-3 rounded-xl ${puedeFinalizar && !evidenceLoading ? "bg-green-600 shadow-lg shadow-green-300/50" : "bg-gray-300 opacity-70"}`}
                        onPress={() => confirmarAccion("ENTREGADO")}
                    >
                        {evidenceLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-center text-sm">Marcar ENTREGADO</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={evidenceLoading || !puedeFinalizar}
                        className={`flex-1 p-3 rounded-xl ${puedeFinalizar && !evidenceLoading ? "bg-red-600 shadow-lg shadow-red-300/50" : "bg-gray-300 opacity-70"}`}
                        onPress={() => confirmarAccion("CANCELADO")}
                    >
                        {evidenceLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-center text-sm">NO ENTREGADO</Text>}
                    </TouchableOpacity>
                </View>

                {/* BOTÓN CERRAR */}
                <TouchableOpacity className="mt-2 p-3 rounded-xl bg-gray-100 border border-gray-200" onPress={closeModal}>
                    <Text className="text-center font-bold text-gray-700">Cerrar</Text>
                </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}