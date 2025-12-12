import { useAuth } from "@/contexts/AuthContext";
import { Pedido as PedidoType, usePedidos } from "@/contexts/PedidoContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, View } from "react-native";

export default function PedidosScreen() {
    const { 
        pedidosGlobal, 
        setPedidosGlobal, 
        notificaciones, 
        estadoPedido,
        notificacionActiva,
        marcarNotificacionComoLeida
    } = usePedidos();
    
    const { user } = useAuth();
    
    const [loading, setLoading] = useState(true); 
    const [refreshing, setRefreshing] = useState(false);

    const API = "http://10.248.48.237:8500/api/pago";

    const pedidosDelCliente = pedidosGlobal.filter(p => p.usuario.idUsuario === user?.idUsuario);

    const fetchPedidos = async (isManualRefresh: boolean = false) => {
        if (isManualRefresh) setRefreshing(true);

        try {
            const { data } = await axios.get<PedidoType[]>(`${API}/listar`);
            setPedidosGlobal(data || []);
        } catch (error) {
            console.log("Error al cargar pedidos:", error);
        } finally {
            setLoading(false); 
            if (isManualRefresh) setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPedidos();

        const intervalId = setInterval(() => {
            fetchPedidos(false); 
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // LÓGICA PARA MOSTRAR LA ALERTA AUTOMÁTICA
    useEffect(() => {
        if (notificacionActiva) {
            Alert.alert(
                "¡Actualización de Pedido!",
                notificacionActiva.mensaje,
                [
                    {
                        text: "Entendido",
                        onPress: marcarNotificacionComoLeida
                    }
                ],
                { cancelable: false }
            );
        }
    }, [notificacionActiva]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="mt-4 text-gray-500">Cargando pedidos...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-gray-100 p-5"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => fetchPedidos(true)}
                    colors={["#4f46e5"]}
                />
            }
        >
            <View className="bg-white p-5 rounded-xl shadow mb-5">
                <Text className="text-xl font-bold text-indigo-700">
                    Estado actual de tu último pedido:
                </Text>

                <Text className="text-2xl font-semibold mt-2 text-gray-800">
                    {estadoPedido}
                </Text>
            </View>

            <View className="bg-white p-5 rounded-xl shadow mb-5">
                <Text className="text-xl font-bold text-indigo-700 mb-3">
                    Mis Pedidos ({pedidosDelCliente.length})
                </Text>

                {pedidosDelCliente.length === 0 ? (
                    <Text className="text-gray-500">No tienes pedidos registrados.</Text>
                ) : (
                    pedidosDelCliente.map((pedido) => (
                        <View key={pedido.idVentaOnline} className="border-b border-gray-200 py-3">
                            <Text className="text-lg font-semibold text-gray-800">
                                Orden #{pedido.idVentaOnline} - {pedido.usuario.nombre}
                            </Text>
                            <Text className="text-gray-600">
                                Total: S/ {pedido.total.toFixed(2)}
                            </Text>
                            <Text className="text-gray-600 font-bold">
                                Estado: {pedido.estado}
                            </Text>
                            <Text className="text-gray-500 text-xs">
                                {new Date(pedido.fechaVenta).toLocaleString()}
                            </Text>
                        </View>
                    ))
                )}
            </View>

            <View className="bg-white p-5 rounded-xl shadow">
                <Text className="text-xl font-bold text-indigo-700 mb-3">
                    Notificaciones de Estado ({notificaciones.length})
                </Text>

                {notificaciones.length === 0 ? (
                    <Text className="text-gray-500">No hay notificaciones de estado recientes.</Text>
                ) : (
                    notificaciones.map((n) => (
                        <View key={n.id} className="border-b border-gray-300 py-3">
                            <Text className="text-lg text-gray-800 font-semibold">{n.mensaje}</Text>
                            <Text className="text-xs text-gray-500">{n.fecha}</Text>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}