
import { Authenticate } from '@/action';
import { useAuthStore } from '@/store/auth/auth-store';
import { UserInfo } from '@/types/user.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';


interface Props {
    correo: string,
    clave: string
}
export const useAuthMutation = () => {

    const queryClient = useQueryClient()
    const { setUser } = useAuthStore()

    const queryAuthMutation = useMutation({
        mutationKey: ["auth-login"],
        mutationFn: (user: Props) => Authenticate(user),
        onSuccess: (data, variables, onMutateResult, context) => {
            setUser(data.user)
            // queryClient.setQueryData<UserInfo[]>(
            //     ["addresUser", user?.id],
            //     (old) => {
            //         if (!old) {
            //             addDireccionPedido(data)
            //             return [old]
            //         }
            //         addDireccionPedido(data)
            //         return [...old, data]

            //     }
            // )
            // console.log(data, variables, onMutateResult, context)
            // router.navigate('/(stack)/checkout')
            router.navigate("/(tabs)/home")

        },
        onError: (error, variables, onMutateResult, context) => {
            console.log(error, variables, onMutateResult, context)
        },
        retry: false,
    })

    return queryAuthMutation


}