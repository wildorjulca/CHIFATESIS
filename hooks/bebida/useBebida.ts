import { getBebida } from "@/action/menu/getBebidas"
import { useQuery } from "@tanstack/react-query"


export const useBebida = () => {

    const queryBebida = useQuery({
        queryKey: ["bebida-list"],
        queryFn: getBebida
    })

    return queryBebida

}