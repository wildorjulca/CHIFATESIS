import { bodyPedido, savePedido } from "@/action/pedido/pedido"
import { useMutation } from "@tanstack/react-query"


export const usePedidoMutation = () => {
    const savemutationPedido = useMutation({
        mutationKey: ["savePedido"],
        mutationFn: (data: bodyPedido) => savePedido(data)
    })
    return savemutationPedido
}