import instance from "@/lib/intance"
import { AuthResponse, UserInfo } from "@/types/user.types"


interface Props {
    correo: string,
    clave: string
}
export const Authenticate = async (user: Props): Promise<UserInfo> => {

    try {
        const response = await instance.post(`/auth/login`, {
            correo: user.correo,
            clave: user.clave
        })
        return response.data

    } catch (error: any) {
        console.log("ERROR EN AUTHENTICATE", error)
        if (error.response) {
            throw {
                status: error.response.status,
                ...error.response.data,
            } as AuthResponse
        }
        throw { status: 500, message: "Error en la red o servidor", ok: false } as AuthResponse
    }

}