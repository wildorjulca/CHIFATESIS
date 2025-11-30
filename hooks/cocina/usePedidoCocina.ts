import { getPedidoCocinaService, type PedidoCocina } from "@/action/cocina/getPedidococina"
import { useQuery } from "@tanstack/react-query"

export const usePedidoCocina = () => {
  const queryPedidoCocina = useQuery<PedidoCocina[], Error>({
    queryKey: ["pedidos-cocina"],
    queryFn: getPedidoCocinaService,
    refetchInterval: 10000, 
    staleTime: 5000, 
    retry: 2,
  })

  return queryPedidoCocina
}