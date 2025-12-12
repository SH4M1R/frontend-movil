import { Pedido as PedidoType, usePedidos } from "@/contexts/PedidoContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";

export default function PedidosScreen() {
  const { pedidosGlobal, setPedidosGlobal, notificaciones, estadoPedido } = usePedidos();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const API = "http://10.248.48.237:8500/api/pago";

  const fetchPedidos = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const { data } = await axios.get<PedidoType[]>(`${API}/listar`);
      setPedidosGlobal(data || []);
    } catch (error) {
      console.log("Error al cargar pedidos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-gray-100 p-5"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchPedidos}
          colors={["#4f46e5"]}
        />
      }
    >
      {/* Estado del Pedido */}
      <View className="bg-white p-5 rounded-xl shadow mb-5">
        <Text className="text-xl font-bold text-indigo-700">
          Estado actual del pedido:
        </Text>

        <Text className="text-2xl font-semibold mt-2 text-gray-800">
          {estadoPedido}
        </Text>
      </View>

      {/* Pedidos */}
      <View className="bg-white p-5 rounded-xl shadow mb-5">
        <Text className="text-xl font-bold text-indigo-700 mb-3">
          Pedidos ({pedidosGlobal.length})
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4f46e5" />
        ) : pedidosGlobal.length === 0 ? (
          <Text className="text-gray-500">No hay pedidos.</Text>
        ) : (
          pedidosGlobal.map((pedido) => (
            <View key={pedido.idVentaOnline} className="border-b border-gray-200 py-3">
              <Text className="text-lg font-semibold text-gray-800">
                Orden #{pedido.idVentaOnline} - {pedido.usuario.nombre}
              </Text>
              <Text className="text-gray-600">
                Total: S/ {pedido.total.toFixed(2)}
              </Text>
              <Text className="text-gray-600">
                Estado: {pedido.estado}
              </Text>
              <Text className="text-gray-500 text-xs">
                {new Date(pedido.fechaVenta).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Notificaciones */}
      <View className="bg-white p-5 rounded-xl shadow">
        <Text className="text-xl font-bold text-indigo-700 mb-3">
          Notificaciones
        </Text>

        {notificaciones.length === 0 ? (
          <Text className="text-gray-500">No hay notificaciones aún</Text>
        ) : (
          notificaciones.map((n) => (
            <View key={n.id} className="border-b border-gray-300 py-3">
              <Text className="text-lg text-gray-800">{n.mensaje}</Text>
              <Text className="text-xs text-gray-500">{n.fecha}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
