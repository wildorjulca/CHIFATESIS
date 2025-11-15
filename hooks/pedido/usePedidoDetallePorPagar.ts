import { getPedidosDetallesPorPagarService } from "@/action/pedido/pedido"
import { useQuery } from "@tanstack/react-query"


export const usePedidoDetallePorPagar = () => {
    const queryPedidoDetallePorPagar = useQuery({
        queryKey: ["queryPedidoDetallePorPagar-list"],
        queryFn: getPedidosDetallesPorPagarService
    })

    return queryPedidoDetallePorPagar
}