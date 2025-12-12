import React, { createContext, useContext, useState } from "react";

// Tipo de pedido
export interface Pedido {
  idVentaOnline: number;
  usuario: { nombre: string };
  estado: "PENDIENTE" | "EN_RUTA" | "ENTREGADO" | "CANCELADO";
  total: number;
  fechaVenta: string;
}

// Tipo de notificación
interface Notificacion {
  id: number;
  mensaje: string;
  fecha: string;
}

// Tipo del contexto
interface PedidoContextType {
  estadoPedido: string;
  cambiarEstadoPedido: (estado: string) => void;

  pedidosGlobal: Pedido[];
  setPedidosGlobal: (pedidos: Pedido[]) => void;

  notificaciones: Notificacion[];
  setNotificaciones: (notis: any) => void; // aquí puedes definir mejor según cómo quieras
  agregarNotificacion: (mensaje: string) => void;
}

const PedidoContext = createContext<PedidoContextType>({
  estadoPedido: "Pendiente",
  cambiarEstadoPedido: () => {},

  pedidosGlobal: [],
  setPedidosGlobal: () => {},

  notificaciones: [],
  setNotificaciones: () => {},
  agregarNotificacion: () => {},
});

export const PedidoProvider = ({ children }: any) => {
  const [estadoPedido, setEstadoPedido] = useState<string>("Pendiente");
  const [pedidosGlobal, setPedidosGlobal] = useState<Pedido[]>([]);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const cambiarEstadoPedido = (estado: string) => {
    setEstadoPedido(estado);
    agregarNotificacion(`Tu pedido cambió a: ${estado}`);
  };

  const agregarNotificacion = (mensaje: string) => {
    setNotificaciones((prev) => [
      { id: Date.now(), mensaje, fecha: new Date().toLocaleString() },
      ...prev,
    ]);
  };

  return (
    <PedidoContext.Provider
      value={{
        estadoPedido,
        cambiarEstadoPedido,

        pedidosGlobal,
        setPedidosGlobal,

        notificaciones,
        setNotificaciones,
        agregarNotificacion,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

// Hook para usar el contexto
export const usePedidos = () => useContext(PedidoContext);
