import instance from "@/lib/intance"
import { sleep } from "@/lib/sleep"
import { Menu } from "@/types/menu.types"


export const getMenu = async (): Promise<Menu[]> => {
    await sleep(2)
    try {
        const res = await instance.get("/getMenu")
        return res.data.data

    } catch (error) {
        throw new Error("Error de fecht  de menu")
    }

}