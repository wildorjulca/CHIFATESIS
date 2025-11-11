import { create } from "zustand"

interface UserType {
    id: number
    correo: string,
    rol: string
}

interface Store {
    user: UserType | null
    isAuthenticated: boolean
    setUser: (user: UserType) => void
    clearUser: () => void
}

export const useAuthStore = create<Store>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: true,
        }),

    clearUser: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),
}))
