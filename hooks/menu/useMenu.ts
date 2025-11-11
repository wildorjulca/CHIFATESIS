import { getMenu } from "@/action/menu/getMenu"
import { useQuery } from "@tanstack/react-query"


export const useMenu =()=>{
    const queryMenu = useQuery({
        queryKey: ["menu_list"],
        queryFn: getMenu
    })

    return queryMenu
}