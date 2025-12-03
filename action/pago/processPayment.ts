import instance from "@/lib/intance"
import { sleep } from "@/lib/sleep";

export interface PaymentDataProps {
    id_pedido: number;
    id_cajero?: number;
    metodo_pago: 'efectivo' | 'yape' | 'plin' | 'tarjeta' | 'transferencia'
    monto: number;
    monto_recibido?: number;
    cambio?: number;
    comprobante?: string;
    pagado: boolean;

}

export const processPayment = async (payment: PaymentDataProps) => {
    await sleep(2)
    try {
        const response = await instance.post("/processPayment", payment)
        return response.data
    } catch (error) {
        console.log(error)
        throw new Error("Error al procesar el pago");

    }
}