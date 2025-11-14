import instance from "@/lib/intance"
import { sleep } from "@/lib/sleep"
import { Mesa } from "@/types/mesa.types"


export const getMesa = async (): Promise<Mesa[]> => {
    await sleep(2)
    try {
        const res = await instance.get("/getMesa")
        return res.data.data

    } catch (error) {
        throw new Error("Error de fecht  de menu")
    }
}