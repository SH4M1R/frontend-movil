import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Pedido {
  idVentaOnline: number;
  usuario: { nombre: string }; 
  estado: 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'CANCELADO';
  total: number;
  fechaVenta: string;
}

const PedidoCard = ({ pedido, onUpdateEstado }: { pedido: Pedido, onUpdateEstado: (id: number, nuevoEstado: Pedido['estado']) => void }) => {
  let statusClass = '';
  let nextStatusText = '';
  let nextStatusValue: Pedido['estado'] | null = null;

  switch (pedido.estado) {
    case 'PENDIENTE':
      statusClass = 'bg-yellow-100 border-yellow-500';
      nextStatusText = 'Recoger (EN_RUTA)';
      nextStatusValue = 'EN_RUTA';
      break;
    case 'EN_RUTA':
      statusClass = 'bg-indigo-100 border-indigo-500';
      nextStatusText = 'Finalizar (ENTREGADO)';
      nextStatusValue = 'ENTREGADO';
      break;
    case 'ENTREGADO':
      statusClass = 'bg-green-100 border-green-500';
      nextStatusText = 'Finalizado';
      nextStatusValue = null;
      break;
    default:
      statusClass = 'bg-gray-100 border-gray-400';
      nextStatusText = '';
      nextStatusValue = null;
  }

  return (
    <View className={`bg-white rounded-xl shadow-lg p-4 mb-4 border-l-4 ${statusClass}`}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold text-gray-800">Orden #{pedido.idVentaOnline}</Text>
        <Text className="text-indigo-600 font-extrabold text-lg">${pedido.total.toFixed(2)}</Text>
      </View>

      <Text className="text-gray-700 text-sm mb-1">
        <Text className="font-semibold">Cliente:</Text> {pedido.usuario.nombre}
      </Text>

      <Text className="text-gray-700 text-sm mb-3">
        <Text className="font-semibold">Fecha:</Text> {new Date(pedido.fechaVenta).toLocaleString()}
      </Text>

      <View className="flex-row justify-between items-center pt-2 border-t border-gray-100 mt-2">
        <View>
          <Text className="text-xs text-gray-500">Estado Actual:</Text>
          <Text className="text-base font-bold text-indigo-700">{pedido.estado}</Text>
        </View>

        {nextStatusValue && (
          <TouchableOpacity 
            className="bg-indigo-600 px-4 py-2 rounded-lg"
            onPress={() => onUpdateEstado(pedido.idVentaOnline, nextStatusValue!)}
            disabled={pedido.estado === 'ENTREGADO'}
          >
            <Text className="text-white text-sm font-semibold">{nextStatusText}</Text>
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

  useEffect(() => {
    if (user && user.rol !== 'delivery') {
      Alert.alert("Acceso Denegado", "Solo repartidores pueden acceder a esta vista.");
      router.replace('/views/home');
    }
  }, [user]);

  const fetchPedidos = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const { data } = await axios.get<Pedido[]>(`${API}/listar`);
      const activos = data.filter(p => p.estado !== 'ENTREGADO' && p.estado !== 'CANCELADO');
      setPedidos(activos);
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

  const handleUpdateEstado = async (id: number, nuevoEstado: Pedido['estado']) => {
    setLoading(true);
    try {
      await axios.put(`${API}/estado/${id}`, null, { params: { estado: nuevoEstado } });
      fetchPedidos();
      Alert.alert("Éxito", `Pedido ${id} actualizado a "${nuevoEstado}"`);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado del pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.rol !== 'delivery') {
    return <ActivityIndicator size="large" color="#4f46e5" className="flex-1 justify-center" />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* BOTÓN SALIR */}
      <View className="bg-indigo-700 p-4 pt-12 flex-row justify-between items-center shadow-lg">
        <Text className="text-2xl font-bold text-white">Panel de Reparto</Text>
        <TouchableOpacity 
          onPress={() => {
            logout();
            router.replace('/auth/login');
          }} 
          className="flex-row items-center p-1 rounded-md border border-indigo-500 bg-indigo-600"
        >
          <Text className="text-white text-xs mr-1 font-semibold">Salir</Text>
          <Ionicons name="log-out-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchPedidos} colors={['#4f46e5']} />
        }
      >
        <Text className="text-xl font-bold text-gray-800 mb-4 mt-2 border-b border-indigo-200 pb-2">
          Pedidos Activos ({pedidos.length})
        </Text>

        {loading && !refreshing && <ActivityIndicator size="small" color="#4f46e5" className="my-4" />}

        {pedidos.length === 0 && !loading && (
          <View className="bg-white p-6 rounded-lg border border-indigo-200 mt-10 items-center">
            <Ionicons name="checkmark-circle-outline" size={50} color="#4f46e5" />
            <Text className="mt-4 text-gray-600 text-base font-semibold text-center">
              ¡Todo entregado! No hay pedidos pendientes.
            </Text>
          </View>
        )}

        {pedidos.map(pedido => (
          <PedidoCard key={pedido.idVentaOnline} pedido={pedido} onUpdateEstado={handleUpdateEstado} />
        ))}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
