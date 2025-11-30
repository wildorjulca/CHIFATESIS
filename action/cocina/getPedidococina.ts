import instance from "@/lib/intance"
import { sleep } from "@/lib/sleep";

export interface ItemPedidoCocina {
  id_item_pedido: number;
  tipo: 'comida' | 'bebida';
  nombre: string | null;
  categoria: string | null;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  observaciones: string | null;
  tiempo_preparacion?: number;
  detalles: {
    descripcion?: string;
    tamano?: string;
  };
}

export interface PedidoCocina {
  id_pedido: number;
  numero_pedido: string;
  nombre_cliente: string;
  mesa: {
    id_mesa: number;
    nombre_mesa: string;
    capacidad: number;
  } | null;
  mesero: {
    id_mesero: number;
    nombre_mesero: string;
  } | null;
  estado: string;
  total: number;
  observaciones: string | null;
  fecha_pedido: string;
  items: ItemPedidoCocina[];
}

export const getPedidoCocinaService = async (): Promise<PedidoCocina[]> => {
  await sleep(2);
  try {
    const response = await instance.get("/getPedidosCocina");
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error("Estructura de respuesta inesperada:", response.data);
      throw new Error("Estructura de datos incorrecta");
    }
  } catch (error: any) {
    console.error("Error en getPedidoCocinaService:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Error al cargar los pedidos de cocina");
    }
  }
}