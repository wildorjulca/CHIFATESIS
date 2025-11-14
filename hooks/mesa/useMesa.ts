import { getMesa } from "@/action/mesa/getMesa"
import { useQuery } from "@tanstack/react-query"


export const useMesa =()=>{
    const queryMesa = useQuery({
        queryKey: ["mesa-list"],
        queryFn: getMesa
    })

    return queryMesa
}