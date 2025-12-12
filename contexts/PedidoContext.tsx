import { useAuth } from '@/contexts/AuthContext';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Tipos de Pedido
export type Pedido = {
  idVentaOnline: number;
  total: number;
  fechaVenta: string;
  estado: 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'CANCELADO';
  usuario: {
    idUsuario: number;
    nombre: string;
  };
};

// Tipo de Notificación para la vista del Cliente
export interface NotificacionCliente {
    id: number;
    idVentaOnline: number;
    mensaje: string;
    // Usamos el estado aquí para rastrear si ya notificamos este estado antes
    estado: Pedido['estado']; 
    fecha: string;
}


interface PedidoContextType {
  pedidosGlobal: Pedido[];
  setPedidosGlobal: (pedidos: Pedido[]) => void;
  notificaciones: NotificacionCliente[];
  estadoPedido: string;
    // Propiedades para la funcionalidad de Notificación Automática (Toast/Banner)
    notificacionActiva: NotificacionCliente | null;
    marcarNotificacionComoLeida: () => void;
}

// 📌 Nota: Creamos un contexto sin el setter de notificaciones, ya que ahora se gestiona internamente
const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

// Clave para guardar el último estado notificado en AsyncStorage (opcional, pero útil)
const LAST_NOTIFIED_STATE_KEY = '@last_notified_state';

export const PedidoProvider = ({ children }: { children: ReactNode }) => {
  const [pedidosGlobal, setPedidosGlobal] = useState<Pedido[]>([]);
  const [notificaciones, setNotificaciones] = useState<NotificacionCliente[]>([]);
  const [estadoPedido, setEstadoPedido] = useState('Esperando actualización...');
    
    // 🎯 NUEVO: Estado para la notificación que se mostrará automáticamente
    const [notificacionActiva, setNotificacionActiva] = useState<NotificacionCliente | null>(null);
    // NUEVO: Estado para guardar el último estado que notificamos para evitar notificaciones repetidas
    const [lastNotifiedState, setLastNotifiedState] = useState<Pedido['estado'] | null>(null);

  const { user } = useAuth();

    // 🎯 NUEVO: Función para quitar el contador del Header
    const marcarNotificacionComoLeida = () => {
        setNotificacionActiva(null);
    };


  useEffect(() => {
    if (!user || user.rol !== 'cliente') {
        setNotificaciones([]);
        setNotificacionActiva(null);
        return;
    }
    
    const misPedidos = pedidosGlobal.filter(p => p.usuario.idUsuario === user.idUsuario);
    
    const nuevasNotificaciones: NotificacionCliente[] = [];
    let estadoPrincipal = 'No tienes pedidos activos.';
    let nuevaAlerta: NotificacionCliente | null = null;
    
    if (misPedidos.length > 0) {
        const ultimoPedido = misPedidos.sort((a, b) => new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime())[0];
        estadoPrincipal = `Orden #${ultimoPedido.idVentaOnline} - ${ultimoPedido.estado}`;

        const nuevoEstado = ultimoPedido.estado;
        let mensaje = '';
        
        switch (nuevoEstado) {
            case 'PENDIENTE':
                // Generalmente no notificamos PENDIENTE, salvo que sea la creación.
                mensaje = `Tu orden #${ultimoPedido.idVentaOnline} está PENDIENTE de recolección.`;
                break;
            case 'EN_RUTA':
                mensaje = `¡Tu orden #${ultimoPedido.idVentaOnline} está EN CAMINO!`;
                break;
            case 'ENTREGADO':
                mensaje = `Tu orden #${ultimoPedido.idVentaOnline} fue ENTREGADA.`;
                break;
            case 'CANCELADO':
                mensaje = `Tu orden #${ultimoPedido.idVentaOnline} ha sido CANCELADA.`;
                break;
        }

        if (mensaje) {
            nuevaAlerta = {
                id: ultimoPedido.idVentaOnline,
                idVentaOnline: ultimoPedido.idVentaOnline,
                mensaje: mensaje,
                estado: nuevoEstado,
                fecha: new Date().toLocaleTimeString(),
            };
            // 1. Añadir al historial de notificaciones
            nuevasNotificaciones.push(nuevaAlerta);
            
            // 2. 🎯 Disparar la Notificación Activa (solo si el estado ha cambiado o no ha sido notificado)
            if (nuevoEstado !== lastNotifiedState) {
                setNotificacionActiva(nuevaAlerta);
                setLastNotifiedState(nuevoEstado); // Guardar el nuevo estado como notificado
            }
        }
    }
    
    setNotificaciones(nuevasNotificaciones);
    setEstadoPedido(estadoPrincipal);
    
    // Si la alerta activa fue marcada como leída, pero el estado en el backend no ha cambiado,
    // No reseteamos notificacionActiva aquí, para que el componente que la consume pueda mostrarla.
    
  }, [pedidosGlobal, user, lastNotifiedState]);


  return (
    <PedidoContext.Provider value={{ 
        pedidosGlobal, 
        setPedidosGlobal, 
        notificaciones, 
        estadoPedido,
        notificacionActiva, // 🎯 Propiedad para el banner automático
        marcarNotificacionComoLeida, // 🎯 Función para quitar el contador
    }}>
      {children}
    </PedidoContext.Provider>
  );
};

export const usePedidos = () => {
  const context = useContext(PedidoContext);
  if (context === undefined) {
    throw new Error('usePedidos debe usarse dentro de un PedidoProvider');
  }
  return context;
};

export type { Pedido as PedidoType };
