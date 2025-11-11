import instance from "@/lib/intance"
import { sleep } from "@/lib/sleep"
import { Bebida } from "@/types/bebida.types"
import { Menu } from "@/types/menu.types"


export const getBebida = async (): Promise<Bebida[]> => {
    await sleep(2)
    try {
        const res = await instance.get("/getBebida")
        return res.data.data

    } catch (error) {
        throw new Error("Error de fecht  de menu")
    }
}