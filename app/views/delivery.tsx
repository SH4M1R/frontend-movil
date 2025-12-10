import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
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

// Interfaz para definir la estructura de un Pedido
interface Pedido {
  id: number;
  cliente: string;
  direccion: string;
  estado: 'Pendiente' | 'En Ruta' | 'Entregado' | 'Cancelado';
  total: number;
  createdAt: string;
}

// Datos de ejemplo simulados para la vista de Delivery
const initialPedidos: Pedido[] = [
  { id: 101, cliente: "Ana Gómez", direccion: "Av. Las Flores 123, Miraflores", estado: 'Pendiente', total: 45.50, createdAt: '2025-12-09T10:00:00Z' },
  { id: 102, cliente: "Juan Pérez", direccion: "Calle Los Pinos 45, San Isidro", estado: 'En Ruta', total: 78.90, createdAt: '2025-12-09T11:30:00Z' },
  { id: 103, cliente: "María López", direccion: "Jr. Tacna 89, Surco", estado: 'Pendiente', total: 32.00, createdAt: '2025-12-09T13:45:00Z' },
  { id: 104, cliente: "Carlos Ruiz", direccion: "Urb. Sol de Oro 10, La Molina", estado: 'Entregado', total: 110.20, createdAt: '2025-12-08T09:00:00Z' },
];

// Componente individual para renderizar cada pedido (Card)
const PedidoCard = ({ pedido, onUpdateEstado }: { pedido: Pedido, onUpdateEstado: (id: number, nuevoEstado: Pedido['estado']) => void }) => {
  
  let statusClass = '';
  let nextStatusText = '';
  let nextStatusValue: Pedido['estado'] | null = null;
  
  // Lógica para estilos (NativeWind/Indigo) y el próximo estado
  switch (pedido.estado) {
    case 'Pendiente':
      statusClass = 'bg-yellow-100 border-yellow-500';
      nextStatusText = 'Recoger (En Ruta)';
      nextStatusValue = 'En Ruta';
      break;
    case 'En Ruta':
      statusClass = 'bg-indigo-100 border-indigo-500';
      nextStatusText = 'Finalizar (Entregado)';
      nextStatusValue = 'Entregado';
      break;
    case 'Entregado':
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
        <Text className="text-xl font-bold text-gray-800">Orden #{pedido.id}</Text>
        <Text className="text-indigo-600 font-extrabold text-lg">${pedido.total.toFixed(2)}</Text>
      </View>

      <Text className="text-gray-700 text-sm mb-1">
        <Text className="font-semibold">Cliente:</Text> {pedido.cliente}
      </Text>
      <Text className="text-gray-700 text-sm mb-3">
        <Text className="font-semibold">Dirección:</Text> {pedido.direccion}
      </Text>

      <View className="flex-row justify-between items-center pt-2 border-t border-gray-100 mt-2">
        <View>
          <Text className="text-xs text-gray-500">Estado Actual:</Text>
          <Text className="text-base font-bold text-indigo-700">{pedido.estado}</Text>
        </View>
        
        {nextStatusValue && (
          <TouchableOpacity 
            className="bg-indigo-600 px-4 py-2 rounded-lg"
            onPress={() => onUpdateEstado(pedido.id, nextStatusValue!)}
            disabled={pedido.estado === 'Entregado'}
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
  // Filtramos los pedidos que no están entregados ni cancelados
  const [pedidos, setPedidos] = useState<Pedido[]>(initialPedidos.filter(p => p.estado !== 'Entregado' && p.estado !== 'Cancelado'));
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ⚠️ Redirección de seguridad (ya no es necesario si se usa en el layout, pero es buena práctica)
  useEffect(() => {
    if (user && user.rol !== 'delivery') {
      Alert.alert("Acceso Denegado", "Solo repartidores pueden acceder a esta vista.");
      router.replace('/views/home');
    }
  }, [user]);

  const fetchPedidos = async () => {
    // SIMULACIÓN: Lógica para llamar a tu API y obtener pedidos asignados
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      // En un caso real, aquí obtendrías los datos actualizados de la API.
      const activePedidos = initialPedidos.filter(p => p.estado !== 'Entregado' && p.estado !== 'Cancelado');
      setPedidos(activePedidos);
      setRefreshing(false);
      setLoading(false);
    }, 1000); 
  };
  
  useEffect(() => {
    fetchPedidos();
  }, []);


  const handleUpdateEstado = async (id: number, nuevoEstado: Pedido['estado']) => {
    setLoading(true);
    
    try {
      // Lógica real: Llamar a la API para actualizar el estado del pedido en tu backend
      
      // SIMULACIÓN de la actualización
      const updatedPedidos = pedidos.map(p => 
        p.id === id ? { ...p, estado: nuevoEstado } : p
      );
      
      // Filtramos inmediatamente para que los pedidos "Entregado" desaparezcan
      setPedidos(updatedPedidos.filter(p => p.estado !== 'Entregado'));
      
      Alert.alert("Éxito", `Pedido ${id} actualizado a "${nuevoEstado}"`);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado del pedido.");
    } finally {
      setLoading(false);
    }
  };

  // Muestra un indicador de carga si el usuario está cargando o no es delivery (previniendo flicker)
  if (!user || user.rol !== 'delivery') {
    return <ActivityIndicator size="large" color="#4f46e5" className="flex-1 justify-center" />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      
      {/* Header (NativeWind/Indigo) */}
      <View className="bg-indigo-700 p-4 pt-12 flex-row justify-between items-center shadow-lg">
        <Text className="text-2xl font-bold text-white">Panel de Reparto</Text>
        <TouchableOpacity 
          onPress={logout} 
          className="flex-row items-center p-1 rounded-md border border-indigo-500 bg-indigo-600"
        >
          <Text className="text-white text-xs mr-1 font-semibold">Salir</Text>
          <Ionicons name="log-out-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="p-4"
        refreshControl={
          // Control de refresco con color Indigo
          <RefreshControl refreshing={refreshing} onRefresh={fetchPedidos} colors={['#4f46e5']} />
        }
      >
        <Text className="text-xl font-bold text-gray-800 mb-4 mt-2 border-b border-indigo-200 pb-2">
          Pedidos Activos ({pedidos.length})
        </Text>

        {loading && !refreshing && (
          <ActivityIndicator size="small" color="#4f46e5" className="my-4" />
        )}

        {pedidos.length === 0 && !loading && (
          <View className="bg-white p-6 rounded-lg border border-indigo-200 mt-10 items-center">
            <Ionicons name="checkmark-circle-outline" size={50} color="#4f46e5" />
            <Text className="mt-4 text-gray-600 text-base font-semibold text-center">
              ¡Todo entregado! No hay pedidos pendientes.
            </Text>
          </View>
        )}

        {pedidos.map(pedido => (
          <PedidoCard key={pedido.id} pedido={pedido} onUpdateEstado={handleUpdateEstado} />
        ))}
        
        <View className="h-20" /> 
      </ScrollView>
    </View>
  );
}