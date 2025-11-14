import instance from "@/lib/intance"
import { sleep } from "@/lib/sleep";


export interface bodyPedido {
    id_mesa: number;
    id_mesero: number;
    nombre_cliente: string | null, // ✅ <--- AGREGA ESTO
    id_cliente: number | null;
    // nombre_cliente: string;
    observaciones?: string;
    items: Array<{
        id_menu?: number;
        id_bebida?: number;
        cantidad: number;
        precio_unitario: number;
        observaciones?: string;
    }>
}
export const savePedido = async (data: bodyPedido) => {
    await sleep(2)
    try {
        const response = await instance.post("/savePedido", data)
        return response.data
    } catch (error: any) {
        console.log(error.response)
        throw new Error("Error al guardar el pedido");
    }
}