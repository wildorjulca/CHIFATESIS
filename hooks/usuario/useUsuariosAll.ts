import { getAllUsuariosService, type UsuariosResponse } from "@/action/usuario/usuario"
import { useQuery } from "@tanstack/react-query"

export const useUsuariosAll = () => {
  const queryUsuariosAll = useQuery<UsuariosResponse, Error>({
    queryKey: ["usuarios-all"],
    queryFn: getAllUsuariosService,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  return queryUsuariosAll
}