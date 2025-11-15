import { getPedidosDetallesPorPagarService } from "@/action/pedido/pedido"
import { getAllUsuariosService } from "@/action/usuario/usuario"
import { useQuery } from "@tanstack/react-query"


export const useUsuariosAll = () => {
    const queryUsuariosAll = useQuery({
        queryKey: ["queryUsuariosAll-list"],
        queryFn: getAllUsuariosService
    })

    return queryUsuariosAll
}